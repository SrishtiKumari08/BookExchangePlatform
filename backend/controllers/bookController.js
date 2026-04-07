import Book from "../models/Book.js";
import User from "../models/User.js";


// CREATE BOOK
export const createBook = async (req, res) => {
    try {

        const { title, author, description, category } = req.body;
        console.log(req.body);

        const userId = req.user.id;

        const user = await User.findById(userId);

        const book = await Book.create({

            title,
            author,
            description,
            category,
            image: req.file ? req.file.path : "",
            owner: userId,
            city: user.city

        });

        res.status(201).json({
            message: "Book uploaded successfully",
            book
        });
       

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// GET BOOKS (CITY FILTER)
export const getBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        // Find all books NOT owned by the user, preferably in their city
        const books = await Book.find({ 
            owner: { $ne: userId } 
        }).populate("owner", "name email");

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET MY BOOKS
export const getMyBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const books = await Book.find({ owner: userId });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SEARCH BOOKS
export const searchBooks = async (req,res)=>{
try{

const {query} = req.query;

const books = await Book.find({
    $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
    ]
}).populate("owner","name email");

res.json(books);

}catch(error){
res.status(500).json({message:error.message});
}
};

export const getBookDetails = async (req,res)=>{
    try{

        const { id } = req.params;

        const book = await Book.findById(id)
        .populate("owner","name email");

        res.json(book);

    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// FILTER BOOKS BY CATEGORY
export const filterBooks = async (req,res)=>{
    try{

        const { category } = req.query;

        const books = await Book.find({ category })
        .populate("owner","name email");

        res.json(books);

    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// UPDATE BOOK
export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, description, category } = req.body;
        
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this book" });
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.description = description || book.description;
        book.category = category || book.category;

        if (req.file) {
            book.image = req.file.path;
        }

        const updatedBook = await book.save();
        res.json(updatedBook);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE BOOK
export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this book" });
        }

        await Book.findByIdAndDelete(id);
        res.json({ message: "Book deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};