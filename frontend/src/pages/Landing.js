import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, MapPin, ArrowRight, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

function Landing() {
    return (
        <div className="landing-page">
            <section className="hero-section">
                <div className="container animate-fade-in-up">
                    <div className="hero-content">
                        <span className="badge glow-btn">New: Local Exchange v2.0</span>
                        <h1 className="hero-title">
                            Share Books, <br />
                            <span className="text-gradient">Spread Knowledge</span>
                        </h1>
                        <p className="hero-subtitle">
                            Connect with fellow book lovers in your city. Trade your read books for something new, 
                            build your community, and keep the stories moving.
                        </p>
                        <div className="hero-actions">
                            <Link to="/signup" className="btn btn-primary btn-lg">
                                Get Started Free <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-lg">
                                Log In
                            </Link>
                        </div>
                        <div className="hero-stats glass-panel">
                            <div className="stat-item">
                                <h3>500+</h3>
                                <p>Books Listed</p>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <h3>200+</h3>
                                <p>Active Users</p>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <h3>50+</h3>
                                <p>Cities</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </section>

            <section className="features-section section-padding">
                <div className="container">
                    <div className="section-title text-center">
                        <h2 className="text-gradient" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>How it Works</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>Simple steps to start your reading journey</p>
                    </div>

                    <div className="grid grid-cols-3">
                        <div className="feature-card glass-panel">
                            <div className="feature-icon-wrapper">
                                <BookOpen size={30} />
                            </div>
                            <h3 style={{ marginBottom: '15px' }}>List Your Books</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Upload details of the books you want to share. It's quick and easy.</p>
                        </div>
                        <div className="feature-card glass-panel">
                            <div className="feature-icon-wrapper">
                                <Users size={30} />
                            </div>
                            <h3 style={{ marginBottom: '15px' }}>Connect Locally</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Find people in your city who have the books you're looking for.</p>
                        </div>
                        <div className="feature-card glass-panel">
                            <div className="feature-icon-wrapper">
                                <MapPin size={30} />
                            </div>
                            <h3 style={{ marginBottom: '15px' }}>Exchange & Enjoy</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Meet up, exchange books, and start a conversation with a fellow reader.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="benefits-section section-padding">
                <div className="container">
                    <div className="benefits-grid">
                        <div className="benefits-image glass-panel" style={{ overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Books" style={{ width: '100%', display: 'block' }} />
                        </div>
                        <div className="benefits-content">
                            <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '25px' }}>Why Choose BookFlow?</h2>
                            <ul className="benefits-list" style={{ listStyle: 'none' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', fontSize: '1.1rem' }}>
                                    <CheckCircle color="var(--success)" size={24} />
                                    <span><strong>Save Money:</strong> No need to buy new books every time.</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', fontSize: '1.1rem' }}>
                                    <ShieldCheck color="var(--accent-primary)" size={24} />
                                    <span><strong>Safe & Local:</strong> Meet in public places within your own city.</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', fontSize: '1.1rem' }}>
                                    <Zap color="var(--warning)" size={24} />
                                    <span><strong>Sustainability:</strong> Reduce paper waste by recycling stories.</span>
                                </li>
                            </ul>
                            <Link to="/signup" className="btn btn-primary" style={{ marginTop: '20px' }}>
                                Start Trading Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section section-padding">
                <div className="container">
                    <div className="glass-panel" style={{ padding: '80px 40px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Ready to turn the page?</h2>
                        <p style={{ marginBottom: '40px', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Join thousands of readers who are already exchanging books.</p>
                        <Link to="/signup" className="btn btn-primary btn-lg glow-btn">
                            Create Your Free Account
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="container">
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        &copy; 2026 BookFlow. Built for the love of reading.
                    </p>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
                .hero-section {
                    position: relative;
                    padding: 160px 0 100px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    min-height: 90vh;
                }

                .hero-content {
                    max-width: 850px;
                    text-align: center;
                    margin: 0 auto;
                    position: relative;
                    z-index: 10;
                }

                .hero-title {
                    font-size: 5.5rem;
                    font-weight: 800;
                    margin: 24px 0;
                    line-height: 1.05;
                    letter-spacing: -3px;
                }

                .hero-subtitle {
                    font-size: 1.4rem;
                    color: var(--text-secondary);
                    margin-bottom: 48px;
                    line-height: 1.7;
                    max-width: 700px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .hero-actions {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 80px;
                }

                .btn-lg {
                    padding: 18px 36px;
                    font-size: 1.15rem;
                    border-radius: 16px;
                }

                .hero-stats {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 60px;
                    padding: 30px 60px;
                    width: fit-content;
                    margin: 0 auto;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }

                .stat-item h3 {
                    font-size: 2rem;
                    color: var(--text-primary);
                    margin-bottom: 4px;
                }

                .stat-item p {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .stat-divider {
                    width: 1px;
                    height: 50px;
                    background: rgba(255, 255, 255, 0.1);
                }

                .section-padding {
                    padding: 120px 0;
                }

                .feature-card {
                    padding: 48px;
                    text-align: center;
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .feature-card:hover {
                    transform: translateY(-12px);
                }

                .feature-icon-wrapper {
                    width: 70px;
                    height: 70px;
                    background: var(--accent-gradient);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 30px;
                    color: white;
                    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
                }

                .benefits-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr;
                    gap: 80px;
                    align-items: center;
                }

                .blob {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    background: var(--accent-glow);
                    filter: blur(120px);
                    border-radius: 50%;
                    z-index: 1;
                    opacity: 0.15;
                    pointer-events: none;
                }

                .blob-1 { top: -150px; right: -100px; }
                .blob-2 { bottom: -150px; left: -100px; }

                @media (max-width: 1024px) {
                    .hero-title { font-size: 4rem; }
                    .benefits-grid { grid-template-columns: 1fr; gap: 40px; }
                }

                @media (max-width: 768px) {
                    .hero-title { font-size: 3.2rem; letter-spacing: -1px; }
                    .hero-subtitle { font-size: 1.1rem; }
                    .hero-actions { flex-direction: column; }
                    .hero-stats { flex-direction: column; gap: 30px; padding: 40px; }
                    .stat-divider { display: none; }
                    .hero-section { padding-top: 120px; }
                }
            `}} />
        </div>
    );
}

export default Landing;
