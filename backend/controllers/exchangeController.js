import Exchange from "../models/Exchange.js";
import Book from "../models/Book.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "../services/emailService.js";
import User from "../models/User.js";

// CREATE EXCHANGE REQUEST
export const requestExchange = async (req,res)=>{
try{

const userId = req.user.id;
const {bookId,meetingLocation} = req.body;

// find book
const book = await Book.findById(bookId).populate('owner');
const requester = await User.findById(userId);

// create exchange request
const exchange = await Exchange.create({
requester:userId,
book:bookId,
meetingLocation
});

// create notification for book owner
await Notification.create({
user:book.owner._id,
message:`${requester.name} requested your book: ${book.title}`,
type: 'exchange_request',
relatedId: exchange._id
});

// Send Email
await sendEmail({
    email: book.owner.email,
    subject: `New Exchange Request for ${book.title}`,
    message: `<p>Hello ${book.owner.name},</p><p>You have a new exchange request for your book: <b>${book.title}</b> from ${requester.name}.</p><p>Please log in to respond.</p>`
});

res.status(201).json({
message:"Exchange request sent",
exchange
});

}catch(error){
res.status(500).json({message:error.message});
}
};



// GET MY REQUESTS
export const getMyRequests = async (req,res)=>{
try{

const userId = req.user.id;

const requests = await Exchange.find({requester:userId})
.populate({
    path: "book",
    populate: { path: "owner", select: "name" }
});

res.json(requests);

}catch(error){
res.status(500).json({message:error.message});
}
};

// ACCEPT REQUEST
export const acceptRequest = async (req,res)=>{
try{

const {id} = req.params;

const exchange = await Exchange.findById(id).populate('requester').populate('book');

if(!exchange){
return res.status(404).json({message:"Request not found"});
}

exchange.status="accepted";
exchange.completedAt = Date.now();

await exchange.save();

await Book.findByIdAndUpdate(exchange.book._id,{
status:"exchanged"
});

// Create Notification
await Notification.create({
    user: exchange.requester._id,
    message: `Your request for ${exchange.book.title} was accepted!`,
    type: 'exchange_accepted',
    relatedId: exchange._id
});

// Send Email
await sendEmail({
    email: exchange.requester.email,
    subject: `Exchange Accepted: ${exchange.book.title}`,
    message: `<p>Hello ${exchange.requester.name},</p><p>Your request for <b>${exchange.book.title}</b> was accepted!</p><p>Please log in to chat to coordinate the exchange.</p>`
});

res.json({message:"Exchange request accepted"});

}catch(error){
res.status(500).json({message:error.message});
}
};

// REJECT REQUEST 
export const rejectRequest = async (req,res)=>{
try{

const {id} = req.params;

const exchange = await Exchange.findById(id);

if(!exchange){
return res.status(404).json({message:"Request not found"});
}

exchange.status="rejected";

await exchange.save();

res.json({message:"Exchange request rejected"});

}catch(error){
res.status(500).json({message:error.message});
}
};

// GET REQUESTS FOR MY BOOKS
export const getRequestsForMyBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find books owned by user
        const myBooks = await Book.find({ owner: userId }).select('_id');
        const myBookIds = myBooks.map(book => book._id);

        const requests = await Exchange.find({ book: { $in: myBookIds } })
            .populate('book')
            .populate('requester', 'name email profilePicture');

        res.json(requests);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

