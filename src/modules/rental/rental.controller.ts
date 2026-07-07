import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { rentalRequestServices } from "./rental.service";

const createdRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tenantId, propertieId } = req.body;

    if (!tenantId || !propertieId) {
      throw new Error("tenantId and propertyId are required");
    }

    const result = await rentalRequestServices.createRentalRequest(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rantal request successfully",
      data: { result },
    });
  },
);

////
const getRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalRequestServices.getRentalRequest();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rantal request successfully",
      data: { result },
    });
  },
);
const getRentalRequestByID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalRequestServices.getRentalRequestByID();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rantal request successfully",
      data: { result },
    });
  },
);

export const rentalRequestController = {
  createdRentalRequest,
  getRentalRequest,
  getRentalRequestByID,
};
