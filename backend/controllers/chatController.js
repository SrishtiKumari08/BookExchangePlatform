import Message from "../models/Message.js";


// SEND MESSAGE
export const sendMessage = async (req,res)=>{
try{

const {receiver,message} = req.body;

const sender = req.user.id;

const newMessage = await Message.create({
sender,
receiver,
message
});

res.status(201).json(newMessage);

}catch(error){
res.status(500).json({message:error.message});
}
};


// GET CHAT HISTORY
export const getMessages = async (req,res)=>{
try{

const {userId} = req.params;

const messages = await Message.find({
$or:[
{sender:req.user.id,receiver:userId},
{sender:userId,receiver:req.user.id}
]
}).sort({createdAt:1});

res.json(messages);

}catch(error){
res.status(500).json({message:error.message});
}
};