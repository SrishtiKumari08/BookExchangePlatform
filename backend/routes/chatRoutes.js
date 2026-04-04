import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

router.post("/send",authMiddleware,sendMessage);

router.get("/:userId",authMiddleware,getMessages);

export default router;