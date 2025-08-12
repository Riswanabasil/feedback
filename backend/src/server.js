import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectMongo } from "./db/mongo.js";
import authRouter from "./routes/auth.js"
import feedbackRouter from "./routes/feedback.js"
import aiRouter from "./routes/ai.js";
import { ensureModelReady } from "./utils/predictor.js";
import adminRouter from "./routes/admin.js";

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/admin", adminRouter);
app.use("/api/ai", aiRouter);

const port = process.env.PORT || 4000;
connectMongo(process.env.MONGO_URI).then(() => {
  ensureModelReady(Number(process.env.MODEL_TRAIN_LIMIT || Infinity))
    .then(() => console.log("Model ready"))
    .catch((e) => console.error("Model training failed:", e.message));

  app.listen(process.env.PORT || 4000, () => console.log(" API running"));
});