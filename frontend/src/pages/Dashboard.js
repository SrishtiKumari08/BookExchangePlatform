import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Book, Send, Inbox, CheckCircle, XCircle, Clock, Trash2, Edit, MessageSquare, ChevronRight, User, MapPin } from 'lucide-react';

function Dashboard() {
    const [myBooks, setMyBooks] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("my-books");
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchMyBooks(),
                fetchSentRequests(),
                fetchReceivedRequests()
            ]);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyBooks = async () => {
        const res = await axios.get("http://localhost:5000/api/books/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMyBooks(res.data);
    };

    const fetchSentRequests = async () => {
        const res = await axios.get("http://localhost:5000/api/exchange/my-requests", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSentRequests(res.data);
    };

    const fetchReceivedRequests = async () => {
        const res = await axios.get("http://localhost:5000/api/exchange/received-requests", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setReceivedRequests(res.data);
    };

    const handleAccept = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/exchange/accept/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReceivedRequests();
            alert("Request accepted!");
        } catch (error) {
            alert("Error accepting request");
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/exchange/reject/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReceivedRequests();
            alert("Request rejected");
        } catch (error) {
            alert("Error rejecting request");
        }
    };

    const handleDeleteBook = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMyBooks();
        } catch (error) {
            alert("Error deleting book");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="status-badge status-pending"><Clock size={12}/> Pending</span>;
            case 'accepted': return <span className="status-badge status-accepted"><CheckCircle size={12}/> Accepted</span>;
            case 'rejected': return <span className="status-badge status-rejected"><XCircle size={12}/> Rejected</span>;
            default: return null;
        }
    };

    return (
        <div className="page-wrapper container animate-fade-in-up">
            <header className="section-title">
                <h1>My <span className="text-gradient">Dashboard</span></h1>
                <p>Manage your collection and track your active exchanges.</p>
            </header>

            {/* Dashboard Navigation Tabs */}
            <div className="dashboard-tabs glass-panel">
                <button className={`tab-btn ${activeTab === 'my-books' ? 'active' : ''}`} onClick={() => setActiveTab('my-books')}>
                    <Book size={18} /> My Books
                </button>
                <button className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => setActiveTab('sent')}>
                    <Send size={18} /> Sent Requests
                </button>
                <button className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`} onClick={() => setActiveTab('received')}>
                    <Inbox size={18} /> Received Requests
                </button>
            </div>

            <main>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
                    </div>
                ) : (
                    <>
                        {/* MY BOOKS TAB */}
                        {activeTab === "my-books" && (
                            <div className="grid grid-cols-4">
                                <Link to="/upload" className="glass-panel add-book-card">
                                    <div className="add-icon">+</div>
                                    <h3>Add New Book</h3>
                                    <p>Share more stories with the community</p>
                                </Link>
                                
                                {myBooks.map(book => (
                                    <div className="book-card" key={book._id}>
                                        <div className="book-image-wrapper">
                                            <img 
                                                src={book.image?.startsWith('http') ? book.image : `http://localhost:5000/${book.image}`} 
                                                alt={book.title} 
                                                className="book-image" 
                                            />
                                        </div>
                                        <div className="book-details">
                                            <h3 className="book-title">{book.title}</h3>
                                            <p className="book-author">By {book.author}</p>
                                            <div className="card-actions">
                                                <Link to={`/edit-book/${book._id}`} className="btn btn-outline btn-sm"><Edit size={14}/> Edit</Link>
                                                <button onClick={() => handleDeleteBook(book._id)} className="btn btn-outline btn-sm delete-btn"><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* SENT REQUESTS TAB */}
                        {activeTab === "sent" && (
                            <div className="requests-container">
                                {sentRequests.length === 0 ? (
                                    <div className="glass-panel empty-state">
                                        <Send size={48} color="var(--text-secondary)" />
                                        <h3>No requests sent yet</h3>
                                        <p>Browse the collection to find books you'd like to read.</p>
                                        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Explore Books</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1">
                                        {sentRequests.map(req => (
                                            <div className="glass-panel request-card" key={req._id}>
                                                <div className="req-book-img">
                                                    <img src={req.book?.image?.startsWith('http') ? req.book.image : `http://localhost:5000/${req.book?.image}`} alt="Book" />
                                                </div>
                                                <div className="req-info">
                                                    <div className="req-header">
                                                        <h3>{req.book?.title}</h3>
                                                        {getStatusBadge(req.status)}
                                                    </div>
                                                    <div className="req-meta">
                                                        <span><User size={14}/> Owner: <strong>{req.book?.owner?.name || "Unknown"}</strong></span>
                                                        <span><MapPin size={14}/> Location: <strong>{req.meetingLocation}</strong></span>
                                                    </div>
                                                </div>
                                                <div className="req-actions">
                                                    {(req.status === 'accepted' || req.status === 'pending') && (
                                                        <Link to="/chat" className="btn btn-primary"><MessageSquare size={16}/> Chat with Owner</Link>
                                                    )}
                                                    <Link to={`/books/${req.book?._id}`} className="btn btn-outline">View Book</Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* RECEIVED REQUESTS TAB */}
                        {activeTab === "received" && (
                            <div className="requests-container">
                                {receivedRequests.length === 0 ? (
                                    <div className="glass-panel empty-state">
                                        <Inbox size={48} color="var(--text-secondary)" />
                                        <h3>Inbox is empty</h3>
                                        <p>You'll see exchange requests from other members here.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1">
                                        {receivedRequests.map(req => (
                                            <div className="glass-panel request-card" key={req._id}>
                                                <div className="req-book-img">
                                                    <img src={req.book?.image?.startsWith('http') ? req.book.image : `http://localhost:5000/${req.book?.image}`} alt="Book" />
                                                </div>
                                                <div className="req-info">
                                                    <div className="req-header">
                                                        <h3>{req.book?.title}</h3>
                                                        {getStatusBadge(req.status)}
                                                    </div>
                                                    <div className="req-meta">
                                                        <span><User size={14}/> From: <strong>{req.requester?.name}</strong></span>
                                                        <span><MapPin size={14}/> Meeting: <strong>{req.meetingLocation}</strong></span>
                                                    </div>
                                                </div>
                                                <div className="req-actions">
                                                    {req.status === 'pending' ? (
                                                        <>
                                                            <button className="btn btn-primary" onClick={() => handleAccept(req._id)}><CheckCircle size={16}/> Accept</button>
                                                            <button className="btn btn-outline" style={{ color: 'var(--error)' }} onClick={() => handleReject(req._id)}><XCircle size={16}/> Reject</button>
                                                            <Link to="/chat" className="btn btn-outline"><MessageSquare size={16}/> Chat</Link>
                                                        </>
                                                    ) : req.status === 'accepted' ? (
                                                        <Link to="/chat" className="btn btn-primary"><MessageSquare size={16}/> Chat with Requester</Link>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-secondary)' }}>No actions available</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                .dashboard-tabs {
                    display: flex;
                    padding: 8px;
                    gap: 10px;
                    margin-bottom: 40px;
                }

                .tab-btn {
                    flex: 1;
                    padding: 16px;
                    background: transparent;
                    color: var(--text-secondary);
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                }

                .tab-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-primary);
                }

                .tab-btn.active {
                    background: var(--accent-gradient);
                    color: white;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                }

                .add-book-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 40px 20px;
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.02);
                    transition: all 0.3s ease;
                }

                .add-book-card:hover {
                    border-color: var(--accent-primary);
                    background: rgba(99, 102, 241, 0.05);
                    transform: translateY(-5px);
                }

                .add-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    margin-bottom: 20px;
                    color: var(--text-secondary);
                }

                .request-card {
                    display: flex;
                    align-items: center;
                    padding: 24px;
                    gap: 30px;
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                }

                .request-card:hover { transform: scale(1.01); }

                .req-book-img {
                    width: 80px;
                    height: 110px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: var(--shadow-sm);
                }

                .req-book-img img { width: 100%; height: 100%; object-fit: cover; }

                .req-info { flex: 1; }

                .req-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }

                .req-meta { display: flex; gap: 30px; color: var(--text-secondary); font-size: 0.9rem; }

                .req-actions { display: flex; gap: 15px; }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-pending { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
                .status-accepted { background: rgba(16, 185, 129, 0.1); color: var(--success); }
                .status-rejected { background: rgba(239, 68, 68, 0.1); color: var(--error); }

                .empty-state {
                    padding: 100px 40px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .card-actions { display: flex; gap: 10px; margin-top: 15px; }
                .btn-sm { padding: 8px 16px; font-size: 0.85rem; }
                .delete-btn { color: var(--error); border-color: rgba(239, 68, 68, 0.2); }
                .delete-btn:hover { background: rgba(239, 68, 68, 0.1); border-color: var(--error); color: var(--error); }

                @media (max-width: 768px) {
                    .dashboard-tabs { flex-direction: column; }
                    .request-card { flex-direction: column; text-align: center; }
                    .req-header { flex-direction: column; gap: 10px; }
                    .req-meta { flex-direction: column; gap: 10px; }
                    .req-actions { width: 100%; flex-direction: column; }
                }
            `}} />
        </div>
    );
}

export default Dashboard;
