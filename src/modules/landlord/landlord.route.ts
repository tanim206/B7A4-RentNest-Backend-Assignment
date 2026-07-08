import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { landlordController } from "./landlord.controller";

const router = Router();

router.get(
  "/requests",
  auth(Role.LANDLORD),
  landlordController.getLandlordRentalRequests,
);

router.patch(
  "/requests/:requestId",
  auth(Role.LANDLORD),
  landlordController.updateLandlordRentalRequestStatus,
);

export const landlordRouter = router;
