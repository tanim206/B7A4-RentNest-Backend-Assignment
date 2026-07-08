import { prisma } from "../../lib/prisma";
import { RentalStatus } from "../../../generated/prisma/enums";

interface IReviewInputByTenant {
  tenantId: string;
  propertyId: string;
  comment: string;
}

const createReviewByTenant = async (payload: IReviewInputByTenant) => {
  const property = await prisma.properties.findUnique({
    where: { id: payload.propertyId },
  });

  if (!property) {
    throw new Error("Property not found.");
  }

  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      propertieId: payload.propertyId,
      tenantId: payload.tenantId,
      rentalStatus: RentalStatus.COMPLETED,
    },
  });

  if (!rentalRequest) {
    throw new Error(
      "Review can only be created after a completed rental for this property.",
    );
  }

  const review = await prisma.review.create({
    data: {
      comment: payload.comment,
      tenantId: payload.tenantId,
      propertyId: payload.propertyId,
    },
  });

  return review;
};

export const reviewService = {
  createReviewByTenant,
};
