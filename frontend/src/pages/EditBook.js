import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Book as BookIcon, User, AlignLeft, Tag, Image as ImageIcon, ArrowLeft } from 'lucide-react';

function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const token = localStorage.getItem("token");

    const categories = ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Fantasy", "Technology"];

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/books/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTitle(res.data.title);
                setAuthor(res.data.author);
                setDescription(res.data.description);
                setCategory(res.data.category);
                setPreview(`http://localhost:5000/${res.data.image}`);
            } catch (error) {
                alert("Error fetching book details");
                navigate("/dashboard");
            }
        };
        fetchBook();
    }, [id, token, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("description", description);
        formData.append("category", category);
        if (image) formData.append("image", image);

        try {
            await axios.put(`http://localhost:5000/api/books/${id}`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}` 
                }
            });
            alert("Book updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            alert("Update failed");
        }
    };

    return (
        <div className="page-wrapper container animate-fade-in-up">
            <header className="section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                    <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
                        <ArrowLeft size={16} />
                    </button>
                    <h1 style={{ marginBottom: 0 }}>Edit <span className="text-gradient">Book Details</span></h1>
                </div>
                <p>Update the information for your listed book.</p>
            </header>

            <div className="glass-panel" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
                <form onSubmit={handleUpdate} className="form-grid">
                    
                    {/* Left: Image Upload */}
                    <div className="upload-container">
                        <div 
                            className="image-upload-box"
                            onClick={() => document.getElementById('imageInput').click()}
                            style={{ background: preview ? 'none' : 'rgba(255,255,255,0.02)' }}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" className="upload-preview-img" />
                            ) : (
                                <div className="upload-placeholder">
                                    <div className="upload-icon-circle">
                                        <ImageIcon size={32} />
                                    </div>
                                    <p>Click to change cover image</p>
                                </div>
                            )}
                            <input 
                                id="imageInput"
                                type="file" 
                                onChange={handleImageChange} 
                                style={{ display: 'none' }} 
                                accept="image/*"
                            />
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Click the image to upload a new cover
                        </p>
                    </div>

                    {/* Right: Book Details */}
                    <div className="details-container">
                        <div className="form-group-grid">
                            <div className="form-group">
                                <label><BookIcon size={16} /> Book Title</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><User size={16} /> Author Name</label>
                                <input 
                                    type="text" 
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)} 
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label><Tag size={16} /> Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label><AlignLeft size={16} /> Description</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} 
                                rows={6}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary full-width btn-lg glow-btn" style={{ marginTop: '20px' }}>
                            <Save size={20} /> Save Changes
                        </button>
                    </div>

                </form>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.4fr;
                    gap: 60px;
                }

                .image-upload-box {
                    width: 100%;
                    height: 480px;
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .image-upload-box:hover {
                    border-color: var(--accent-primary);
                    background: rgba(99, 102, 241, 0.05) !important;
                }

                .upload-preview-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .upload-placeholder {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                }

                .upload-icon-circle {
                    width: 64px;
                    height: 64px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-secondary);
                }

                .form-group-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .form-group label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 10px;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                @media (max-width: 900px) {
                    .form-grid { grid-template-columns: 1fr; gap: 40px; }
                    .image-upload-box { height: 400px; }
                    .form-group-grid { grid-template-columns: 1fr; }
                }
            `}} />
        </div>
    );
}

export default EditBook;
