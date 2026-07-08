import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { propertiesServices } from "./properties.service";
import { IPropertiesQuery, IUpdatePropertyInput } from "./properties.interface";

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
const getAllPropertie = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await propertiesServices.getAllProperties(query as any);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Properties returned successfully",
      data: result,
    });
  },
);

const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const propertyId = req.params.id as string;
    const payload = req.body as IUpdatePropertyInput;

    const result = await propertiesServices.updatePropertyIntoDB(
      landlordId,
      propertyId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully",
      data: { result },
    });
  },
);
const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const propertyId = req.params.id as string;

     await propertiesServices.deleteProperties(
      landlordId,
      propertyId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property deleted Successfully",
      data: null,
    });
  },
);

const getPropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;

    const result = await propertiesServices.getPropertyById(propertyId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property retrieved successfully",
      data: { result },
    });
  },
);

export const propertiesController = {
  createProperties,
  getAllPropertie,
  updateProperty,
  deleteProperty,
  getPropertyById,
};
