import express from "express";
import upload from "../config/multer.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createBook,
  getBooks,
  searchBooks,
  filterBooks,
  getBookDetails
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("image"), createBook);

router.get("/", authMiddleware, getBooks);

router.get("/search", authMiddleware, searchBooks);

router.get("/category", authMiddleware, filterBooks);   // BEFORE :id

router.get("/:id", authMiddleware, getBookDetails);     // ALWAYS LAST

export default router;