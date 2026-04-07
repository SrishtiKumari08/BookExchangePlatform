import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, Filter, MapPin, User, ChevronRight, BookOpen } from 'lucide-react';

function Home() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const token = localStorage.getItem("token");

    const categories = ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Fantasy", "Technology"];

    useEffect(() => {
        if(token) {
            fetchBooks();
        }
    }, [token]);

    const fetchBooks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/books", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleSearch = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/books/search?query=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
        } catch (error) {
            console.error("Error searching books:", error);
        }
    };

    const handleFilter = async (cat) => {
        setCategory(cat);
        try {
            if (cat === "") {
                return fetchBooks();
            }
            const res = await axios.get(`http://localhost:5000/api/books/category?category=${cat}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
        } catch (error) {
            console.error("Error filtering books:", error);
        }
    };

    return (
        <div className="page-wrapper container animate-fade-in-up">
            
            <header className="section-title">
                <h1>Explore <span className="text-gradient">Local Books</span></h1>
                <p>Discover rare finds and popular titles available in your city.</p>
            </header>

            <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={22} />
                    <input 
                        type="text" 
                        placeholder="Search books by title, author, or genre..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={{ paddingLeft: '50px', background: 'rgba(255, 255, 255, 0.05)', fontSize: '1rem' }}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleSearch} style={{ height: '52px', padding: '0 30px' }}>Search</button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Filter size={20} color="var(--accent-primary)" />
                        <select 
                            value={category} 
                            onChange={(e) => handleFilter(e.target.value)}
                            style={{ background: 'transparent', border: 'none', width: 'auto', padding: '0 30px 0 0', outline: 'none', boxShadow: 'none' }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <main className="grid grid-cols-4">
                {books.length === 0 ? (
                    <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', margin: '0 auto 24px', color: 'var(--accent-primary)' }}>
                             <BookOpen size={40} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ marginBottom: '12px' }}>No books found</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>We couldn't find any books matching your criteria in your city.</p>
                        <button className="btn btn-outline" onClick={() => fetchBooks()} style={{ marginTop: '24px' }}>Clear all filters</button>
                    </div>
                ) : (
                  books.map(book => (
                    <div className="book-card" key={book._id}>
                        <div className="book-image-wrapper">
                            <img 
                                src={book.image?.startsWith('http') ? book.image : `http://localhost:5000/${book.image}`} 
                                alt={book.title} 
                                className="book-image" 
                                onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=No+Image" }}
                            />
                            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                <span className="badge" style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: 0 }}>
                                    {book.category}
                                </span>
                            </div>
                        </div>
                        <div className="book-details">
                            <h3 className="book-title">{book.title}</h3>
                            <p className="book-author">By {book.author}</p>
                            
                            <div className="book-meta">
                                <div className="owner-info">
                                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '6px', borderRadius: '50%' }}>
                                        <User size={12} color="var(--accent-primary)" />
                                    </div>
                                    <span>{book.owner?.name}</span>
                                </div>
                                <div className="owner-info">
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '6px', borderRadius: '50%' }}>
                                        <MapPin size={12} color="var(--success)" />
                                    </div>
                                    <span>{book.city}</span>
                                </div>
                            </div>

                            <Link to={`/books/${book._id}`} className="btn btn-primary full-width" style={{ marginTop: '24px', justifyContent: 'space-between' }}>
                                Details <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                  ))
                )}
            </main>

        </div>
    );
}

export default Home;