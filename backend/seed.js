import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Book from "./models/Book.js";

dotenv.config();

const booksData = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "A supremely practical and useful guide to building good habits and breaking bad ones.",
    category: "Non-Fiction",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
    city: "Delhi",
    ownerName: "Rohan",
    ownerEmail: "rohan@example.com"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A fable about following your dream, telling the story of a shepherd boy named Santiago.",
    category: "Fiction",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/112503.jpg",
    city: "Mumbai",
    ownerName: "Priya",
    ownerEmail: "priya@example.com"
  },
  {
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    description: "The autobiography of A.P.J. Abdul Kalam, the former President of India.",
    category: "Biography",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1588286863i/634583.jpg",
    city: "Bangalore",
    ownerName: "Vikram",
    ownerEmail: "vikram@example.com"
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description: "Expectations of how our minds work and how we make decisions.",
    category: "Science",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg",
    city: "Pune",
    ownerName: "Ananya",
    ownerEmail: "ananya@example.com"
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    description: "A landmark volume in science writing by one of the great minds of our time.",
    category: "Science",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398062506i/3869.jpg",
    city: "Hyderabad",
    ownerName: "Arjun",
    ownerEmail: "arjun@example.com"
  },
  {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      description: "A shocking psychological thriller of a woman’s act of violence against her husband.",
      category: "Fiction",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1668782119i/40063199.jpg",
      city: "Kolkata",
      ownerName: "Siddharth",
      ownerEmail: "sid@example.com"
  }
];

const seedDB = async () => {
  try {
    console.log("Starting seed process...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    for (const data of booksData) {
      console.log(`Processing user: ${data.ownerName}...`);
      let user = await User.findOne({ email: data.ownerEmail });
      
      if (!user) {
        console.log(`Creating user: ${data.ownerName}...`);
        const hashedPassword = await bcrypt.hash("password123", 10);
        user = await User.create({
          name: data.ownerName,
          email: data.ownerEmail,
          password: hashedPassword,
          city: data.city
        });
        console.log(`User created: ${user.name}`);
      } else {
        console.log(`User ${user.name} already exists.`);
      }

      console.log(`Checking if book exists: ${data.title}...`);
      const bookExists = await Book.findOne({ title: data.title, owner: user._id });
      
      if (!bookExists) {
        console.log(`Creating book: ${data.title}...`);
        await Book.create({
          title: data.title,
          author: data.author,
          description: data.description,
          category: data.category,
          image: data.image,
          owner: user._id,
          city: user.city
        });
        console.log(`Book seeded: ${data.title}`);
      } else {
        console.log(`Book ${data.title} already exists.`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error details:", error);
    process.exit(1);
  }
};

seedDB();
