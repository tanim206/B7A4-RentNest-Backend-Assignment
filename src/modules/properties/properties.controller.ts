import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { propertiesServices } from "./properties.service";

const createProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const payload = req.body;
    const result = await propertiesServices.createPropertiesIntoDB(
      landlordId,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Propertie created successfully",
      data: { result },
    });
  },
);

export const propertiesController = {
  createProperties,
};
