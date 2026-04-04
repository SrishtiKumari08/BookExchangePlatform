import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server,{
 cors:{
  origin:"*"
 }
});

io.on("connection",(socket)=>{

 console.log("User connected:",socket.id);

 socket.on("sendMessage",(data)=>{
  io.emit("receiveMessage",data);
 });

 socket.on("disconnect",()=>{
  console.log("User disconnected");
 });

});

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
 console.log("MongoDB Connected");

 server.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
 });

})
.catch((err)=>console.log(err));