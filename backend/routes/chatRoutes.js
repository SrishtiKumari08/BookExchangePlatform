import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendMessage, getMessages, getChatUsers } from "../controllers/chatController.js";

const router = express.Router();

router.get("/users",authMiddleware,getChatUsers);
router.post("/send",authMiddleware,sendMessage);
router.get("/:userId",authMiddleware,getMessages);

export default router;