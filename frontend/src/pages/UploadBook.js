import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload, Book as BookIcon, User, AlignLeft, Tag, Image as ImageIcon } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

function UploadBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const navigate = useNavigate();
  const { token } = useAuth();

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

  const uploadBook = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/books/create", formData, {
        headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` 
        }
      });
      alert("Book uploaded successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  const categories = ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Fantasy", "Technology"];

    return (
        <div className="page-wrapper container animate-fade-in-up">
            <header className="section-title">
                <h1>Share a <span className="text-gradient">New Book</span></h1>
                <p>List your book and let others in your city discover it.</p>
            </header>

            <div className="glass-panel" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
                <form onSubmit={uploadBook} className="form-grid">
                    
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
                                    <p>Click to upload cover image</p>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>JPG, PNG or WEBP (Max 5MB)</span>
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
                        {preview && (
                            <button type="button" onClick={() => {setPreview(null); setImage(null);}} className="btn btn-outline full-width" style={{ marginTop: '20px' }}>
                                Change Image
                            </button>
                        )}
                    </div>

                    {/* Right: Book Details */}
                    <div className="details-container">
                        <div className="form-group-grid">
                            <div className="form-group">
                                <label><BookIcon size={16} /> Book Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. The Great Gatsby" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><User size={16} /> Author Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. F. Scott Fitzgerald" 
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)} 
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label><Tag size={16} /> Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option value="">Select a Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label><AlignLeft size={16} /> Description</label>
                            <textarea 
                                placeholder="Write a short summary or tell us why you love this book..." 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} 
                                rows={6}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary full-width btn-lg glow-btn" style={{ marginTop: '20px' }}>
                            <Upload size={20} /> List This Book
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

export default UploadBook;