import express from "express";
import upload from "../config/multer.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createBook,
  getBooks,
  searchBooks,
  filterBooks,
  getBookDetails,
  updateBook,
  deleteBook,
  getMyBooks
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("image"), createBook);

router.get("/", authMiddleware, getBooks);
router.get("/me", authMiddleware, getMyBooks);

router.get("/search", authMiddleware, searchBooks);

router.get("/category", authMiddleware, filterBooks);   // BEFORE :id

router.get("/:id", authMiddleware, getBookDetails);     // ALWAYS LAST

router.put("/:id", authMiddleware, upload.single("image"), updateBook);
router.delete("/:id", authMiddleware, deleteBook);

export default router;