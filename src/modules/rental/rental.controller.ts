import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
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
    const result = await rentalRequestServices.getAllRentalRequest(tenantId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My All Rantal request return successfully",
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

export const rentalRequestController = {
  createdRentalRequest,
  getAllRentalRequest,
  getRentalRequestByID,
};
