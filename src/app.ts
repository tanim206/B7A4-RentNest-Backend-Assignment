import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import config from "./config";
import cors from "cors";

import { authRouter } from "./modules/auth/auth.route";
import { propertiesRouter } from "./modules/properties/properties.route";
import { categoryRouter } from "./modules/category/category.route";
import { adminRouter } from "./modules/admin/admin.route";
import { rentalRouter } from "./modules/rental/rental.route";
import { landlordRouter } from "./modules/landlord/landlord.route";
import { runningServer } from "./middleware/runningServer";
import { paymentRouter } from "./modules/payment/payment.route";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  () => {},
);

app.use("/api/subscription/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//
app.get("/", runningServer);

// public feature
app.use("/api/properties", propertiesRouter);
app.use("/api/categories", categoryRouter);

app.use("/api/auth", authRouter);
app.use("/api/landlord", landlordRouter);
app.use("/api/landlord", propertiesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/payments", paymentRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
