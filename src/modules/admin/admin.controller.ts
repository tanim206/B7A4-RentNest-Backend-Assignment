import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUser();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All user return successfully",
      data: { result },
    });
  },
);
const updatedUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { activeStatus } = req.body;

    if (activeStatus !== "BANNED" && activeStatus !== "UNBANNED") {
      throw new Error(
        "Invalid status. Status must be either 'BANNED' or 'UNBANNED'.",
      );
    }
    const result = await adminService.updateUserStatus(
      id as string,
      activeStatus,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: { result },
    });
  },
);

export const adminController = {
  getAllUser,
  updatedUserStatus,
};
