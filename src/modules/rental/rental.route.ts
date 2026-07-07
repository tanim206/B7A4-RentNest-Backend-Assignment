import { Router } from "express";
import { rentalRequestController } from "./rental.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  auth(Role.TENANT),
  rentalRequestController.createdRentalRequest,
);
router.get(
  "/",
  auth(Role.TENANT),
  rentalRequestController.getRentalRequest,
);
router.get(
  "/:id",
  auth(Role.TENANT),
  rentalRequestController.getRentalRequestByID,
);

export const rentalRouter = router;
