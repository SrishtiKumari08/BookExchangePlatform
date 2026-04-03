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

        const books = await Book.find({ city: user.city }).populate("owner", "name email");

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
title:{$regex:query,$options:"i"}
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