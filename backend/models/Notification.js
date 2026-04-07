import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

    message:{
        type:String,
        required:true
    },
    type: {
        type: String,
        enum: ['exchange_request', 'exchange_accepted', 'exchange_rejected', 'message', 'review', 'general'],
        default: 'general'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId, // Can be Exchange ID, User ID, etc.
    },
    read:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Notification = mongoose.model("Notification",notificationSchema);

export default Notification;