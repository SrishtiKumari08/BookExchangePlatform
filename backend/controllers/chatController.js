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

// GET ACTIVE CHAT PARTNERS
import Exchange from "../models/Exchange.js";
import User from "../models/User.js";

export const getChatUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const myBookIds = await getMyBookIds(userId);

        // Find accepted or pending exchanges involving the user
        const exchanges = await Exchange.find({
            status: { $in: ["accepted", "pending"] },
            $or: [
                { requester: userId }, 
                { book: { $in: myBookIds } }
            ]
        }).populate("requester", "name email profilePicture city")
          .populate({
              path: "book",
              populate: { path: "owner", select: "name email profilePicture city" }
          });

        const chatPartners = new Map();

        exchanges.forEach(ex => {
            if (!ex.requester || !ex.book || !ex.book.owner) return;

            const requesterId = ex.requester._id ? ex.requester._id.toString() : ex.requester.toString();
            const currentUserId = userId.toString();
            
            let partner = null;
            if (requesterId === currentUserId) {
                // User is the requester, partner is the book owner
                partner = ex.book.owner;
            } else {
                // User is the book owner, partner is the requester
                partner = ex.requester;
            }

            if (partner && partner._id) {
                const partnerId = partner._id.toString();
                if (partnerId !== currentUserId) {
                    chatPartners.set(partnerId, partner);
                }
            }
        });

        res.json(Array.from(chatPartners.values()));
    } catch (error) {
        console.error("Chat Users Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Helper to get book IDs for a user
const getMyBookIds = async (userId) => {
    const Book = (await import("../models/Book.js")).default;
    const books = await Book.find({ owner: userId });
    return books.map(b => b._id);
};