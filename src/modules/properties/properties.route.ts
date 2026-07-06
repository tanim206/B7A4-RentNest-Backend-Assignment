import { Router } from "express";
import { propertiesController } from "./properties.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
// import { authController } from "./auth.controller";
// import { Role } from "../../../generated/prisma/enums";
// import { auth } from "../../middleware/auth";

const router = Router();

router.post(
  "/properties",
  auth(Role.LANDLORD),
  propertiesController.createProperties,
);

export const propertiesRouter = router;
