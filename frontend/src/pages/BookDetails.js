import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, User, Tag, Calendar, Send } from 'lucide-react';

function BookDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [meetingLocation, setMeetingLocation] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [message, setMessage] = useState("");
    const [city, setCity] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const res = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUser(res.data);
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };
        fetchProfile();
    }, [token]);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/books/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBook(res.data);
            } catch (error) {
                console.error(error);
                alert("Book not found");
                navigate("/");
            }
        };
        fetchBook();
    }, [id, token, navigate]);

    const sendRequest = async () => {
        if (!meetingLocation) return alert("Please provide a meeting location");
        try {
            await axios.post("http://localhost:5000/api/exchange/request", {
                bookId: id,
                meetingLocation
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Exchange request sent successfully!");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error requesting book");
        }
    };

    if (!book) return <div className="page-wrapper container"><p>Loading...</p></div>;

    return (
        <div className="page-wrapper container animate-fade-in-up">
            <div className="glass-panel" style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '60px' }}>
                
                {/* Left Side: Book Image */}
                <div className="book-image-section">
                    <div className="glass-panel" style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px' }}>
                        <img 
                            src={book.image?.startsWith('http') ? book.image : `http://localhost:5000/${book.image}`} 
                            alt={book.title} 
                            style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=No+Image" }}
                        />
                    </div>
                </div>

                {/* Right Side: Book Info */}
                <div className="book-info-section" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <span className="badge" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>{book.category}</span>
                        <h1 style={{ fontSize: '3rem', marginTop: '12px', marginBottom: '8px' }}>{book.title}</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>By <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{book.author}</span></p>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px', background: 'rgba(255, 255, 255, 0.02)' }}>
                        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Description</h3>
                        <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>{book.description}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'var(--accent-gradient)', padding: '12px', borderRadius: '12px' }}>
                                <User size={24} color="white" />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Owned By</p>
                                <p style={{ fontWeight: 600 }}>{book.owner?.name}</p>
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'var(--success)', padding: '12px', borderRadius: '12px' }}>
                                <MapPin size={24} color="white" />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Location</p>
                                <p style={{ fontWeight: 600 }}>{book.city}</p>
                            </div>
                        </div>
                    </div>

                    {book.owner?._id !== currentUser?.id && (
                        <div className="glass-panel" style={{ padding: '30px', marginTop: 'auto', border: '1px solid var(--accent-glow)' }}>
                            <h3 style={{ marginBottom: '20px' }}>Interested in this book?</h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Proposed meeting location..." 
                                    value={meetingLocation} 
                                    onChange={(e) => setMeetingLocation(e.target.value)} 
                                    style={{ flex: 1 }}
                                />
                                <button className="btn btn-primary btn-lg glow-btn" onClick={sendRequest} style={{ padding: '0 40px' }}>
                                    Send Exchange Request
                                </button>
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <button className="btn btn-outline full-width" onClick={() => navigate("/chat")} style={{ gap: '10px' }}>
                                    <Send size={18} /> Chat with Owner
                                </button>
                            </div>
                            {message && <p style={{ marginTop: '15px', textAlign: 'center', color: message.includes('success') ? 'var(--success)' : 'var(--error)' }}>{message}</p>}
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 968px) {
                    .glass-panel { grid-template-columns: 1fr !important; gap: 40px !important; }
                    .book-image-section { max-width: 400px; margin: 0 auto; }
                    h1 { font-size: 2.2rem !important; }
                }
            `}} />
        </div>
    );
}

export default BookDetails;
