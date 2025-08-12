import { Router } from "express";
import { requireAdmin } from "../middleware/adminAuth.js";
import { signAdminToken } from "../utils/jwt.js";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const token = signAdminToken();
    return res.json({ token, admin: { username } });
  }
  return res.status(401).json({ message: "Invalid admin credentials" });
});

router.get("/feedback", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, emotion, minRating } = req.query;
    const q = {};
    if (emotion) q.emotion = emotion;
    if (minRating) q.rating = { $gte: Number(minRating) };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Feedback.find(q)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec()
        .then(async (list) => {
          const userIds = [...new Set(list.map((x) => String(x.userId)))];
          const users = await User.find({ _id: { $in: userIds } })
            .select("_id name email")
            .lean();
          const map = new Map(users.map((u) => [String(u._id), u]));
          return list.map((f) => ({ ...f, user: map.get(String(f.userId)) || null }));
        }),
      Feedback.countDocuments(q),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/summary", requireAdmin, async (_req, res) => {
  try {
    const [byEmotion, avg] = await Promise.all([
      Feedback.aggregate([
        { $group: { _id: "$emotion", count: { $sum: 1 } } },
        { $project: { emotion: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      Feedback.aggregate([{ $group: { _id: null, avgRating: { $avg: "$rating" }, total: { $sum: 1 } } }]),
    ]);

    res.json({
      byEmotion,                        
      avgRating: avg[0]?.avgRating || 0,
      totalFeedback: avg[0]?.total || 0,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
