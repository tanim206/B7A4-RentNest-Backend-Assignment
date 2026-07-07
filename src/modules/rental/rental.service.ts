import {
  PropertiesStatus,
  RentalStatus,
  Role,
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
    },
  });

  return newRentalRequest;
};

const getAllRentalRequest = async (
  params: {
    tenantId?: string;
    role?: Role;
  } = {},
) => {
  const where = params.role === Role.ADMIN ? {} : { tenantId: params.tenantId };

  const requests = await prisma.rentalRequest.findMany({
    where,
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
    throw new Error(
      params.role === Role.ADMIN
        ? "No rental requests found."
        : "No rental requests found for this tenant.",
    );
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

const approveOrRejectRentalRequestByLandload = async (
  requestId: string,
  landlordId: string,
  status: "APPROVED" | "REJECTED",
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      properties: true,
    },
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
      where: {
        id: requestId,
      },
      data: {
        rentalStatus: status,
      },
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
      where: {
        id: rentalRequest.propertieId,
      },
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

export const rentalRequestServices = {
  createRentalRequest,
  getAllRentalRequest,
  getRentalRequestByID,
  approveOrRejectRentalRequestByLandload,
};
