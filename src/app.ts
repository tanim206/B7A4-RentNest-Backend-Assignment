import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import config from "./config";
import cors from "cors";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// app.post(
//   "/api/subscription/webhook",
//   express.raw({ type: "application/json" }),
//   () => {},
// );

//app.use("/api/subscription/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

///

///
app.use(notFound);
app.use(globalErrorHandler);

export default app;
