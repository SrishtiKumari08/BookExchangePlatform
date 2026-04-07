import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, LogOut, Upload, User, LogIn, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
            <BookOpen size={24} color="white" />
          </div>
          <h2 className="text-gradient" style={{ fontWeight: 800, fontSize: '1.6rem' }}>BookFlow</h2>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="navbar-links">
        {isLoggedIn ? (
          <>
            <Link to="/" className={isActive('/')}>Explore</Link>
            <Link to="/upload" className={isActive('/upload')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Upload size={18} /> Upload
              </span>
            </Link>
            <Link to="/dashboard" className={isActive('/dashboard')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <LayoutDashboard size={18} /> Dashboard
                </span>
            </Link>
            <Link to="/profile" className={isActive('/profile')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={18} /> Profile
              </span>
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '10px' }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/signup" className="btn btn-primary glow-btn">
              Join Now
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ display: 'none', background: 'transparent', color: 'white' }}>
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .mobile-toggle { display: block !important; }
          .navbar-links { display: none; }
          ${isMenuOpen ? `
            .navbar-links {
              display: flex !important;
              position: fixed;
              top: var(--navbar-height);
              left: 0;
              right: 0;
              bottom: 0;
              background: var(--bg-primary);
              flex-direction: column;
              padding: 40px;
              gap: 24px;
              z-index: 1001;
            }
          ` : ''}
        }
      `}} />
    </nav>
  );
}

export default Navbar;