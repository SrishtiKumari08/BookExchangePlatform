import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {

  useEffect(() => {

    socket.on("receiveMessage", (data) => {
      console.log("Message received:", data);
    });

  }, []);

  const sendMessage = () => {

    socket.emit("sendMessage", {
      message: "Hello from React"
    });

  };

  return (
    <div style={{padding:"20px"}}>
      <h1>Socket Chat Test</h1>

      <button onClick={sendMessage}>
        Send Message
      </button>

    </div>
  );
}

export default App;