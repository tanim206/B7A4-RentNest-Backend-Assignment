import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import {
  PaymentProvider,
  PaymentStatus,
  RentalStatus,
} from "../../../generated/prisma/enums";
import { handleCheckoutCompleted } from "./payment.utils";

type CreatePaymentPayload = {
  rentalRequestId: string;
};

const createCheckSession = async (
  userId: string,
  payload: CreatePaymentPayload,
) => {
  if (!payload?.rentalRequestId) {
    throw new Error("Rental request ID is required.");
  }

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: {
      properties: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found.");
  }

  if (rentalRequest.tenantId !== userId) {
    throw new Error("You are not authorized to pay for this rental request.");
  }

  if (rentalRequest.rentalStatus !== RentalStatus.APPROVED) {
    throw new Error("Only approved rental requests can be paid for.");
  }

  const existingPayment = await prisma.payment.findFirst({
    where: {
      rentalRequestId: rentalRequest.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (
    existingPayment &&
    (existingPayment.status === PaymentStatus.COMPLETED ||
      existingPayment.status === PaymentStatus.PENDING)
  ) {
    if (existingPayment.status === PaymentStatus.COMPLETED) {
      throw new Error("This rental request has already been paid.");
    }

    return {
      paymentUrl: null,
      paymentId: existingPayment.id,
      message: "Payment is already in progress.",
    };
  }

  const amount = Number(rentalRequest.properties.price);

  if (!amount || amount <= 0) {
    throw new Error("Invalid property price.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  const payment = await prisma.payment.create({
    data: {
      amount,
      method: "card",
      provider: PaymentProvider.Stripe,
      status: PaymentStatus.PENDING,
      tenantId: userId,
      rentalRequestId: rentalRequest.id,
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: rentalRequest.properties.title,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${config.app_url}/api/payments/success=true`,
    cancel_url: `${config.app_url}/api/payments/cancel`,
    customer_email: user?.email ?? undefined,
    metadata: {
      userId,
      rentalRequestId: rentalRequest.id,
      paymentId: payment.id,
    },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      transactionId: session.id,
    },
  });

  return {
    paymentUrl: session.url,
    paymentId: payment.id,
    amount: payment.amount,
    sessionId: session.id,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}.`);
      break;
  }
};

export const paymentService = {
  createCheckSession,
  handleWebhook,
};
