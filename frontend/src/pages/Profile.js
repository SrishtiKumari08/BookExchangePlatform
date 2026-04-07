import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, MapPin, Mail, Phone, Edit2, Save, Star, BookOutlined } from 'lucide-react';

function Profile() {
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [reviews, setReviews] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setFormData(res.data);
            
            // Fetch reviews
            const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/${res.data._id}`);
            setReviews(reviewsRes.data);
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await axios.put("http://localhost:5000/api/users/profile", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(formData);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Error updating profile");
        }
    };

    return (
        <div className="page-wrapper container animate-fade-in-up">
            <header className="section-title">
                <h1>User <span className="text-gradient">Profile</span></h1>
                <p>Manage your account settings and reading history.</p>
            </header>

            <div className="profile-layout">
                {/* Left Side: Profile Info Card */}
                <div className="profile-sidebar">
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar">
                                {profile.profilePicture ? (
                                    <img src={profile.profilePicture} alt="Profile" />
                                ) : (
                                    <span>{profile.name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <button className="avatar-edit-btn">
                                <Edit2 size={14} />
                            </button>
                        </div>

                        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{profile.name}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--warning)', marginBottom: '24px' }}>
                            <Star size={18} fill="currentColor" />
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{profile.averageRating?.toFixed(1) || '0.0'}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({reviews.length} reviews)</span>
                        </div>

                        <div className="profile-contact-list">
                            <div className="contact-item">
                                <Mail size={18} color="var(--accent-primary)" />
                                <span>{profile.email}</span>
                            </div>
                            <div className="contact-item">
                                <MapPin size={18} color="var(--success)" />
                                <span>{profile.city}</span>
                            </div>
                            {profile.phone && (
                                <div className="contact-item">
                                    <Phone size={18} color="var(--warning)" />
                                    <span>{profile.phone}</span>
                                </div>
                            )}
                        </div>

                        {!isEditing ? (
                            <button className="btn btn-outline full-width" style={{ marginTop: '30px' }} onClick={() => setIsEditing(true)}>
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                                <button className="btn btn-primary flex-1" onClick={handleSave}>
                                    <Save size={16} /> Save
                                </button>
                                <button className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Detailed Sections */}
                <div className="profile-main">
                    {/* Bio / About Section */}
                    <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={20} color="var(--accent-primary)" /> About Me
                        </h3>
                        {isEditing ? (
                            <textarea 
                                name="bio" 
                                value={formData.bio || ''} 
                                onChange={handleChange} 
                                rows={4} 
                                placeholder="Tell us about yourself and your reading interests..."
                            />
                        ) : (
                            <p style={{ color: profile.bio ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: '1.8' }}>
                                {profile.bio || "No biography provided yet. Add one to let others know about your reading tastes!"}
                            </p>
                        )}

                        {isEditing && (
                            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="city" value={formData.city || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                        <div className="glass-panel stat-card">
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Books Shared</h4>
                            <p style={{ fontSize: '2rem', fontWeight: 800 }}>12</p>
                        </div>
                        <div className="glass-panel stat-card">
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Exchanges</h4>
                            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>8</p>
                        </div>
                        <div className="glass-panel stat-card">
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Points</h4>
                            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>240</p>
                        </div>
                    </div>

                    {/* Member Reviews */}
                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '24px' }}>Community Reviews</h3>
                        {reviews.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Complete your first exchange to start building your reputation!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {reviews.map((rev, idx) => (
                                    <div key={idx} className="review-item" style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="reviewer-avatar">
                                                    {rev.reviewer?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h5 style={{ fontSize: '1rem' }}>{rev.reviewer?.name}</h5>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '2px', color: 'var(--warning)' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .profile-layout {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 40px;
                    align-items: start;
                }

                .profile-avatar-wrapper {
                    position: relative;
                    width: 140px;
                    height: 140px;
                    margin: 0 auto 24px;
                }

                .profile-avatar {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: var(--accent-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3.5rem;
                    color: white;
                    font-weight: 800;
                    box-shadow: var(--shadow-lg);
                    border: 4px solid var(--bg-secondary);
                    overflow: hidden;
                }

                .profile-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .avatar-edit-btn {
                    position: absolute;
                    bottom: 5px;
                    right: 5px;
                    background: var(--bg-tertiary);
                    border: 2px solid var(--bg-secondary);
                    color: white;
                    padding: 8px;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: var(--shadow-md);
                }

                .profile-contact-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    text-align: left;
                }

                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 12px;
                    font-size: 0.95rem;
                }

                .reviewer-avatar {
                    width: 40px;
                    height: 40px;
                    background: var(--bg-tertiary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: var(--accent-primary);
                }

                .stat-card {
                    padding: 24px;
                    text-align: center;
                }

                @media (max-width: 1024px) {
                    .profile-layout { grid-template-columns: 1fr; }
                    .profile-sidebar { max-width: 500px; margin: 0 auto; width: 100%; }
                }
            `}} />
        </div>
    );
}

export default Profile;
