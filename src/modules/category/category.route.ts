import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Public
router.get("/", categoryController.getCategories);

// Admin only create
router.post("/", auth(Role.ADMIN), categoryController.createCategory);

export const categoryRouter = router;
