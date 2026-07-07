import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { RentalStatus, Role } from "../../../generated/prisma/enums";
import { rentalRequestServices } from "./rental.service";

const createdRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const payload = {
      ...req.body,
      tenantId,
    };

    if (!tenantId || !payload.propertieId) {
      throw new Error("tenantId and propertyId are required");
    }

    const result = await rentalRequestServices.createRentalRequest(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rantal request successfully",
      data: result,
    });
  },
);

////
const getAllRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const role = req.user?.role;

    const result = await rentalRequestServices.getAllRentalRequest({
      tenantId,
      role,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:
        role === Role.ADMIN
          ? "All rental requests fetched successfully"
          : "My All Rantal request return successfully",
      data: result,
    });
  },
);

const getRentalRequestByID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const requestId = req.params.requestId as string;

    if (!tenantId || !requestId) {
      throw new Error("Tenant ID and Request ID are required");
    }

    const result = await rentalRequestServices.getRentalRequestByID(
      tenantId,
      requestId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request fetched successfully",
      data: result,
    });
  },
);

const approveOrRejectRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const requestId = req.params.requestId as string;
    const { rentalStatus } = req.body;

    if (!landlordId || !requestId) {
      throw new Error("Landlord ID and Request ID are required");
    }

    if (
      rentalStatus !== RentalStatus.APPROVED &&
      rentalStatus !== RentalStatus.REJECTED
    ) {
      throw new Error("Status must be APPROVED or REJECTED");
    }

    const result =
      await rentalRequestServices.approveOrRejectRentalRequestByLandload(
        requestId,
        landlordId,
        rentalStatus,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:
        rentalStatus === RentalStatus.APPROVED
          ? "Rental request approved successfully"
          : "Rental request rejected successfully",
      data: result,
    });
  },
);

export const rentalRequestController = {
  createdRentalRequest,
  getAllRentalRequest,
  getRentalRequestByID,
  approveOrRejectRentalRequest,
};
