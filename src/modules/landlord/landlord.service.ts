import { prisma } from "../../lib/prisma";
import {
  PropertiesStatus,
  RentalStatus,
} from "../../../generated/prisma/enums";

const getLandlordRentalRequests = async (landlordId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      properties: {
        landlordId,
      },
    },
    include: {
      properties: true,
      tenant: {
        omit: {
          password: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (requests.length === 0) {
    throw new Error("No rental requests found for your properties.");
  }

  return requests;
};

const updateLandlordRentalRequestStatus = async (
  requestId: string,
  landlordId: string,
  status: "APPROVED" | "REJECTED",
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: { properties: true },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found.");
  }

  if (rentalRequest.properties.landlordId !== landlordId) {
    throw new Error("You are not authorized to update this rental request.");
  }

  if (rentalRequest.rentalStatus !== RentalStatus.PENDING) {
    throw new Error("This rental request has already been processed.");
  }

  const updatedRequest = await prisma.$transaction(async (tx) => {
    const request = await tx.rentalRequest.update({
      where: { id: requestId },
      data: { rentalStatus: status },
      include: {
        properties: true,
        tenant: {
          omit: {
            password: true,
          },
        },
      },
    });

    await tx.properties.update({
      where: { id: rentalRequest.propertieId },
      data: {
        availabilityStatus:
          status === RentalStatus.APPROVED
            ? PropertiesStatus.BOOKED
            : PropertiesStatus.AVAILABLE,
      },
    });

    return request;
  });

  return updatedRequest;
};

export const landlordServices = {
  getLandlordRentalRequests,
  updateLandlordRentalRequestStatus,
};
