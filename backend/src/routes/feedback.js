import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Feedback from "../models/Feedback.js";
import { predictEmotion } from "../utils/predictor.js";

const router = Router();


router.post("/", requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body || {};
    const r = Number(rating);
    if (!r || r < 1 || r > 5 || !comment?.trim()) {
      return res.status(400).json({ message: "rating(1-5) and comment are required" });
    }

   
    const emotion = await predictEmotion(comment);

    const fb = await Feedback.create({
      userId: req.userId,
      rating: r,
      comment: comment.trim(),
      emotion,
    });

    res.status(201).json({ feedback: fb });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const list = await Feedback.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("_id rating comment emotion createdAt");
    res.json({ feedback: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
