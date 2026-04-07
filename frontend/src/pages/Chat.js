import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Send, User as UserIcon, MessageSquare } from "lucide-react";

const socket = io("http://localhost:5000");

function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const messagesEndRef = useRef(null);
    const token = localStorage.getItem("token");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUser(res.data);
            } catch (error) {
                console.error("Error", error);
            }
        };

        const fetchChatUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/chat/users", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChatUsers(res.data);
            } catch (error) {
                console.error("Error fetching chat users", error);
            }
        };

        fetchProfile();
        fetchChatUsers();

        socket.on("receiveMessage", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [token]);

    useEffect(() => {
        if (selectedUser && currentUser) {
            const fetchHistory = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/chat/${selectedUser._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMessages(res.data.map(m => ({
                        ...m,
                        timestamp: new Date(m.createdAt).toLocaleTimeString()
                    })));
                } catch (error) {
                    console.error("Error fetching history", error);
                }
            };

            fetchHistory();

            // Room ID format: sorted IDs to be consistent for both users
            const room = [currentUser._id, selectedUser._id].sort().join("_");
            socket.emit("joinRoom", room);
        }
    }, [selectedUser, currentUser, token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (message.trim() && currentUser && selectedUser) {
            const room = [currentUser._id, selectedUser._id].sort().join("_");
            const data = { 
                senderId: currentUser._id,
                receiverId: selectedUser._id,
                message, 
                room
            };
            socket.emit("sendMessage", data);
            setMessage("");
        }
    };

    return (
        <div className="page-wrapper container animate-fade-in-up">
            <div className="glass-panel chat-layout" style={{ height: 'calc(100vh - 140px)', display: 'flex', overflow: 'hidden' }}>
                
                {/* Sidebar: Message List */}
                <aside className="chat-sidebar">
                    <div className="sidebar-header">
                        <MessageSquare size={20} color="var(--accent-primary)" />
                        <h3>Messages</h3>
                    </div>
                    <div className="conversation-list custom-scrollbar">
                        {chatUsers.length === 0 ? (
                            <div className="empty-chat-state">
                                <p>No active conversations.</p>
                                <small>Accepted exchange requests will appear here.</small>
                            </div>
                        ) : (
                            chatUsers.map(user => (
                                <div 
                                    key={user._id} 
                                    onClick={() => setSelectedUser(user)}
                                    className={`conversation-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                                >
                                    <div className="user-avatar-small">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-info-brief">
                                        <h4>{user.name}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <div className="online-indicator"></div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active now</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                {/* Main: Chat Window */}
                <main className="chat-main">
                    {selectedUser ? (
                        <>
                            <header className="chat-header">
                                <div className="user-avatar-small">
                                    {selectedUser.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="chat-header-info">
                                    <h3>{selectedUser.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>Active Now</span>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    {/* Optional action buttons could go here */}
                                </div>
                            </header>

                            <div className="messages-viewport custom-scrollbar">
                                {messages.length === 0 ? (
                                    <div className="no-messages-placeholder">
                                        <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '15px' }} />
                                        <p>No messages yet. Send a friendly hello!</p>
                                    </div>
                                ) : (
                                    <div className="messages-stack">
                                        {messages.map((msg, idx) => {
                                            const isMe = currentUser && (msg.sender === currentUser._id || msg.senderId === currentUser._id);
                                            return (
                                                <div key={idx} className={`message-bubble-wrapper ${isMe ? 'mine' : 'theirs'}`}>
                                                    <div className="message-bubble">
                                                        <p>{msg.message}</p>
                                                        <span className="message-time">{msg.timestamp}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            <footer className="chat-input-area">
                                <div className="input-with-actions">
                                    <input 
                                        type="text" 
                                        placeholder={`Message ${selectedUser.name?.split(' ')[0]}...`} 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <button className="send-btn" onClick={sendMessage} disabled={!message.trim()}>
                                        <Send size={20} />
                                    </button>
                                </div>
                            </footer>
                        </>
                    ) : (
                        <div className="chat-placeholder">
                            <div className="placeholder-icon">
                                <MessageSquare size={48} />
                            </div>
                            <h2>Your Inbox</h2>
                            <p>Select a reader from the left to start coordinating your book exchange.</p>
                        </div>
                    )}
                </main>

            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .chat-layout {
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .chat-sidebar {
                    width: 340px;
                    border-right: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    flex-direction: column;
                    background: rgba(15, 23, 42, 0.2);
                }

                .sidebar-header {
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .sidebar-header h3 { font-size: 1.1rem; margin: 0; letter-spacing: -0.5px; }

                .conversation-list {
                    flex: 1;
                    padding: 12px;
                    overflow-y: auto;
                }

                .conversation-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-bottom: 4px;
                }

                .conversation-item:hover { background: rgba(255, 255, 255, 0.03); }
                .conversation-item.active { background: rgba(99, 102, 241, 0.1); }

                .user-avatar-small {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: var(--accent-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
                }

                .user-info-brief h4 { font-size: 0.95rem; margin: 0 0 4px; }
                .online-indicator { width: 8px; height: 8px; border-radius: 50%; background: var(--success); }

                .chat-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .chat-header {
                    padding: 16px 24px;
                    background: rgba(15, 23, 42, 0.3);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .chat-header h3 { font-size: 1.1rem; margin: 0; }

                .messages-viewport {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                }

                .messages-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .message-bubble-wrapper {
                    display: flex;
                    flex-direction: column;
                }

                .message-bubble-wrapper.mine { align-items: flex-end; }
                .message-bubble-wrapper.theirs { align-items: flex-start; }

                .message-bubble {
                    padding: 12px 18px;
                    border-radius: 16px;
                    max-width: 65%;
                    box-shadow: var(--shadow-sm);
                    position: relative;
                }

                .mine .message-bubble {
                    background: var(--accent-primary);
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .theirs .message-bubble {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                    border-bottom-left-radius: 4px;
                }

                .message-time {
                    display: block;
                    font-size: 0.65rem;
                    margin-top: 6px;
                    opacity: 0.5;
                }

                .chat-input-area {
                    padding: 20px 24px;
                    background: rgba(15, 23, 42, 0.4);
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .input-with-actions {
                    position: relative;
                }

                .input-with-actions input {
                    padding-right: 60px;
                    background: rgba(15, 23, 42, 0.6);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .send-btn {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    background: var(--accent-gradient);
                    color: white;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .chat-placeholder {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 40px;
                    opacity: 0.6;
                }

                .placeholder-icon {
                    width: 80px;
                    height: 80px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    color: var(--accent-primary);
                }

                .chat-placeholder h2 { font-size: 1.8rem; margin: 0 0 12px; }
                .chat-placeholder p { max-width: 320px; color: var(--text-secondary); }

                @media (max-width: 768px) {
                    .chat-sidebar { width: 80px; }
                    .sidebar-header, .user-info-brief { display: none; }
                    .conversation-item { justify-content: center; padding: 12px; }
                }
            `}} />
        </div>
    );
}

export default Chat;

