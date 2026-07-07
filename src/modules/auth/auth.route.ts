import { Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post(
  "/register",
  auth(Role.TENANT, Role.LANDLORD),
  authController.registerUser,
);
router.post("/login", authController.loginUser);
router.get(
  "/me",
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  authController.getMyProfile,
);
// router.put(
//   "/me",
//   auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
//   authController.updatedMyProfile,
// );

export const authRouter = router;
