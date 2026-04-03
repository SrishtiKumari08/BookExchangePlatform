import Exchange from "../models/Exchange.js";


// CREATE EXCHANGE REQUEST
export const requestExchange = async (req,res)=>{
try{

const userId = req.user.id;

const {bookId,meetingLocation} = req.body;

const exchange = await Exchange.create({
requester:userId,
book:bookId,
meetingLocation
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