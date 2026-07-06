import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { propertiesController } from "../properties/properties.controller";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
  "/properties",
  auth(Role.ADMIN),
  propertiesController.getAllPropertie,
);
router.get("/users", auth(Role.ADMIN), adminController.getAllUser);
router.get(
  "/properties",
  auth(Role.ADMIN),
  propertiesController.getAllPropertie,
);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  adminController.updatedUserStatus,
);

export const adminRouter = router;
