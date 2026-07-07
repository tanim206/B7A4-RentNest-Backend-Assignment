import { RentalStatus } from "../../../generated/prisma/enums";
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

  const tenantExists = await prisma.user.findUnique({
    where: { id: payload.tenantId },
  });

  if (!tenantExists) {
    throw new Error("Tenant not found");
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

const getRentalRequest = async () => {};

const getRentalRequestByID = async () => {};

export const rentalRequestServices = {
  createRentalRequest,
  getRentalRequest,
  getRentalRequestByID,
};
