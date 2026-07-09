import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { propertiesController } from "../properties/properties.controller";
import { adminController } from "./admin.controller";
import { rentalRequestController } from "../rental/rental.controller";

const router = Router();

router.get(
  "/properties",
  auth(Role.ADMIN),
  propertiesController.getAllPropertie,
);
router.get("/users", auth(Role.ADMIN), adminController.getAllUser);
router.get(
  "/rentals",
  auth(Role.ADMIN),
  rentalRequestController.getAllRentalRequest,
);

router.get(
  "/properties",
  auth(Role.ADMIN),
  propertiesController.getAllPropertie,
);

router.patch("/users/:id", auth(Role.ADMIN), adminController.updatedUserStatus);
router.delete("/users/:id", auth(Role.ADMIN), adminController.deleteUser);

export const adminRouter = router;
