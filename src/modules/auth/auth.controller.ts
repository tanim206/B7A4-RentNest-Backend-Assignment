import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { authService } from "./auth.service";
import httpStatus from "http-status";
const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.loginUser(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User login successfully",
      data: { result },
    });
  },
);

export const authController = {
  loginUser,
};