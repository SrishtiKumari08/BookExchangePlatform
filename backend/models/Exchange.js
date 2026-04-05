import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema({

requester:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

book:{
type:mongoose.Schema.Types.ObjectId,
ref:"Book"
},

meetingLocation:{
type:String,
required:true
},

status:{
type:String,
enum:["pending","accepted","rejected"],
default:"pending"
},

createdAt:{
type:Date,
default:Date.now
}

});

const Exchange = mongoose.model("Exchange",exchangeSchema);

export default Exchange;