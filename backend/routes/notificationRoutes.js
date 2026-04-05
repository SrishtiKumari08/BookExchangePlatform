import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// GET USER NOTIFICATIONS
router.get("/", authMiddleware, async (req, res) => {
  try {

    const userId = req.user.id;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;