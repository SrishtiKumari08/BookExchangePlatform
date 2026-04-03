import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";
import { 
  createBook, 
  getBooks, 
  searchBooks, 
  filterBooks,
  getBookDetails 
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/create",authMiddleware,upload.single("image"),createBook);

router.get("/",authMiddleware,getBooks);

router.get("/search",authMiddleware,searchBooks);

router.get("/:id",authMiddleware,getBookDetails);

router.get("/category", authMiddleware, filterBooks);

export default router;