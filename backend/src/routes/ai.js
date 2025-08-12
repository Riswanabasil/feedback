import { Router } from "express";
import { ensureModelReady, predictEmotion, getModelStatus } from "../utils/predictor.js";

const router = Router();

router.get("/warmup", async (_req, res) => {
  await ensureModelReady(Number(process.env.MODEL_TRAIN_LIMIT || Infinity));
  res.json({ ok: true });
});

router.get("/status", (_req, res) => {
  res.json(getModelStatus());
});

router.post("/predict", async (req, res) => {
  const { text } = req.body || {};
  if (!text?.trim()) return res.status(400).json({ message: "text is required" });
  const emotion = await predictEmotion(text);
  res.json({ emotion });
});

export default router;