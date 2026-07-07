import {
  PropertiesStatus,
  RentalStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./rental.interface";

const createRentalRequest = async (payload: IRentalRequest) => {
  const propertieExists = await prisma.properties.findUnique({
    where: {
      id: payload.propertieId,
    },
  });

  if (!propertieExists) {
    throw new Error("Property not found");
  }

  if (propertieExists.availabilityStatus === PropertiesStatus.BOOKED) {
    throw new Error("Property already booked");
  }

  const tenantExists = await prisma.user.findUnique({
    where: { id: payload.tenantId },
  });

  if (!tenantExists) {
    throw new Error(
      "You are not logged in or registered. Please log in first.",
    );
  }

  const newRentalRequest = await prisma.rentalRequest.create({
    data: {
      propertieId: payload.propertieId,
      tenantId: payload.tenantId,
    },
    include: {
      properties: true,
      tenant: true,
    },
  });

  return newRentalRequest;
};

const getAllRentalRequest = async (tenantId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
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
    throw new Error("No rental requests found for this tenant.");
  }

  return requests;
};
const getRentalRequestByID = async (tenantId: string, requestId: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      properties: true,
    },
  });
  
  if (!request) {
    throw new Error("Rental request not found.");
  }

  if (request.tenantId !== tenantId) {
    throw new Error("You are not authorized to view this request.");
  }

  return request;
};

export const rentalRequestServices = {
  createRentalRequest,
  getAllRentalRequest,
  getRentalRequestByID,
};
