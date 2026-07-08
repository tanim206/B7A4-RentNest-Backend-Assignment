import Stripe from "stripe";

import { prisma } from "../../lib/prisma";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const paymentId = session.metadata?.paymentId;

  if (!paymentId) {
    console.log("Webhook: Missing payment metadata for checkout session");
    return;
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    console.log("Webhook: Payment record not found for checkout session");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
        transactionId: session.id,
      },
    });

    await tx.rentalRequest.update({
      where: { id: payment.rentalRequestId },
      data: {
        rentalStatus: RentalStatus.COMPLETED,
      },
    });
  });
};
