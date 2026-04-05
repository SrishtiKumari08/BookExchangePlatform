import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({

title:{
type:String,
required:true
},

author:{
type:String,
required:true
},

description:{
type:String,
required:true
},

category:{
type:String,
required:true
},

image:{
type:String
},

owner:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

city:{
type:String,
required:true
},

createdAt:{
type:Date,
default:Date.now
},

status:{
type:String,
enum:["available","exchanged"],
default:"available"
}

});

const Book = mongoose.model("Book",bookSchema);

export default Book;