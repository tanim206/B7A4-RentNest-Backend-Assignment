import { Router } from "express";
import { propertiesController } from "./properties.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
const router = Router();

router.post(
  "/properties",
  auth(Role.LANDLORD),
  propertiesController.createProperties,
);
router.put(
  "/properties/:id",
  auth(Role.LANDLORD),
  propertiesController.updateProperty,
);
router.delete(
  "/properties/:id",
  auth(Role.LANDLORD),
  propertiesController.deleteProperty,
);
//  router.get("/properties/:id", propertiesController.getPropertyById);
router.get("/", propertiesController.getAllPropertie);

export const propertiesRouter = router;
