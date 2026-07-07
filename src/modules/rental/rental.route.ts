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
router.get("/", auth(Role.TENANT), rentalRequestController.getAllRentalRequest);

router.get(
  "/:requestId",
  auth(Role.TENANT),
  rentalRequestController.getRentalRequestByID,
);
router.patch(
  "/:requestId/",
  auth(Role.LANDLORD),
  rentalRequestController.approveOrRejectRentalRequest,
);

export const rentalRouter = router;
