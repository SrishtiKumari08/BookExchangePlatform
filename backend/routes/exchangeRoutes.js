import express from "express";
import { requestExchange,getMyRequests,acceptRequest,rejectRequest } from "../controllers/exchangeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request",authMiddleware,requestExchange);

router.get("/my-requests",authMiddleware,getMyRequests);

router.put("/accept/:id",authMiddleware,acceptRequest);

router.put("/reject/:id",authMiddleware,rejectRequest);

export default router;