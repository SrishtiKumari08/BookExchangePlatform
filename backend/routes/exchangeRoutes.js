import express from "express";
import { requestExchange, getMyRequests } from "../controllers/exchangeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request",authMiddleware,requestExchange);

router.get("/my-requests",authMiddleware,getMyRequests);

export default router;