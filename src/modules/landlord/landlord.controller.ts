import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { RentalStatus } from "../../../generated/prisma/enums";
import { landlordServices } from "./landlord.service";

const getLandlordRentalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;

    const result = await landlordServices.getLandlordRentalRequests(landlordId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Landlord rental requests fetched successfully",
      data: result,
    });
  },
);

const updateLandlordRentalRequestStatus = catchAsync(
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

    const result = await landlordServices.updateLandlordRentalRequestStatus(
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

export const landlordController = {
  getLandlordRentalRequests,
  updateLandlordRentalRequestStatus,
};
