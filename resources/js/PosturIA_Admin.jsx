import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { apiFetch, apiFetch as fetch } from "./api";

// ─── Global Styles ───────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Exo+2:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cyan: #00f5ff;
    --cyan-dim: #00c8d4;
    --cyan-glow: rgba(0,245,255,0.15);
    --blue-dark: #0a0e1a;
    --blue-mid: #0d1526;
    --blue-card: rgba(13,21,38,0.85);
    --blue-accent: #1a3a6e;
    --text: #e8f4f8;
    --text-dim: #7a9ab0;
    --glass: rgba(255,255,255,0.04);
    --glass-border: rgba(0,245,255,0.18);
    --font-display: 'Orbitron', monospace;
    --font-body: 'Exo 2', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--blue-dark);
    color: var(--text);
    font-family: var(--font-body);
    font-weight: 400;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--blue-dark); }
  ::-webkit-scrollbar-thumb { background: var(--cyan-dim); border-radius: 2px; }

  /* Grid BG */
  .grid-bg {
    background-image:
      linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  /* Glass card */
  .glass {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(12px);
    border-radius: 16px;
  }

  /* Glow text */
  .glow {
    color: var(--cyan);
    text-shadow: 0 0 20px rgba(0,245,255,0.6), 0 0 40px rgba(0,245,255,0.3);
  }

  /* Cyan btn */
  .btn-cyan {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background: transparent;
    border: 1px solid var(--cyan);
    color: var(--cyan);
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
    position: relative;
    overflow: hidden;
  }
  .btn-cyan::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--cyan);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .btn-cyan:hover {
    color: var(--blue-dark);
    box-shadow: 0 0 30px rgba(0,245,255,0.4);
  }
  .btn-cyan:hover::before { opacity: 1; }
  .btn-cyan span { position: relative; z-index: 1; }

  /* Outline btn */
  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.25);
    color: var(--text);
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
  }
  .btn-outline:hover {
    border-color: var(--cyan);
    color: var(--cyan);
  }

  /* Section */
  .section { padding: 100px 0; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

  /* Section label */
  .label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-display);
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--cyan);
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .label::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--cyan);
  }

  /* Title */
  .title {
    font-family: var(--font-display);
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 20px;
  }

  /* Navbar */
  .navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    padding: 16px 0;
    transition: background 0.3s, border-color 0.3s;
  }
  .navbar.scrolled {
    background: rgba(10,14,26,0.95);
    border-bottom: 1px solid var(--glass-border);
    backdrop-filter: blur(16px);
  }
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 900;
    text-decoration: none;
    color: var(--text);
    letter-spacing: 2px;
  }
  .nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
    list-style: none;
  }
  .nav-links a {
    color: var(--text-dim);
    text-decoration: none;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: var(--font-display);
    transition: color 0.3s;
  }
  .nav-links a:hover { color: var(--cyan); }

  /* Mobile menu */
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px;
  }
  .hamburger span {
    display: block;
    width: 24px;
    height: 1.5px;
    background: var(--cyan);
    transition: all 0.3s;
  }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .nav-links.open {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 60px; left: 0; right: 0;
      background: rgba(10,14,26,0.98);
      padding: 24px;
      border-bottom: 1px solid var(--glass-border);
      gap: 20px;
    }
  }

  /* Hero */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding-top: 80px;
  }
  .hero-content { max-width: 600px; }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(36px, 6vw, 72px);
    font-weight: 900;
    line-height: 1.05;
    margin-bottom: 24px;
  }
  .hero-sub {
    font-size: 18px;
    color: var(--text-dim);
    margin-bottom: 40px;
    font-weight: 300;
    max-width: 480px;
  }
  .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }

  /* Stat chips */
  .stats-row {
    display: flex;
    gap: 24px;
    margin-top: 60px;
    flex-wrap: wrap;
  }
  .stat-chip {
    text-align: center;
    padding: 16px 24px;
  }
  .stat-num {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
    color: var(--cyan);
  }
  .stat-lbl {
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* Floating vest visual */
  .vest-visual {
    position: relative;
    width: 420px;
    height: 480px;
    flex-shrink: 0;
  }
  .vest-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(0,245,255,0.15);
    animation: pulse-ring 3s ease-in-out infinite;
  }
  @keyframes pulse-ring {
    0%,100% { opacity: 0.15; transform: scale(1); }
    50% { opacity: 0.35; transform: scale(1.03); }
  }
.vest-img-wrap {
    position: absolute;
    inset: 5px; 
    border-radius: 50%; 
    overflow: hidden; 
    border: 2px solid rgba(0, 245, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
}

.vest-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
    object-position: 40% center;
}
  .vest-placeholder {
    width: 220px;
    height: 260px;
    background: linear-gradient(145deg, rgba(0,245,255,0.08) 0%, rgba(26,58,110,0.3) 100%);
    border-radius: 20px;
    border: 1px solid rgba(0,245,255,0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    position: relative;
    overflow: hidden;
  }
  .vest-placeholder::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(transparent, rgba(0,245,255,0.05), transparent 60%);
    animation: spin 4s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .vest-icon { font-size: 64px; position: relative; z-index: 1; }
  .vest-label {
    font-family: var(--font-display);
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--cyan);
    position: relative;
    z-index: 1;
  }

  /* Data nodes */
  .data-node {
    position: absolute;
    background: rgba(0,245,255,0.08);
    border: 1px solid var(--cyan-dim);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 11px;
    font-family: var(--font-display);
    color: var(--cyan);
    white-space: nowrap;
    animation: float 3s ease-in-out infinite;
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  /* Problem cards */
  .problem-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 48px;
  }
  .problem-card {
    padding: 28px;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .problem-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(0,245,255,0.1);
  }
  .problem-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--cyan), transparent);
  }
  .problem-icon {
    font-size: 36px;
    margin-bottom: 16px;
    display: block;
  }
  .problem-title {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
    letter-spacing: 1px;
  }
  .problem-text { font-size: 14px; color: var(--text-dim); line-height: 1.6; }

  /* How it works */
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-top: 48px;
    position: relative;
  }
  .step-card {
    padding: 32px 24px;
    text-align: center;
    position: relative;
  }
  .step-num {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid var(--cyan);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    color: var(--cyan);
    margin: 0 auto 20px;
  }
  .step-title {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .step-text { font-size: 13px; color: var(--text-dim); }

  /* Tech stack */
  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin-top: 48px;
  }
  .tech-chip {
    padding: 20px 16px;
    text-align: center;
    border-radius: 12px;
    background: rgba(0,245,255,0.04);
    border: 1px solid rgba(0,245,255,0.12);
    transition: all 0.3s;
    cursor: default;
  }
  .tech-chip:hover {
    background: rgba(0,245,255,0.08);
    border-color: var(--cyan);
    transform: scale(1.04);
  }
  .tech-chip-icon { font-size: 28px; margin-bottom: 8px; }
  .tech-chip-name {
    font-family: var(--font-display);
    font-size: 10px;
    letter-spacing: 1.5px;
    color: var(--cyan);
    text-transform: uppercase;
  }

  /* Testimonials */
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 24px;
    margin-top: 48px;
  }
  .testimonial-card {
    padding: 32px;
    position: relative;
    overflow: hidden;
  }
  .testimonial-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--cyan), transparent);
  }
  .testimonial-text {
    font-size: 14px;
    color: var(--text-dim);
    margin-bottom: 20px;
    line-height: 1.7;
  }
  .testimonial-author {
    font-family: var(--font-display);
    font-size: 12px;
    color: var(--cyan);
    letter-spacing: 1px;
  }

  /* Dashboard layout */
  .dash-layout {
    display: flex;
    height: 100vh;
    background: var(--blue-dark);
  }
  .sidebar {
    width: 240px;
    background: rgba(13,21,38,0.5);
    border-right: 1px solid var(--glass-border);
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .sidebar-logo {
    padding: 0 24px 32px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar-nav {
    list-style: none;
    padding: 0 12px;
  }
  .sidebar-nav li {
    margin-bottom: 8px;
  }
  .sidebar-nav button {
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    color: var(--text-dim);
    font-family: var(--font-display);
    font-size: 12px;
    letter-spacing: 1px;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sidebar-nav button:hover {
    background: rgba(0,245,255,0.08);
    color: var(--cyan);
  }
  .sidebar-nav li.active button {
    background: rgba(0,245,255,0.12);
    color: var(--cyan);
    border-left: 2px solid var(--cyan);
    padding-left: 14px;
  }
  .dash-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .dash-header {
    padding: 24px;
    border-bottom: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(13,21,38,0.3);
  }
  .dash-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  .metric-card {
    background: rgba(0,245,255,0.04);
    border: 1px solid rgba(0,245,255,0.12);
    border-radius: 12px;
    padding: 20px;
  }
  .metric-val {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .metric-lbl {
    font-size: 12px;
    color: var(--text-dim);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .patient-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .patient-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: rgba(0,245,255,0.04);
    border: 1px solid rgba(0,245,255,0.12);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .patient-row:hover {
    background: rgba(0,245,255,0.08);
    border-color: var(--cyan);
  }
  .patient-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .status-online {
    background: #00ff88;
    box-shadow: 0 0 6px #00ff88;
  }
  .status-offline {
    background: #ff6677;
    box-shadow: 0 0 6px #ff6677;
  }
  .status-unknown {
    background: var(--text-dim);
    box-shadow: none;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--cyan), var(--blue-accent));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: var(--blue-dark);
  }
  .graph-wrap {
    padding: 24px;
    margin-bottom: 24px;
  }
  .graph-title {
    font-family: var(--font-display);
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--text-dim);
    margin-bottom: 20px;
    text-transform: uppercase;
  }
  .angle-bar {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .angle-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .angle-name {
    font-family: var(--font-display);
    font-size: 12px;
    color: var(--text-dim);
    width: 80px;
  }
  .angle-track {
    flex: 1;
    height: 6px;
    background: rgba(0,245,255,0.1);
    border-radius: 3px;
    overflow: hidden;
  }
  .angle-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }
  .angle-val {
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 700;
    width: 40px;
    text-align: right;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  .modal-box {
    background: var(--blue-card);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 32px;
    max-width: 500px;
    width: 90%;
    position: relative;
    backdrop-filter: blur(12px);
  }
  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid var(--glass-border);
    border-radius: 50%;
    color: var(--text-dim);
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-close:hover {
    background: rgba(0,245,255,0.08);
    color: var(--cyan);
    border-color: var(--cyan);
  }
  .modal-title {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
  }
  .modal-sub {
    font-size: 13px;
    color: var(--text-dim);
    margin-bottom: 24px;
  }
  .form-group {
    margin-bottom: 16px;
  }
  .form-label {
    display: block;
    font-family: var(--font-display);
    font-size: 11px;
    letter-spacing: 1.5px;
    color: var(--text-dim);
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .form-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(0,245,255,0.04);
    border: 1px solid rgba(0,245,255,0.12);
    border-radius: 8px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    transition: all 0.3s;
  }
  .form-input:focus {
    outline: none;
    background: rgba(0,245,255,0.08);
    border-color: var(--cyan);
    box-shadow: 0 0 12px rgba(0,245,255,0.2);
  }
  .form-input::placeholder {
    color: var(--text-dim);
  }

  /* Login */
  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .login-card {
    width: 100%;
    max-width: 400px;
    padding: 40px;
  }
  .role-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .role-card {
    padding: 32px 24px;
    background: rgba(0,245,255,0.04);
    border: 1px solid rgba(0,245,255,0.12);
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  .role-card:hover {
    background: rgba(0,245,255,0.08);
    border-color: var(--cyan);
    transform: translateY(-4px);
  }
  .role-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  .role-name {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
  }

  /* Footer */
  footer {
    background: rgba(13,21,38,0.5);
    border-top: 1px solid var(--glass-border);
    padding: 60px 0 20px;
  }
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 40px;
    margin-bottom: 40px;
  }
  .footer-title {
    font-family: var(--font-display);
    font-size: 12px;
    letter-spacing: 2px;
    color: var(--cyan);
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .footer-links {
    list-style: none;
  }
  .footer-links li {
    margin-bottom: 8px;
  }
  .footer-links a {
    color: var(--text-dim);
    text-decoration: none;
    font-size: 13px;
    transition: color 0.3s;
  }
  .footer-links a:hover {
    color: var(--cyan);
  }
  .footer-copy {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid var(--glass-border);
    font-size: 12px;
    color: var(--text-dim);
  }
  .footer-copy p {
    margin: 4px 0;
  }

  /* Contact */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 48px;
  }
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .contact-item {
    display: flex;
    gap: 16px;
  }
  .contact-icon {
    font-size: 28px;
    flex-shrink: 0;
  }
  .contact-label {
    font-family: var(--font-display);
    font-size: 12px;
    letter-spacing: 1px;
    color: var(--text-dim);
    text-transform: uppercase;
  }
  .contact-val {
    font-size: 14px;
    color: var(--text);
    margin-top: 4px;
  }

  /* FAQ */
  .faq-item {
    margin-bottom: 16px;
  }
  .faq-q {
    width: 100%;
    padding: 16px;
    background: rgba(0,245,255,0.04);
    border: 1px solid rgba(0,245,255,0.12);
    border-radius: 8px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    cursor: pointer;
    text-align: left;
    transition: all 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .faq-q:hover {
    background: rgba(0,245,255,0.08);
    border-color: var(--cyan);
  }
  .faq-a {
    padding: 16px;
    background: rgba(0,245,255,0.02);
    border-left: 2px solid var(--cyan);
    margin-top: 8px;
    font-size: 13px;
    color: var(--text-dim);
    line-height: 1.7;
  }

  /* Plans */
  .plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 48px;
  }
  .plan-card {
    padding: 32px;
    background: rgba(0,245,255,0.04);
    border: 1px solid rgba(0,245,255,0.12);
    border-radius: 12px;
    position: relative;
  }
  .plan-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--cyan), transparent);
  }
  .plan-name {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 12px;
  }
  .plan-price {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 700;
    color: var(--cyan);
    margin-bottom: 4px;
  }
  .plan-period {
    font-size: 12px;
    color: var(--text-dim);
    margin-bottom: 24px;
  }
  .plan-features {
    list-style: none;
    margin-bottom: 24px;
  }
  .plan-features li {
    font-size: 13px;
    color: var(--text-dim);
    margin-bottom: 12px;
    padding-left: 20px;
    position: relative;
  }
  .plan-features li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--cyan);
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .dash-layout {
      flex-direction: column;
    }
    .sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid var(--glass-border);
      flex-direction: row;
      overflow-x: auto;
    }
    .sidebar-nav {
      display: flex;
      gap: 8px;
      padding: 0 12px;
    }
    .contact-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// ─── MINI CHART (UPGRADED COM COMPORTAMENTO PADRÃO) ────────────────────────────────────────────────
function MiniChart({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // ✅ CORREÇÃO 1: Limpa de verdade o canvas antes de qualquer novo desenho
    ctx.clearRect(0, 0, w, h);

    const safeData = Array.isArray(data) ? data.map(Number).filter(Number.isFinite) : [];
    if (safeData.length === 0) return;

    const max = 100; // Limite fixo de 100% para avaliação postural
    const min = 0;
    
    // ✅ CORREÇÃO 3: Evita divisão por zero (NaN/Infinity) se houver apenas 1 dado
    const step = w / (safeData.length - 1 || 1);

    // Mapeia as margens internas do gráfico para não cortar as linhas nas bordas
    const paddingY = 15;
    const chartHeight = h - paddingY * 2;

    const getPoint = (v, i) => {
      // Se houver apenas 1 dado cadastrado, centraliza ele no meio do gráfico
      const x = safeData.length === 1 ? w / 2 : i * step;
      const y = h - paddingY - ((v - min) / (max - min)) * chartHeight;
      return { x, y };
    };

    // ─── ELEMENTO 1: LINHAS DE GRADE DE FUNDO (ESTILO MONITOR HOSPITALAR) ───
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]); // Torna a linha tracejada
    
    // Desenha linhas guias horizontais em 25%, 50% e 75% da altura
    [0.25, 0.5, 0.75].forEach(pct => {
      ctx.beginPath();
      ctx.moveTo(0, h * pct);
      ctx.lineTo(w, h * pct);
      ctx.stroke();
    });
    ctx.setLineDash([]); // Reseta o tracejado para não afetar as próximas linhas

    // ─── ELEMENTO 2: ÁREA DE PREENCHIMENTO (DEGRADÊ SUTIL EM DECAIMENTO) ───
    const gradientFill = ctx.createLinearGradient(0, 0, 0, h);
    gradientFill.addColorStop(0, 'rgba(0, 245, 255, 0.20)'); // Ciano translúcido no topo
    gradientFill.addColorStop(1, 'rgba(0, 245, 255, 0.00)'); // Desvanece totalmente na base

    ctx.beginPath();
    safeData.forEach((v, i) => {
      const { x, y } = getPoint(v, i);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    // Fecha a forma geométrica ligando os pontos até o chão do gráfico
    if (safeData.length === 1) {
      ctx.lineTo(w / 2, h);
      ctx.lineTo(w / 2, h);
    } else {
      ctx.lineTo(getPoint(safeData[safeData.length - 1], safeData.length - 1).x, h);
      ctx.lineTo(getPoint(safeData[0], 0).x, h);
    }
    ctx.closePath();
    ctx.fillStyle = gradientFill;
    ctx.fill();

    // ─── ELEMENTO 3: LINHA NEON PRINCIPAL (COM EFEITO DE GLOW EXPONENCIAL) ───
    const gradientLine = ctx.createLinearGradient(0, 0, w, 0);
    gradientLine.addColorStop(0, '#00f5ff'); // Começa Ciano PosturIA
    gradientLine.addColorStop(1, '#00ff88'); // Termina em Verde Neon (Sucesso/Conexão)

    ctx.beginPath();
    safeData.forEach((v, i) => {
      const { x, y } = getPoint(v, i);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = gradientLine;
    ctx.lineWidth = 3; // Linha imponente e bem marcada
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Ativa o efeito de iluminação Glow real no Canvas
    ctx.shadowColor = 'rgba(0, 245, 255, 0.6)';
    ctx.shadowBlur = 8;
    ctx.stroke();
    
    // Desativa a sombra imediatamente para não borrar os próximos desenhos
    ctx.shadowBlur = 0;

    // ─── ELEMENTO 4: DIODOS/NÓS DE MAPEAMENTO (BOLINHAS NOS VÉRTICES) ───
    safeData.forEach((v, i) => {
      const { x, y } = getPoint(v, i);

      // Halo/Aura externa brilhante verde
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.35)';
      ctx.fill();

      // Núcleo central branco de alta intensidade
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });

  }, [data]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={120} 
      style={{ width: '100%', height: 'auto', display: 'block' }} 
    />
  );
}

// ─── LOGO ───────────────────────────────────────────────────────
function Logo({ size = 24 }) {
  return (
    <div style={{ fontFamily: "var(--font-display)", fontSize: size, fontWeight: 900, letterSpacing: 2, background: "linear-gradient(135deg, #00f5ff, #1a3a6e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      PosturIA
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App({ role, medicoId, userName, clinicName }) {

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const handleLogout = () => router.post("/logout");

  if (role === "medico" && medicoId) {
    return <DoctorDash onLogout={handleLogout} medicoId={medicoId} userName={userName} />;
  }
  if (role === "clinica") {
    return <ClinicDash onLogout={handleLogout} clinicName={clinicName} />;
  }

  return (
    <div className="login-wrap grid-bg">
      <div className="glass login-card" role="alert">
        <Logo size={26} />
        <p style={{ marginTop: 24, color: "var(--text-dim)" }}>
          Esta conta ainda não possui um perfil PosturIA autorizado. Entre em contato com a administração da clínica.
        </p>
        <button className="btn-outline" style={{ width: "100%", marginTop: 24, justifyContent: "center" }} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}

// ─── RELATÓRIOS VIEW ────────────────────────────────────────────────
function RelatoriosView({ pacientes }) {
  const [modo, setModo] = useState("agregado"); // agregado | individual
  const [pacienteId, setPacienteId] = useState(pacientes[0]?.id || null);
  const [historico, setHistorico] = useState([]);
  const [historicoAgregado, setHistoricoAgregado] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modo === "individual" && pacienteId) {
      setLoading(true);
      apiFetch(`/api/historico-postura?paciente_id=${pacienteId}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setHistorico(data))
        .catch(() => setHistorico([]))
        .finally(() => setLoading(false));
    }
  }, [modo, pacienteId]);

  useEffect(() => {
    if (modo !== "agregado") return;

    setLoading(true);
    apiFetch('/api/historico-postura/agregado')
      .then(res => res.ok ? res.json() : [])
      .then(data => setHistoricoAgregado(data.map(reg => Number(reg.percentual)).filter(Number.isFinite)))
      .catch(() => setHistoricoAgregado([]))
      .finally(() => setLoading(false));
  }, [modo]);

  const dadosGrafico = modo === "individual"
    ? historico.map(h => parseFloat(h.percentual))
    : historicoAgregado;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase" }}>
          Relatórios de Evolução
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={modo === "agregado" ? "btn-cyan" : "btn-outline"}
            style={{ padding: "8px 16px", fontSize: "10px" }}
            onClick={() => setModo("agregado")}
          >
            <span>Todos os Pacientes</span>
          </button>
          <button
            className={modo === "individual" ? "btn-cyan" : "btn-outline"}
            style={{ padding: "8px 16px", fontSize: "10px" }}
            onClick={() => setModo("individual")}
          >
            <span>Por Paciente</span>
          </button>
        </div>
      </div>

      {modo === "individual" && (
        <div className="form-group" style={{ maxWidth: 320, marginBottom: 24 }}>
          <label className="form-label">Selecione o paciente</label>
          <select
            className="form-input"
            value={pacienteId || ""}
            onChange={e => setPacienteId(parseInt(e.target.value))}
          >
            {pacientes.map(pt => (
              <option key={pt.id} value={pt.id}>{pt.nome}</option>
            ))}
          </select>
        </div>
      )}

      <div className="glass graph-wrap">
        <div className="graph-title">
          {modo === "individual" ? "EVOLUÇÃO DE POSTURA — ÚLTIMOS REGISTROS" : "MÉDIA DE POSTURA — TODOS OS PACIENTES"}
        </div>
        
        {/* 🌟 AGORA O MINICHART É CHAMADO DIRETO SEM A TRAVA DO COMPRIMENTO DO ARRAY */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-dim)" }}>Carregando...</div>
        ) : (
          <MiniChart data={dadosGrafico} />
        )}
      </div>
    </>
  );
}

// ─── AGENDA VIEW ────────────────────────────────────────────────────
function AgendaView({ pacientes, medicoId }) {
  const [consultas, setConsultas] = useState([]);
  const [modalConsulta, setModalConsulta] = useState(false);
  const [formConsulta, setFormConsulta] = useState({ paciente_id: "", data: "", hora: "", observacao: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchConsultas = () => {
    fetch(`/api/consultas?medico_id=${medicoId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setConsultas(data))
      .catch(() => setConsultas([]));
  };

  useEffect(() => { fetchConsultas(); }, [medicoId]);

  const salvarConsulta = async () => {
    if (!formConsulta.paciente_id || !formConsulta.data || !formConsulta.hora) {
      setMsg("Erro: Preencha paciente, data e hora.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id: parseInt(formConsulta.paciente_id),
          medico_id: medicoId,
          data_hora: `${formConsulta.data} ${formConsulta.hora}:00`,
          observacao: formConsulta.observacao || null,
        }),
      });
      if (res.ok) {
        setMsg("Consulta agendada com sucesso!");
        setFormConsulta({ paciente_id: "", data: "", hora: "", observacao: "" });
        fetchConsultas();
        setTimeout(() => { setModalConsulta(false); setMsg(""); }, 1200);
      } else {
        const err = await res.json();
        setMsg("Erro: " + (err.message || JSON.stringify(err.errors)));
      }
    } catch {
      setMsg("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const removerConsulta = async (id) => {
    try {
      await fetch(`/api/consultas/${id}`, { method: "DELETE" });
      fetchConsultas();
    } catch {}
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase" }}>
          Agenda de Consultas
        </div>
        <button className="btn-cyan" style={{ padding: "8px 16px", fontSize: "10px" }} onClick={() => setModalConsulta(true)}>
          <span>+ Nova Consulta</span>
        </button>
      </div>

      <div className="patient-list">
        {consultas.length > 0 ? (
          consultas.map(c => (
            <div key={c.id} className="patient-row" style={{ cursor: "default" }}>
              <div className="patient-info">
                <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                  {c.paciente?.nome?.split(" ").map(w => w[0]).join("") || "?"}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{c.paciente?.nome || "Paciente"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{c.observacao || "Sem observações"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "var(--cyan)", fontFamily: "var(--font-display)" }}>
                    {new Date(c.data_hora).toLocaleDateString("pt-BR")}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                    {new Date(c.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <button className="modal-close" style={{ position: "static" }} onClick={() => removerConsulta(c.id)}>✕</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-dim)" }}>
            Nenhuma consulta agendada. Clique em "+ Nova Consulta" para começar.
          </div>
        )}
      </div>

      {modalConsulta && (
        <div className="modal-overlay" onClick={() => setModalConsulta(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalConsulta(false)}>✕</button>
            <div className="modal-title">Nova Consulta</div>
            <div className="modal-sub">Agende uma consulta para um paciente</div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Paciente</label>
              <select
                className="form-input"
                value={formConsulta.paciente_id}
                onChange={e => setFormConsulta(prev => ({ ...prev, paciente_id: e.target.value }))}
              >
                <option value="">Selecione um paciente</option>
                {pacientes.map(pt => (
                  <option key={pt.id} value={pt.id}>{pt.nome}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Data</label>
                <input
                  className="form-input"
                  type="date"
                  value={formConsulta.data}
                  onChange={e => setFormConsulta(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Hora</label>
                <input
                  className="form-input"
                  type="time"
                  value={formConsulta.hora}
                  onChange={e => setFormConsulta(prev => ({ ...prev, hora: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Observação (opcional)</label>
              <input
                className="form-input"
                placeholder="Ex: Consulta de retorno"
                value={formConsulta.observacao}
                onChange={e => setFormConsulta(prev => ({ ...prev, observacao: e.target.value }))}
              />
            </div>

            {msg && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 13,
                  background: msg.startsWith("Erro") ? "rgba(255,68,85,0.1)" : "rgba(0,255,136,0.1)",
                  border: `1px solid ${msg.startsWith("Erro") ? "rgba(255,68,85,0.3)" : "rgba(0,255,136,0.3)"}`,
                  color: msg.startsWith("Erro") ? "#ff6677" : "#00ff88",
                }}
              >
                {msg}
              </div>
            )}
            <button className="btn-cyan" style={{ width: "100%", justifyContent: "center" }} onClick={salvarConsulta} disabled={loading}>
              <span>{loading ? "Salvando..." : "Agendar Consulta"}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── ALERTAS VIEW ───────────────────────────────────────────────────
function AlertasView({ medicoId }) {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/alertas?medico_id=${medicoId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setAlertas(data))
      .catch(() => setAlertas([]))
      .finally(() => setLoading(false));
  }, [medicoId]);

  return (
    <>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 16 }}>
        Alertas Recentes
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-dim)" }}>Carregando...</div>
      ) : (
        <div className="patient-list">
          {alertas.length > 0 ? (
            alertas.map(a => (
              <div key={a.id} className="patient-row" style={{ cursor: "default" }}>
                <div className="patient-info">
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffaa00", boxShadow: "0 0 6px #ffaa00", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>
                      {a.pacientes?.nome || "Paciente"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{a.descricao_alerta}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                  {a.criado_em ? new Date(a.criado_em).toLocaleString("pt-BR") : ""}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-dim)" }}>
              Nenhum alerta registrado.
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─── DOCTOR DASHBOARD ─────────────────────────────────────────────
function DoctorDash({ onLogout, medicoId: accountMedicoId, userName }) {
  const [selected, setSelected] = useState(null);
  const [activeNav, setActiveNav] = useState("pacientes");
  const [chartData, setChartData] = useState([]);
  const [alertasHoje, setAlertasHoje] = useState(null);
  const [modalPaciente, setModalPaciente] = useState(false);
  const [formPaciente, setFormPaciente] = useState({ nome: "", data_nascimento: "", patologia: "" });
  const [pacientes, setPacientes] = useState([]);
  const [msgPaciente, setMsgPaciente] = useState("");
  const [loading, setLoading] = useState(false);
  const [medicoInfo, setMedicoInfo] = useState(null);

  const medicoId = Number(accountMedicoId);

  useEffect(() => {
    // Buscar informações do médico
    const fetchMedicoInfo = async () => {
      try {
        const res = await fetch(`/api/medicos/${medicoId}`);
        if (res.ok) {
          const data = await res.json();
          setMedicoInfo(data);
        }
      } catch (err) {
        console.error("Erro ao buscar médico:", err);
      }
    };

    // Buscar pacientes do médico
    const fetchPacientes = async () => {
      try {
        const res = await fetch(`/api/pacientes?medico_id=${medicoId}`);
        if (res.ok) {
          const data = await res.json();
          setPacientes(data);
        }
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      }
    };

    fetchMedicoInfo();
    fetchPacientes();
    apiFetch(`/api/alertas?medico_id=${medicoId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setAlertasHoje(data.filter(a => a.criado_em && new Date(a.criado_em).toDateString() === new Date().toDateString()).length))
      .catch(() => setAlertasHoje(null));
  }, [medicoId]);

  const salvarPaciente = async () => {
    if (!formPaciente.nome || !formPaciente.data_nascimento || !formPaciente.patologia) {
      setMsgPaciente("Erro: Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formPaciente.nome,
          data_nascimento: formPaciente.data_nascimento,
          patologia: formPaciente.patologia,
          medico_id: medicoId,
        }),
      });
      if (res.ok) {
        const newPaciente = await res.json();
        setPacientes([...pacientes, newPaciente]);
        setMsgPaciente("Paciente cadastrado com sucesso!");
        setFormPaciente({ nome: "", data_nascimento: "", patologia: "" });
        setTimeout(() => { setModalPaciente(false); setMsgPaciente(""); }, 1500);
      } else {
        const err = await res.json();
        setMsgPaciente("Erro: " + (err.message || JSON.stringify(err.errors)));
      }
    } catch {
      setMsgPaciente("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const p = selected !== null ? pacientes[selected] : null;

  useEffect(() => {
    if (!p) {
      setChartData([]);
      return;
    }

    let cancelled = false;
    apiFetch(`/api/historico-postura?paciente_id=${p.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(registros => {
        if (!cancelled) setChartData(registros.map(registro => Number(registro.percentual)));
      })
      .catch(() => {
        if (!cancelled) setChartData([]);
      });

    return () => { cancelled = true; };
  }, [p?.id]);

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><Logo size={18} /></div>
        <ul className="sidebar-nav">
          {[
            { id: "pacientes", label: "Pacientes", icon: "👥" },
            { id: "relatorios", label: "Relatórios", icon: "📊" },
            { id: "agenda", label: "Agenda", icon: "📅" },
            { id: "alertas", label: "Alertas", icon: "🔔" },
          ].map(n => (
            <li key={n.id} className={activeNav === n.id ? "active" : ""}>
              <button onClick={() => { setActiveNav(n.id); setSelected(null); }}>
                <span>{n.icon}</span> {n.label}
              </button>
            </li>
          ))}
        </ul>
        <ul className="sidebar-nav" style={{ paddingTop: 16, borderTop: "1px solid var(--glass-border)" }}>
          <li>
            <button onClick={onLogout}><span>🚪</span> Sair</button>
          </li>
        </ul>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>
              {p ? p.nome : "Painel Médico"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
              {medicoInfo ? `Dr(a). ${medicoInfo.nome} — ${medicoInfo.area}` : "Carregando..."}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--font-display)", letterSpacing: 1 }}>
              {new Date().toLocaleTimeString("pt-BR")}
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px #00ff88" }} />
          </div>
        </div>

        <div className="dash-content">
          {activeNav === "pacientes" && (
            !p ? (
              <>
                <div className="metrics-row">
                  <div className="metric-card">
                    <div className="metric-val" style={{ color: "var(--cyan)" }}>{pacientes.length}</div>
                    <div className="metric-lbl">Pacientes</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val" style={{ color: "#00ff88" }}>{pacientes.filter(pt => pt.status_conexao === 1).length}</div>
                    <div className="metric-lbl">Coletes online</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val" style={{ color: "#ffaa00" }}>{alertasHoje ?? "—"}</div>
                    <div className="metric-lbl">Alertas hoje</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val" style={{ color: "var(--cyan)" }}>
                      {(() => {
                        const medidos = pacientes.filter(pt => pt.postura_media_percentual !== null && pt.postura_media_percentual !== undefined);
                        return medidos.length
                          ? `${(medidos.reduce((sum, pt) => sum + Number(pt.postura_media_percentual), 0) / medidos.length).toFixed(1)}%`
                          : "—";
                      })()}
                    </div>
                    <div className="metric-lbl">Postura correta (média)</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Lista de Pacientes
                  </div>
                  <button className="btn-cyan" style={{ padding: "8px 16px", fontSize: "10px" }} onClick={() => setModalPaciente(true)}>
                    <span>+ Adicionar Paciente</span>
                  </button>
                </div>

                <div className="patient-list">
                  {pacientes.length > 0 ? (
                    pacientes.map((pt, i) => (
                      <div key={i} className="patient-row" onClick={() => setSelected(i)}>
                        <div className="patient-info">
                          <div className={`status-dot ${pt.status_conexao === 1 ? "status-online" : pt.status_conexao === 0 ? "status-offline" : "status-unknown"}`} />
                          <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                            {pt.nome.split(" ").map(w => w[0]).join("")}
                          </div>
                          <div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{pt.nome}</div>
                            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{pt.patologia}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, color: pt.status_conexao === 1 ? "#00ff88" : "var(--text-dim)" }}>
                            {pt.status_conexao === 1 ? "● Online" : pt.status_conexao === 0 ? "Offline" : "Sem telemetria"}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                            Postura: {pt.postura_media_percentual == null ? "Sem medição" : `${pt.postura_media_percentual}%`}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-dim)" }}>
                      Nenhum paciente cadastrado. Clique em "+ Adicionar Paciente" para começar.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button className="btn-outline" style={{ marginBottom: 24, padding: "8px 16px", fontSize: "10px" }} onClick={() => setSelected(null)}>
                  ← Voltar
                </button>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                  <div className="metric-card">
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Paciente</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text)" }}>{p.nome}</div>
                  </div>
                  <div className="metric-card">
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Diagnóstico</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "var(--cyan)" }}>{p.patologia}</div>
                  </div>
                  <div className="metric-card">
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Status do Colete</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: p.status_conexao === 1 ? "#00ff88" : p.status_conexao === 0 ? "#ff6677" : "var(--text-dim)" }}>
                      {p.status_conexao === 1 ? "● Online" : p.status_conexao === 0 ? "Offline" : "Sem telemetria"}
                    </div>
                  </div>
                  <div className="metric-card">
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Postura Média</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text)" }}>
                      {p.postura_media_percentual == null ? "Sem medição" : `${p.postura_media_percentual}%`}
                    </div>
                  </div>
                </div>

                <div className="glass graph-wrap" style={{ marginBottom: 20 }}>
                  <div className="graph-title">HISTÓRICO DE VARIAÇÃO POSTURAL — ÚLTIMA HORA</div>
                  {chartData.length > 0
                    ? <MiniChart data={chartData} />
                    : <p style={{ color: "var(--text-dim)", textAlign: "center", padding: 32 }}>Nenhuma medição real registrada para este paciente.</p>}
                </div>
              </>
            )
          )}

          {activeNav === "relatorios" && <RelatoriosView pacientes={pacientes} />}
          {activeNav === "agenda" && <AgendaView pacientes={pacientes} medicoId={medicoId} />}
          {activeNav === "alertas" && <AlertasView medicoId={medicoId} />}
        </div>
      </main>

      {modalPaciente && (
        <div className="modal-overlay" onClick={() => setModalPaciente(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalPaciente(false)}>✕</button>
            <div className="modal-title">Adicionar Paciente</div>
            <div className="modal-sub">Preencha os dados do novo paciente</div>

            {[
              { key: "nome", label: "Nome Completo" },
              { key: "data_nascimento", label: "Data de Nascimento" },
              { key: "patologia", label: "Patologia" },
            ].map(f => (
              <div key={f.key} className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">{f.label}</label>
                <input
                  className="form-input"
                  placeholder={f.label}
                  type={f.key === "data_nascimento" ? "date" : "text"}
                  value={formPaciente[f.key]}
                  onChange={e => setFormPaciente(prev => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}

            {msgPaciente && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 13,
                  background: msgPaciente.startsWith("Erro") ? "rgba(255,68,85,0.1)" : "rgba(0,255,136,0.1)",
                  border: `1px solid ${msgPaciente.startsWith("Erro") ? "rgba(255,68,85,0.3)" : "rgba(0,255,136,0.3)"}`,
                  color: msgPaciente.startsWith("Erro") ? "#ff6677" : "#00ff88",
                }}
              >
                {msgPaciente}
              </div>
            )}
            <button className="btn-cyan" style={{ width: "100%", justifyContent: "center" }} onClick={salvarPaciente} disabled={loading}>
              <span>{loading ? "Salvando..." : "Salvar Paciente"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

 // ─── VISÃO GERAL VIEW (CLÍNICA) ─────────────────────────────────────
function VisaoGeralView({ medicos }) {
  const pacientes = medicos.flatMap(m => m.pacientes || []);
  const medidos = pacientes
    .filter(p => p.postura_media_percentual !== null && p.postura_media_percentual !== undefined)
    .map(p => Number(p.postura_media_percentual));
  const media = medidos.length ? (medidos.reduce((sum, value) => sum + value, 0) / medidos.length).toFixed(1) : null;
  const totalOnline = pacientes.filter(p => p.status_conexao === 1).length;

  return (
    <>
      <div className="metrics-row">
        <div className="metric-card"><div className="metric-val" style={{ color: "var(--cyan)" }}>{medicos.length}</div><div className="metric-lbl">Médicos ativos</div></div>
        <div className="metric-card"><div className="metric-val" style={{ color: "#00ff88" }}>{pacientes.length}</div><div className="metric-lbl">Pacientes totais</div></div>
        <div className="metric-card"><div className="metric-val" style={{ color: "#00ff88" }}>{totalOnline}</div><div className="metric-lbl">Coletes online</div></div>
        <div className="metric-card"><div className="metric-val" style={{ color: "var(--cyan)" }}>{media === null ? "—" : `${media}%`}</div><div className="metric-lbl">Média das medições registradas</div></div>
      </div>

      <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 16 }}>
        Resumo por Médico
      </div>
      <div className="patient-list">
        {medicos.length > 0 ? medicos.map((doc, i) => (
          <div key={i} className="patient-row" style={{ cursor: "default" }}>
            <div className="patient-info">
              <div className="avatar">{doc.nome.split(" ").slice(0, 2).map(w => w[0]).join("")}</div>
              <div><div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{doc.nome}</div><div style={{ fontSize: 12, color: "var(--text-dim)" }}>{doc.area}</div></div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{doc.pacientes ? doc.pacientes.length : 0} paciente{doc.pacientes && doc.pacientes.length !== 1 ? "s" : ""}</div>
          </div>
        )) : <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-dim)" }}>Nenhum médico cadastrado ainda.</div>}
      </div>
    </>
  );
}

// ─── PACIENTES VIEW (CLÍNICA) ───────────────────────────────────────
function PacientesClinicaView({ medicos }) {
  const [filtroMedico, setFiltroMedico] = useState("todos");

  const todosOsPacientes = medicos.flatMap(m =>
    (m.pacientes || []).map(p => ({ ...p, _medicoNome: m.nome, _medicoId: m.id }))
  );

  const pacientesFiltrados = filtroMedico === "todos"
    ? todosOsPacientes
    : todosOsPacientes.filter(p => p._medicoId === parseInt(filtroMedico));

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase" }}>
          Todos os Pacientes ({pacientesFiltrados.length})
        </div>
        <select
          className="form-input"
          style={{ maxWidth: 240 }}
          value={filtroMedico}
          onChange={e => setFiltroMedico(e.target.value)}
        >
          <option value="todos">Todos os médicos</option>
          {medicos.map(m => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>
      </div>

      <div className="patient-list">
        {pacientesFiltrados.length > 0 ? (
          pacientesFiltrados.map((pt, i) => (
            <div key={i} className="patient-row" style={{ cursor: "default" }}>
              <div className="patient-info">
                <div className={`status-dot ${pt.status_conexao === 1 ? "status-online" : pt.status_conexao === 0 ? "status-offline" : "status-unknown"}`} />
                <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                  {pt.nome.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{pt.nome}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{pt.patologia} • Dr(a). {pt._medicoNome}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: pt.status_conexao === 1 ? "#00ff88" : "var(--text-dim)" }}>
                  {pt.status_conexao === 1 ? "● Online" : pt.status_conexao === 0 ? "Offline" : "Sem telemetria"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                  {/* ✅ PREVENÇÃO: Garante valor limpo caso o percentual do paciente seja nulo */}
                  Postura: {pt.postura_media_percentual == null ? "Sem medição" : `${pt.postura_media_percentual}%`}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-dim)" }}>
            Nenhum paciente encontrado para este filtro.
          </div>
        )}
      </div>
    </>
  );
}

// ─── MÉTRICAS VIEW (CLÍNICA) ────────────────────────────────────────
function MetricasView({ medicos }) {
  const comparativo = medicos.map(m => {
    const pacientes = m.pacientes || [];
    const medidos = pacientes
      .filter(p => p.postura_media_percentual !== null && p.postura_media_percentual !== undefined)
      .map(p => Number(p.postura_media_percentual));
    return {
      nome: m.nome,
      area: m.area,
      qtdPacientes: pacientes.length,
      aderencia: medidos.length ? medidos.reduce((sum, value) => sum + value, 0) / medidos.length : null,
    };
  }).sort((a, b) => (b.aderencia ?? -1) - (a.aderencia ?? -1));
  const medias = comparativo.map(c => c.aderencia).filter(value => value !== null);
  const mediaGeral = medias.length ? (medias.reduce((sum, value) => sum + value, 0) / medias.length).toFixed(1) : null;
  const dadosGrafico = comparativo.map(c => c.aderencia).filter(value => value !== null);

  return (
    <>
      <div className="glass graph-wrap" style={{ marginBottom: 24 }}>
        <div className="graph-title">MEDIÇÕES POSTURAIS REGISTRADAS POR MÉDICO</div>
        {dadosGrafico.length >= 2
          ? <MiniChart data={dadosGrafico} />
          : <p style={{ color: "var(--text-dim)", textAlign: "center", padding: 24 }}>Dados reais insuficientes para gerar um gráfico comparativo.</p>}
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-dim)" }}>
          Média das medições registradas: <span style={{ color: "var(--cyan)", fontFamily: "var(--font-display)" }}>{mediaGeral === null ? "—" : `${mediaGeral}%`}</span>
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 16 }}>Comparativo entre Médicos</div>
      <div className="patient-list">
        {comparativo.length > 0 ? comparativo.map((c, i) => (
          <div key={i} className="patient-row" style={{ cursor: "default" }}>
            <div className="patient-info"><div className="avatar">{c.nome.split(" ").slice(0, 2).map(w => w[0]).join("")}</div><div><div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{c.nome}</div><div style={{ fontSize: 12, color: "var(--text-dim)" }}>{c.area} • {c.qtdPacientes} paciente{c.qtdPacientes !== 1 ? "s" : ""}</div></div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--cyan)" }}>{c.aderencia === null ? "Sem medições" : `${c.aderencia.toFixed(1)}%`}</div><div style={{ fontSize: 11, color: "var(--text-dim)" }}>média registrada</div></div>
          </div>
        )) : <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-dim)" }}>Nenhum médico cadastrado ainda.</div>}
      </div>
    </>
  );
}

// ─── CLINIC DASHBOARD ─────────────────────────────────────────────
function ClinicDash({ onLogout, clinicName }) {
  const [selDoc, setSelDoc] = useState(null);
  const [activeNav, setActiveNav] = useState("visao-geral");
  const [medicos, setMedicos] = useState([]);
  const [modalMedico, setModalMedico] = useState(false);
  const [formMedico, setFormMedico] = useState({ nome: "", data_nascimento: "", registro_profissional: "", area: "" });
  const [msgMedico, setMsgMedico] = useState("");
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const res = await fetch("/api/medicos");
        if (res.ok) {
          const data = await res.json();
          setMedicos(data);
        }
      } catch (err) {
        console.error("Erro ao buscar médicos:", err);
      }
    };
    fetchMedicos();
  }, []);
 
  const salvarMedico = async () => {
    if (!formMedico.nome || !formMedico.data_nascimento || !formMedico.registro_profissional || !formMedico.area) {
      setMsgMedico("Erro: Preencha todos os campos.");
      return;
    }

    const area = formMedico.area.toLowerCase().trim();
    if (area !== "fisioterapeuta" && area !== "ortopedista") {
      setMsgMedico("Erro: informe fisioterapeuta ou ortopedista.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/api/medicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formMedico.nome,
          data_nascimento: formMedico.data_nascimento,
          registro_profissional: formMedico.registro_profissional.trim(),
          area,
        }),
      });

      if (res.ok) {
        const newMedico = await res.json();
        setMedicos(prev => [...prev, newMedico]);
        setMsgMedico("Médico cadastrado com sucesso!");
        setFormMedico({ nome: "", data_nascimento: "", registro_profissional: "", area: "" });
        setTimeout(() => {
          setModalMedico(false);
          setMsgMedico("");
        }, 1500);
      } else {
        const err = await res.json();
        setMsgMedico("Erro: " + (err.message || JSON.stringify(err.errors)));
      }
    } catch {
      setMsgMedico("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const d = selDoc !== null ? medicos[selDoc] : null;
  const pacientesClinica = medicos.flatMap(m => m.pacientes || []);
  const medidasClinica = pacientesClinica
    .filter(p => p.postura_media_percentual !== null && p.postura_media_percentual !== undefined)
    .map(p => Number(p.postura_media_percentual));
  const mediaClinica = medidasClinica.length
    ? `${(medidasClinica.reduce((sum, value) => sum + value, 0) / medidasClinica.length).toFixed(1)}%`
    : "—";
 
  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><Logo size={18} /></div>
        <ul className="sidebar-nav">
          {[
            { id: "visao-geral", label: "Visão Geral", icon: "🏥" },
            { id: "medicos", label: "Médicos", icon: "👨‍⚕️" },
            { id: "pacientes", label: "Pacientes", icon: "👥" },
            { id: "metricas", label: "Métricas", icon: "📊" },
          ].map(n => (
            <li key={n.id} className={activeNav === n.id ? "active" : ""}>
              <button onClick={() => { setActiveNav(n.id); setSelDoc(null); }}>
                <span>{n.icon}</span> {n.label}
              </button>
            </li>
          ))}
        </ul>
        <ul className="sidebar-nav" style={{ paddingTop: 16, borderTop: "1px solid var(--glass-border)" }}>
          <li><button onClick={onLogout}><span>🚪</span> Sair</button></li>
        </ul>
      </aside>
 
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>
              {d ? d.nome : "Painel da Clínica"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{clinicName || "Clínica"}</div>
          </div>
        </div>
 
        <div className="dash-content">
          {activeNav === "visao-geral" && <VisaoGeralView medicos={medicos} />}
 
          {activeNav === "medicos" && (
            !d ? (
              <>
                <div className="metrics-row">
                  <div className="metric-card">
                    <div className="metric-val" style={{ color: "var(--cyan)" }}>{medicos.length}</div>
                    <div className="metric-lbl">Médicos ativos</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val" style={{ color: "#00ff88" }}>
                      {medicos.reduce((sum, m) => sum + (m.pacientes ? m.pacientes.length : 0), 0)}
                    </div>
                    <div className="metric-lbl">Pacientes totais</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val" style={{ color: "#00ff88" }}>
                      {medicos.reduce((sum, m) => sum + (m.pacientes ? m.pacientes.filter(p => p.status_conexao === 1).length : 0), 0)}
                    </div>
                    <div className="metric-lbl">Coletes online</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val" style={{ color: "var(--cyan)" }}>{mediaClinica}</div>
                    <div className="metric-lbl">Aderência média</div>
                  </div>
                </div>
 
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Médicos da Clínica
                  </div>
                  <button className="btn-cyan" style={{ padding: "8px 16px", fontSize: "10px" }} onClick={() => setModalMedico(true)}>
                    <span>+ Adicionar Médico</span>
                  </button>
                </div>
 
                <div className="patient-list">
                  {medicos.length > 0 ? (
                    medicos.map((doc, i) => (
                      <div key={i} className="patient-row" onClick={() => setSelDoc(i)}>
                        <div className="patient-info">
                          <div className="avatar">{doc.nome.split(" ").slice(0, 2).map(w => w[0]).join("")}</div>
                          <div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{doc.nome}</div>
                            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{doc.area} — {doc.registro_profissional}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                          {doc.pacientes ? doc.pacientes.length : 0} paciente{doc.pacientes && doc.pacientes.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-dim)" }}>
                      Nenhum médico cadastrado. Clique em "+ Adicionar Médico" para começar.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button className="btn-outline" style={{ marginBottom: 24, padding: "8px 16px", fontSize: "10px" }} onClick={() => setSelDoc(null)}>
                  ← Voltar
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div className="metric-card">
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Especialidade</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--cyan)" }}>{d.area}</div>
                  </div>
                  <div className="metric-card">
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Registro</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text)" }}>{d.registro_profissional}</div>
                  </div>
                </div>
 
                <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", marginBottom: 16, textTransform: "uppercase" }}>
                  Pacientes Vinculados
                </div>
                <div className="patient-list">
                  {d.pacientes && d.pacientes.length > 0 ? (
                    d.pacientes.map((pt, pi) => (
                      <div key={pi} className="patient-row" style={{ cursor: "default" }}>
                        <div className="patient-info">
                          <div className={`status-dot ${pt.status_conexao === 1 ? "status-online" : pt.status_conexao === 0 ? "status-offline" : "status-unknown"}`} />
                          <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                            {pt.nome.split(" ").map(w => w[0]).join("")}
                          </div>
                          <div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{pt.nome}</div>
                            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{pt.patologia}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, color: pt.status_conexao === 1 ? "#00ff88" : "var(--text-dim)" }}>
                            {pt.status_conexao === 1 ? "● Online" : pt.status_conexao === 0 ? "Offline" : "Sem telemetria"}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                            Postura: {pt.postura_media_percentual == null ? "Sem medição" : `${pt.postura_media_percentual}%`}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-dim)" }}>
                      Este médico não possui pacientes cadastrados.
                    </div>
                  )}
                </div>
              </>
            )
          )}
 
          {activeNav === "pacientes" && <PacientesClinicaView medicos={medicos} />}
          {activeNav === "metricas" && <MetricasView medicos={medicos} />}
        </div>
      </main>
 
      {modalMedico && (
        <div className="modal-overlay" onClick={() => setModalMedico(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalMedico(false)}>✕</button>
            <div className="modal-title">Adicionar Médico</div>
            <div className="modal-sub">Preencha os dados do novo médico</div>
 
            {[
              { key: "nome", label: "Nome Completo" },
              { key: "data_nascimento", label: "Data de Nascimento" },
              { key: "registro_profissional", label: "Registro profissional (CRM/CREFITO)" },
              { key: "area", label: "Área (fisioterapeuta ou ortopedista)" },
            ].map(f => (
              <div key={f.key} className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">{f.label}</label>
                <input
                  className="form-input"
                  placeholder={f.label}
                  type={f.key === "data_nascimento" ? "date" : "text"}
                  value={formMedico[f.key]}
                  onChange={e => setFormMedico(prev => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
 
            {msgMedico && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 13,
                  background: msgMedico.startsWith("Erro") ? "rgba(255,68,85,0.1)" : "rgba(0,255,136,0.1)",
                  border: `1px solid ${msgMedico.startsWith("Erro") ? "rgba(255,68,85,0.3)" : "rgba(0,255,136,0.3)"}`,
                  color: msgMedico.startsWith("Erro") ? "#ff6677" : "#00ff88",
                }}
              >
                {msgMedico}
              </div>
            )}
            <button className="btn-cyan" style={{ width: "100%", justifyContent: "center" }} onClick={salvarMedico} disabled={loading}>
              <span>{loading ? "Salvando..." : "Salvar Médico"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
