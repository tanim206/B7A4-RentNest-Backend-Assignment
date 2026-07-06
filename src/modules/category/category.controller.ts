import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { categoryService } from "./category.service";
import httpStatus from "http-status";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await categoryService.createCategory(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: { result },
    });
  },
);

const getCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategories();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: { result },
    });
  },
);

export const categoryController = {
  createCategory,
  getCategories,
};
