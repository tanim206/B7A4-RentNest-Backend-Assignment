import { Router } from "express";
import { userController } from "./user.controller";
import { authController } from "../auth/auth.controller";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/login", authController.loginUser);

// router.post("/login", userController.loginUser);
// router.get(
//   "/me",
//   auth(Role.USER, Role.ADMIN, Role.AUTHOR),
//   userController.getMyProfile,
// );

// router.put(
//   "/my-profile",
//   auth(Role.USER, Role.ADMIN, Role.AUTHOR),
//   userController.updateMyProfile,
// );

export const userRouter = router;
