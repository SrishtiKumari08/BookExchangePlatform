import Exchange from "../models/Exchange.js";
import Book from "../models/Book.js";
import Notification from "../models/Notification.js";



// CREATE EXCHANGE REQUEST
export const requestExchange = async (req,res)=>{
try{

const userId = req.user.id;

const {bookId,meetingLocation} = req.body;

// find book
const book = await Book.findById(bookId);

// create exchange request
const exchange = await Exchange.create({
requester:userId,
book:bookId,
meetingLocation
});

// create notification for book owner
await Notification.create({
user:book.owner,
message:"Someone requested your book"
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
.populate("book");

res.json(requests);

}catch(error){
res.status(500).json({message:error.message});
}
};

// ACCEPT REQUEST
export const acceptRequest = async (req,res)=>{
try{

const {id} = req.params;

const exchange = await Exchange.findById(id);

if(!exchange){
return res.status(404).json({message:"Request not found"});
}

exchange.status="accepted";

await exchange.save();

await Book.findByIdAndUpdate(exchange.book,{
status:"exchanged"
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

