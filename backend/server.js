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

import Message from "./models/Message.js";

io.on("connection",(socket)=>{
  console.log("User connected:",socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message, room } = data;
    
    try {
      // Save to database
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message: message
      });

      // Emit to room
      const emitData = {
        _id: newMessage._id,
        sender: senderId,
        receiver: receiverId,
        message: message,
        createdAt: newMessage.createdAt,
        timestamp: new Date(newMessage.createdAt).toLocaleTimeString()
      };

      if (room) {
        io.to(room).emit("receiveMessage", emitData);
      } else {
        io.emit("receiveMessage", emitData); // Fallback to broadcast if no room (e.g. community chat)
      }
    } catch (error) {
      console.error("Error saving/sending message:", error);
    }
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