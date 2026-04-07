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
// MARK NOTIFICATION AS READ
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    // Ensure the notification belongs to the user
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;