import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, User, Mail, Lock, MapPin } from 'lucide-react';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        city
      });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="page-wrapper container animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '50px 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Join the <span className="text-gradient">Community</span></h1>
                <p style={{ color: 'var(--text-secondary)' }}>Start exchanging your favorite books today.</p>
            </div>

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>City</label>
                        <input 
                            type="text" 
                            placeholder="Mumbai" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            required 
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="name@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
                    <input 
                        type="password" 
                        placeholder="At least 6 characters" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit" className="btn btn-primary full-width glow-btn" style={{ padding: '16px', fontSize: '1.05rem', marginTop: '10px' }}>
                    Create Account
                </button>
                {message && <p style={{ textAlign: 'center', marginTop: '10px', color: 'var(--error)' }}>{message}</p>}
            </form>

            <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-secondary)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Log In</Link>
            </p>
        </div>
        
        <style dangerouslySetInnerHTML={{ __html: `
            @media (max-width: 640px) {
                form > div { grid-template-columns: 1fr !important; }
            }
        `}} />
    </div>
  );
}

export default Signup;