import { useState, useEffect, useRef } from "react";
import { router, useForm } from "@inertiajs/react";

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
    /* Ajuste o inset para 0 ou um valor pequeno se quiser que ela encoste no círculo externo */
    inset: 5px; 
    
    /* Faz o container ser um círculo perfeito */
    border-radius: 50%; 
    
    /* Garante que nada saia para fora do círculo */
    overflow: hidden; 
    
    /* Estilo opcional: uma borda fina para dar acabamento */
    border: 2px solid rgba(0, 245, 255, 0.3);
    
    display: flex;
    align-items: center;
    justify-content: center;
}

.vest-img-wrap img {
    /* Força a imagem a ter o tamanho do container */
    width: 100%;
    height: 100%;
    
    /* A MÁGICA: Preenche o círculo cortando as bordas da foto retangular */
    object-fit: cover; 
    
    /* Move o foco um pouco para a esquerda se o rosto do cara estiver sendo cortado */
    /* Mude para 'center' ou '20% center' se precisar ajustar */
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
  }
  .testimonial-card::before {
    content: '"';
    position: absolute;
    top: 16px; left: 24px;
    font-family: var(--font-display);
    font-size: 60px;
    color: rgba(0,245,255,0.1);
    line-height: 1;
  }
  .testimonial-text {
    font-size: 15px;
    color: var(--text-dim);
    line-height: 1.7;
    margin-bottom: 20px;
    font-style: italic;
  }
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    background: rgba(0,245,255,0.1);
    border: 1px solid rgba(0,245,255,0.3);
    color: var(--cyan);
  }
  .author-name {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
  }
  .author-role { font-size: 12px; color: var(--text-dim); }

  /* Footer */
  footer {
    background: var(--blue-mid);
    border-top: 1px solid var(--glass-border);
    padding: 60px 0 32px;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 48px;
  }
  @media (max-width: 768px) {
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .vest-visual { display: none; }
    .hero { flex-direction: column; text-align: center; }
    .hero-btns { justify-content: center; }
    .stats-row { justify-content: center; }
  }
  .footer-title {
    font-family: var(--font-display);
    font-size: 12px;
    letter-spacing: 2px;
    color: var(--cyan);
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .footer-links a { color: var(--text-dim); text-decoration: none; font-size: 14px; transition: color 0.2s; }
  .footer-links a:hover { color: var(--cyan); }
  .footer-copy {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .footer-copy p { font-size: 12px; color: var(--text-dim); }

  /* Login */
  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--blue-dark);
    position: relative;
  }
  .login-card {
    width: 420px;
    max-width: 90vw;
    padding: 48px 40px;
    position: relative;
  }
  .login-card::before {
    content: '';
    position: absolute;
    top: -1px; left: 20px; right: 20px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  }
  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block;
    font-family: var(--font-display);
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--text-dim);
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .form-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s;
  }
  .form-input:focus { border-color: var(--cyan); }
  .form-input::placeholder { color: rgba(255,255,255,0.2); }

  /* Role select */
  .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }
  .role-card {
    padding: 28px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 12px;
    border: 1px solid var(--glass-border);
    background: var(--glass);
  }
  .role-card:hover {
    border-color: var(--cyan);
    background: rgba(0,245,255,0.06);
    transform: translateY(-2px);
  }
  .role-icon { font-size: 36px; margin-bottom: 12px; }
  .role-name {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 1px;
  }

  /* Dashboard */
  .dash-layout { display: flex; min-height: 100vh; }
  .sidebar {
    width: 240px;
    background: var(--blue-mid);
    border-right: 1px solid var(--glass-border);
    padding: 24px 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
  }
  .sidebar-logo { padding: 0 24px 24px; border-bottom: 1px solid var(--glass-border); margin-bottom: 24px; }
  .sidebar-nav { list-style: none; flex: 1; }
  .sidebar-nav li a, .sidebar-nav li button {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    color: var(--text-dim);
    text-decoration: none;
    font-size: 13px;
    font-family: var(--font-display);
    letter-spacing: 0.5px;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    transition: all 0.2s;
  }
  .sidebar-nav li a:hover, .sidebar-nav li button:hover { color: var(--cyan); background: rgba(0,245,255,0.04); }
  .sidebar-nav li.active a, .sidebar-nav li.active button { color: var(--cyan); background: rgba(0,245,255,0.08); border-right: 2px solid var(--cyan); }

  .dash-main { flex: 1; background: var(--blue-dark); overflow-y: auto; }
  .dash-header {
    padding: 24px 32px;
    border-bottom: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dash-content { padding: 32px; }

  /* Patient list */
  .patient-list { display: flex; flex-direction: column; gap: 12px; }
  .patient-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-radius: 10px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    cursor: pointer;
    transition: all 0.2s;
  }
  .patient-row:hover { border-color: var(--cyan); background: rgba(0,245,255,0.04); }
  .patient-info { display: flex; align-items: center; gap: 12px; }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .status-online { background: #00ff88; box-shadow: 0 0 6px #00ff88; }
  .status-offline { background: #ff4455; }

  /* Metrics row */
  .metrics-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .metric-card {
    padding: 20px 24px;
    border-radius: 12px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
  }
  .metric-val {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
  }
  .metric-lbl { font-size: 12px; color: var(--text-dim); margin-top: 4px; }

  /* Angle bar */
  .angle-bar { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
  .angle-row { display: flex; align-items: center; gap: 12px; }
  .angle-name { font-size: 13px; color: var(--text-dim); width: 100px; flex-shrink: 0; }
  .angle-track { flex: 1; height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
  .angle-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
  .angle-val { font-family: var(--font-display); font-size: 12px; width: 40px; text-align: right; }

  /* Graph placeholder */
  .graph-wrap {
    border-radius: 12px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    padding: 20px;
    margin-top: 16px;
  }
  .graph-title { font-family: var(--font-display); font-size: 11px; letter-spacing: 2px; color: var(--cyan); margin-bottom: 16px; }
  .graph-svg { width: 100%; height: 120px; }

  /* Contact page */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 48px; }
  @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
  .contact-info { display: flex; flex-direction: column; gap: 20px; }
  .contact-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    border-radius: 12px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
  }
  .contact-icon { font-size: 24px; }
  .contact-label { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--text-dim); }
  .contact-val { font-size: 15px; color: var(--text); }

  .faq-item {
    border-bottom: 1px solid var(--glass-border);
    overflow: hidden;
  }
  .faq-q {
    width: 100%;
    background: none;
    border: none;
    color: var(--text);
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 500;
    padding: 20px 0;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    letter-spacing: 0.5px;
  }
  .faq-q:hover { color: var(--cyan); }
  .faq-a { font-size: 14px; color: var(--text-dim); padding-bottom: 20px; line-height: 1.7; }

  /* Shop */
  .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 48px; }
  .plan-card {
    padding: 40px 32px;
    border-radius: 16px;
    position: relative;
    border: 1px solid var(--glass-border);
    background: var(--glass);
  }
  .plan-card.featured {
    border-color: var(--cyan);
    background: rgba(0,245,255,0.04);
  }
  .plan-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--cyan);
    color: var(--blue-dark);
    font-family: var(--font-display);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    padding: 4px 16px;
    border-radius: 20px;
    white-space: nowrap;
    text-transform: uppercase;
  }
  .plan-name { font-family: var(--font-display); font-size: 14px; letter-spacing: 2px; color: var(--text-dim); margin-bottom: 8px; text-transform: uppercase; }
  .plan-price { font-family: var(--font-display); font-size: 48px; font-weight: 900; color: var(--text); margin-bottom: 4px; }
  .plan-period { font-size: 13px; color: var(--text-dim); margin-bottom: 28px; }
  .plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
  .plan-features li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-dim); }
  .plan-features li::before { content: '✓'; color: var(--cyan); font-weight: 700; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .modal-box {
    width: 520px;
    max-width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 40px;
    border-radius: 16px;
    background: var(--blue-mid);
    border: 1px solid var(--glass-border);
    position: relative;
  }
  .modal-box::before {
    content: '';
    position: absolute;
    top: -1px; left: 40px; right: 40px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  }
  .modal-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
  .modal-sub { font-size: 13px; color: var(--text-dim); margin-bottom: 28px; }
  .modal-close {
    position: absolute; top: 16px; right: 16px;
    background: none; border: none; color: var(--text-dim);
    font-size: 20px; cursor: pointer; transition: color 0.2s;
  }
  .modal-close:hover { color: var(--cyan); }

  /* Success popup */
  .success-box { text-align: center; padding: 20px 0; }
  .success-icon { font-size: 56px; margin-bottom: 20px; }
  .success-title { font-family: var(--font-display); font-size: 18px; color: var(--cyan); margin-bottom: 12px; }
  .success-msg { font-size: 14px; color: var(--text-dim); line-height: 1.7; }

  /* Loading screen */
  .loading-screen {
    position: fixed; inset: 0;
    background: var(--blue-dark);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    transition: opacity 0.6s, visibility 0.6s;
  }
  .loading-screen.fade { opacity: 0; visibility: hidden; }
  .loader-ring {
    width: 80px; height: 80px;
    border-radius: 50%;
    border: 2px solid rgba(0,245,255,0.1);
    border-top-color: var(--cyan);
    animation: spin 1s linear infinite;
  }
  .loader-text { font-family: var(--font-display); font-size: 12px; letter-spacing: 4px; color: var(--cyan); text-transform: uppercase; }

  /* Pulse line anim for chart */
  @keyframes draw { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
  .chart-line { stroke-dasharray: 1000; animation: draw 2s ease forwards; }

  /* Fade in */
  .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s, transform 0.6s; }
  .fade-in.visible { opacity: 1; transform: none; }

  select.form-input option { background: var(--blue-mid); }
`;

// ─── Logo Component ───────────────────────────────────────────────
function Logo({ size = 22 }) {
  return (
    <span style={{ fontFamily: "var(--font-display)", fontSize: size, fontWeight: 900, letterSpacing: 2 }}>
      <span style={{ color: "var(--text)" }}>Postur</span>
      <span style={{ color: "var(--cyan)", textShadow: "0 0 16px rgba(0,245,255,0.8)" }}>IA</span>
    </span>
  );
}

// ─── Mini chart SVG ───────────────────────────────────────────────
function MiniChart({ color = "var(--cyan)", data = [] }) {
  const pts = Array.isArray(data) ? data.map(Number).filter(Number.isFinite) : [];
  if (pts.length === 0) return <div className="graph-svg" aria-label="Sem medições disponíveis" />;
  const max = Math.max(...pts), min = Math.min(...pts);
  const range = max - min || 1;
  const w = 100, h = 50;
  const points = pts.map((v, i) => {
    const x = pts.length === 1 ? w / 2 : (i / (pts.length - 1)) * w;
    const y = h - ((v - min) / range) * h * 0.8 - h * 0.1;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="graph-svg" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" className="chart-line" />
    </svg>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────
function NavBar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { label: "Início", target: "home", page: "home" },
    { label: "Solução", target: "solution", page: "home" },
    { label: "Tecnologia", target: "tech", page: "home" },
    { label: "Contato", target: null, page: "contact" },
    { label: "Planos", target: null, page: "shop" },
  ];
  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Logo />
        </button>
        <ul className={`nav-links${open ? " open" : ""}`}>
          {links.map(l => (
            <li key={l.label}>
              <a href={l.target ? `#${l.target}` : `/${l.page}`} onClick={e => {
                e.preventDefault();
                setOpen(false);
                if (l.target) {
                  setPage("home");
                  setTimeout(() => document.getElementById(l.target)?.scrollIntoView({ behavior: "smooth" }), 0);
                } else {
                  setPage(l.page);
                }
              }}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <button className="btn-cyan" style={{ padding: "8px 20px", fontSize: "10px" }}
              onClick={() => { setPage("login"); setOpen(false); }}>
              <span>Área Clínica</span>
            </button>
          </li>
        </ul>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const [faqOpen, setFaqOpen] = useState(null);

  const problems = [
    { icon: "🦴", title: "Escoliose", text: "Alterações da coluna exigem avaliação individual por profissional de saúde; esta página não faz diagnóstico." },
    { icon: "🪑", title: "Má Postura em Escritório", text: "Longos períodos na mesma posição podem gerar desconforto. Pausas e orientação ergonômica variam para cada pessoa." },
    { icon: "📚", title: "Ergonomia no Estudo", text: "A ergonomia no estudo depende de fatores individuais e do ambiente; procure orientação profissional quando houver desconforto." },
    { icon: "💢", title: "Hipercifose", text: "Alterações na curvatura torácica devem ser avaliadas por profissional; não podem ser identificadas por esta página." },
    { icon: "⚡", title: "Hérnia de Disco", text: "Sintomas relacionados aos discos vertebrais requerem avaliação clínica; o PosturIA não diagnostica condições médicas." },
    { icon: "😰", title: "Dores Lombares Crônicas", text: "Dores lombares podem afetar a rotina. Procure um profissional de saúde para avaliação e orientação individual." },
  ];

  const techs = [
    { icon: "⚙️", name: "Laravel" }, { icon: "⚛️", name: "React" },
    { icon: "↗", name: "Inertia" }, { icon: "🗄️", name: "MySQL" },
    { icon: "⚡", name: "Vite" }, { icon: "🔐", name: "Sessão + CSRF" },
  ];

  const faqs = [
    { q: "Como funciona o PosturIA?", a: "O PosturIA é um projeto em desenvolvimento. O conceito prevê um colete e uma plataforma web; funcionamento e disponibilidade dependem de integração e validação." },
    { q: "O sistema substitui uma avaliação de saúde?", a: "Não. O projeto ainda não está disponível para uso clínico; se e quando disponibilizado, não substituirá avaliação, diagnóstico ou orientação profissional." },
    { q: "Quais são as especificações do colete?", a: "Autonomia, frequência de leitura e compatibilidade serão informadas para cada versão após validação técnica do produto." },
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero grid-bg" id="home">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, width: "100%" }}>
          <div className="hero-content">
            <div className="label">Projeto em desenvolvimento</div>
            <h1 className="hero-title">
              Tecnologia para<br />
              <span className="glow">Acompanhamento</span><br />
              Postural
            </h1>
            <p className="hero-sub">
              Projeto de tecnologia vestível em desenvolvimento. O protótipo prevê sensores e feedback háptico; funcionamento e disponibilidade dependem de validação do hardware e da integração.
            </p>
            <div className="hero-btns">
              <button className="btn-cyan" onClick={() => setPage("shop")}>
                <span>Ver referências de pacote</span>
              </button>
              <button className="btn-outline" onClick={() => setPage("login")}>
                Área Profissional
              </button>
            </div>
            <div className="stats-row">
              {[
                { n: "Sensores IMU", l: "Previstos no conceito" },
                { n: "Feedback háptico", l: "Em validação" },
                { n: "Painel web", l: "Sem telemetria do colete" },
              ].map(s => (
                <div key={s.l} className="stat-chip glass">
                  <div className="stat-num">{s.n}</div>
                  <div className="stat-lbl">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vest Visual */}
          <div className="vest-visual">
            {[340, 300, 260, 220].map((sz, i) => (
              <div key={sz} className="vest-ring" style={{
                width: sz, height: sz,
                top: (340 - sz) / 2,
                left: (420 - sz) / 2,
                animationDelay: `${i * 0.4}s`,
              }} />
            ))}
            <div className="vest-img-wrap">
              <div className="vest-placeholder">
              <img src="/assets/Prototipo.png" alt="Protótipo" className="vest-icon-img" />
                <span className="vest-label">POSTUR·IA VEST</span>
              </div>
            </div>
            {/* Data nodes */}
            <div className="data-node" style={{ top: 40, right: 0, animationDelay: "0s" }}>
              Sensores previstos
            </div>
            <div className="data-node" style={{ bottom: 80, left: -10, animationDelay: "1s" }}>
              Feedback em validação
            </div>
            <div className="data-node" style={{ bottom: 20, right: 10, animationDelay: "0.5s" }}>
              Painel demonstrativo
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section" id="problem">
        <div className="container">
          <div className="label">Identificação do Problema</div>
          <h2 className="title">Por que a postura importa<br /><span className="glow">mais do que você pensa?</span></h2>
          <p style={{ color: "var(--text-dim)", maxWidth: 560 }}>
            Ergonomia e postura são temas individuais. O PosturIA não diagnostica condições nem substitui avaliação ou orientação profissional.
          </p>
          <div className="problem-grid">
            {problems.map(p => (
              <div key={p.title} className="glass problem-card">
                <span className="problem-icon">{p.icon}</span>
                <div className="problem-title">{p.title}</div>
                <p className="problem-text">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section grid-bg" id="solution">
        <div className="container">
          <div className="label">Conceito do projeto</div>
          <h2 className="title">Como a solução foi <span className="glow">pensada</span></h2>
          <div className="steps">
            {[
              { n: "01", title: "Conceito de uso do colete", text: "O colete é posicionado conforme as instruções da versão do produto; a colocação e o uso devem ser validados antes da venda." },
              { n: "02", title: "Sensores em avaliação", text: "O conceito prevê sensores IMU; leitura real, especificações e limites dependem da integração e validação do hardware." },
              { n: "03", title: "Feedback previsto — em validação", text: "O feedback háptico é uma hipótese do conceito; funcionamento, regras, alertas e eficácia ainda não foram validados." },
              { n: "04", title: "Painel profissional — sem telemetria ao vivo", text: "O painel web organiza informações para profissionais; o recebimento de medições depende de integração e validação do colete." },
            ].map(s => (
              <div key={s.n} className="glass step-card">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-text">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH */}
      <section className="section" id="tech">
        <div className="container">
          <div className="label">Plataforma web</div>
          <h2 className="title">Tecnologias atualmente<br /><span className="glow">no repositório</span></h2>
          <div className="tech-grid">
            {techs.map(t => (
              <div key={t.name} className="tech-chip">
                <div className="tech-chip-icon">{t.icon}</div>
                <div className="tech-chip-name">{t.name}</div>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--text-dim)", maxWidth: 620, marginTop: 24 }}>Firmware, sensores, conectividade e integração com o colete não estão implementados nesta versão web e serão publicados após validação.</p>
        </div>
      </section>

      {/* DEMONSTRAÇÃO */}
      <section className="section grid-bg">
        <div className="container">
          <div className="label">Plataforma profissional</div>
          <h2 className="title">Sem dados clínicos ou <span className="glow">telemetria ativa</span></h2>
          <div className="glass" style={{ padding: 28, marginTop: 32, color: "var(--text-dim)" }}>
            As medições e os gráficos serão exibidos após a conexão validada do colete. Esta página não apresenta dados de pacientes nem resultados clínicos de demonstração.
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="section grid-bg">
        <div className="container" style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
          <div className="label" style={{ justifyContent: "center" }}>Nossa Ambição</div>
          <h2 className="title">Democratizar a saúde postural<br /><span className="glow">para todos os brasileiros</span></h2>
          <p style={{ color: "var(--text-dim)", fontSize: 16, marginBottom: 48 }}>
            A PosturIA é um projeto em desenvolvimento de tecnologia vestível e ferramentas digitais. O protótipo ainda não está disponível para uso clínico ou compra.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {[
              { icon: "🌍", title: "Acessibilidade" },
              { icon: "🤝", title: "Integração Clínica" },
              { icon: "🔬", title: "Pesquisa e validação" },
              { icon: "🚀", title: "Inovação Contínua" },
            ].map(m => (
              <div key={m.title} className="glass" style={{ padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{m.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "var(--cyan)", letterSpacing: 1 }}>{m.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="label">Perguntas Frequentes</div>
          <h2 className="title" style={{ marginBottom: 40 }}>Dúvidas? <span className="glow">Respondemos.</span></h2>
          <div style={{ maxWidth: 700 }}>
            {faqs.map((f, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  {f.q}
                  <span style={{ color: "var(--cyan)", fontSize: 18, transition: "transform 0.3s", display: "inline-block", transform: faqOpen === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {faqOpen === i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <Logo size={26} />
              <p style={{ color: "var(--text-dim)", fontSize: 14, marginTop: 16, maxWidth: 280, lineHeight: 1.7 }}>
                Projeto em desenvolvimento. Colete, integração de sensores e recursos de IA não estão disponíveis nesta versão.
              </p>
              <div style={{ marginTop: 20, fontSize: 13, color: "var(--text-dim)" }}>
                📧 posturiacontacts@gmail.com<br />
                📞 (31) 98671-1880<br />
                📱 @postur.ia
              </div>
            </div>
            <div>
              <div className="footer-title">Navegação</div>
              <ul className="footer-links">
                {[
                  { label: "Início", target: "home", page: "home" },
                  { label: "Solução", target: "solution", page: "home" },
                  { label: "Tecnologia", target: "tech", page: "home" },
                  { label: "Planos", target: null, page: "shop" },
                  { label: "Contato", target: null, page: "contact" },
                ].map(item => (
                  <li key={item.label}><a href={item.target ? `#${item.target}` : `/${item.page}`} onClick={event => {
                    event.preventDefault();
                    if (item.target) {
                      setPage("home");
                      setTimeout(() => document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" }), 0);
                    } else {
                      setPage(item.page);
                    }
                  }}>{item.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-title">Fundadores</div>
              <ul className="footer-links">
                {["Samuel Prates", "Eduardo Henrique", "Arthur Camargo", "Samuel Soares", "Naldo Braz"].map(f => (
                  <li key={f}><span>{f}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-title">Legal</div>
              <ul className="footer-links">
                {["Política de Privacidade", "Termos de Uso", "Informações regulatórias"].map(l => (
                  <li key={l}><span title="Conteúdo pendente de validação e publicação">{l} — em preparação</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer-copy">
            <p>© {new Date().getFullYear()} PosturIA — Todos os direitos reservados</p>
            <p>Desenvolvido para SENAI / WorldSkills Brasil</p>
          </div>
        </div>
      </footer>
    </>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────
function LoginPage() {
  const { data, setData, post, processing, errors } = useForm({ email: "", password: "" });

  const submit = (event) => {
    event.preventDefault();
    post("/login", { onSuccess: () => router.visit("/admin") });
  };

  return (
    <div className="login-wrap grid-bg">
      <form className="glass login-card" onSubmit={submit}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Logo size={26} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text-dim)", marginTop: 12, letterSpacing: 2, fontWeight: 400 }}>
            ÁREA PROFISSIONAL
          </h2>
        </div>
        {errors.email && <div role="alert" style={{ color: "#ff6677", marginBottom: 16 }}>{errors.email}</div>}
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">E-mail</label>
          <input id="login-email" className="form-input" type="email" autoComplete="username" required value={data.email} onChange={e => setData("email", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Senha</label>
          <input id="login-password" className="form-input" type="password" autoComplete="current-password" required value={data.password} onChange={e => setData("password", e.target.value)} />
        </div>
        <button className="btn-cyan" type="submit" style={{ width: "100%", marginTop: 8, justifyContent: "center" }} disabled={processing}>
          <span>{processing ? "Acessando..." : "Acessar Sistema"}</span>
        </button>
      </form>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────
function ContactPage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const faqs = [
    { q: "Qual o prazo de entrega e o frete?", a: "As condições de entrega e frete serão informadas antes da abertura das vendas. Nenhum pedido online está sendo registrado neste momento." },
    { q: "Quais são as condições de garantia?", a: "As condições de garantia e suporte ainda precisam ser confirmadas e publicadas antes da venda." },
    { q: "O PosturIA substitui atendimento médico?", a: "Não. A plataforma é uma ferramenta de apoio e não substitui consulta, diagnóstico ou tratamento por profissional de saúde." },
  ];
  const contacts = [
    { icon: "📧", label: "E-mail", val: "posturiacontacts@gmail.com", href: "mailto:posturiacontacts@gmail.com" },
    { icon: "📞", label: "Telefone", val: "(31) 98671-1880", href: "tel:+5531986711880" },
    { icon: "📱", label: "Instagram", val: "@postur.ia", href: "https://instagram.com/postur.ia" },
  ];

  return (
    <>
      <div style={{ height: 80 }} />
      <section className="section" id="contact">
        <div className="container">
          <div className="label">Contato e Suporte</div>
          <h2 className="title">Fale com a <span className="glow">PosturIA</span></h2>
          <div className="contact-grid">
            <div className="contact-info">
              {contacts.map(c => (
                <a key={c.label} className="contact-item" href={c.href} target={c.label === "Instagram" ? "_blank" : undefined} rel={c.label === "Instagram" ? "noreferrer" : undefined}>
                  <div className="contact-icon">{c.icon}</div>
                  <div><div className="contact-label">{c.label}</div><div className="contact-val">{c.val}</div></div>
                </a>
              ))}
            </div>
            <div className="glass" style={{ padding: 32 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--text)", marginBottom: 16, letterSpacing: 1 }}>FALE COM A EQUIPE</div>
              <p style={{ color: "var(--text-dim)", marginBottom: 24 }}>Este site ainda não envia nem armazena mensagens. Para contato, abra seu aplicativo de e-mail pelo botão abaixo.</p>
              <a className="btn-cyan" style={{ width: "100%", justifyContent: "center" }} href="mailto:posturiacontacts@gmail.com?subject=Contato%20PosturIA"><span>Enviar e-mail</span></a>
            </div>
          </div>

          <div style={{ marginTop: 80 }}>
            <div className="label">FAQ</div>
            <h3 className="title" style={{ fontSize: 28 }}>Perguntas <span className="glow">frequentes</span></h3>
            <div style={{ maxWidth: 700, marginTop: 32 }}>
              {faqs.map((f, i) => (
                <div key={i} className="faq-item">
                  <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>{f.q}<span style={{ color: "var(--cyan)", fontSize: 18 }}>{faqOpen === i ? "−" : "+"}</span></button>
                  {faqOpen === i && <div className="faq-a">{f.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── SHOP PAGE ────────────────────────────────────────────────────
function ShopPage() {
  const [modal, setModal] = useState(null);
  const plans = {
    essential: { name: "Plano Essencial", price: "R$ 600,00" },
    premium: { name: "Plano Avançado (planejado)", price: "R$ 800,00" },
  };

  return (
    <>
      <div style={{ height: 80 }} />
      <section className="section" id="shop">
        <div className="container">
          <div className="label">Pacotes em planejamento</div>
          <h2 className="title">Referências do <span className="glow">PosturIA</span></h2>
          <p style={{ color: "var(--text-dim)", maxWidth: 620 }}>Valores de referência de planejamento. Não há compra, pedido, frete ou pagamento disponível nesta página.</p>
          <p className="plan-status" style={{ color: "var(--text-dim)", maxWidth: 720, marginBottom: 24 }}>Protótipo em desenvolvimento — não disponível para compra. Os valores e pacotes abaixo são referências de planejamento, não uma oferta comercial.</p>
          <div className="plans-grid">
            <div className="plan-card">
              <div className="plan-name">{plans.essential.name}</div>
              <div className="plan-price">{plans.essential.price}</div>
              <div className="plan-period">preço de referência — não disponível</div>
              <ul className="plan-features">
                <li>Colete: protótipo; disponibilidade não confirmada</li>
                <li>Painel web: demonstração sem telemetria do colete</li>
                <li>Feedback háptico: em validação</li>
                <li>Área profissional para acompanhamento</li>
              </ul>
              <button className="btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => setModal("essential")}>Consultar sobre o projeto</button>
            </div>
            <div className="plan-card featured">
              <div className="plan-name">{plans.premium.name}</div>
              <div className="plan-price">{plans.premium.price}</div>
              <div className="plan-period">preço de referência — não disponível</div>
              <ul className="plan-features">
                <li>Recursos avançados ainda em definição</li>
                <li>IA, WhatsApp e análises automatizadas não estão disponíveis</li>
                <li>Não fazem parte de uma oferta comercial atual</li>
              </ul>
              <button className="btn-cyan" style={{ width: "100%", justifyContent: "center" }} onClick={() => setModal("premium")}><span>Consultar sobre o projeto</span></button>
            </div>
          </div>
          <div style={{ marginTop: 40, color: "var(--text-dim)", fontSize: 13 }}>
            Frete, prazo, garantia, condições de pagamento e termos de venda ainda não foram definidos; não aceite pagamento por esta página.
          </div>
        </div>
      </section>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)} aria-label="Fechar">✕</button>
            <div className="modal-title">{plans[modal].name} — {plans[modal].price}</div>
            <p className="modal-sub">O checkout ainda não está configurado. Nenhum pedido, pagamento ou dado pessoal foi registrado.</p>
            <a className="btn-cyan" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} href="mailto:posturiacontacts@gmail.com?subject=Disponibilidade%20PosturIA"><span>Consultar por e-mail</span></a>
          </div>
        </div>
      )}
    </>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────
function PosturIA() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("home");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const renderPage = () => {
    if (page === "login") return <LoginPage />;
    if (page === "contact") return <ContactPage />;
    if (page === "shop") return <ShopPage />;
    return <HomePage setPage={setPage} />;
  };

  const isLogin = page === "login";

  return (
    <>
      <style>{globalStyles}</style>

      {/* Loading Screen */}
      <div className={`loading-screen${!loading ? " fade" : ""}`}>
        <Logo size={32} />
        <div className="loader-ring" />
        <div className="loader-text">Iniciando Sistema</div>
      </div>

      {/* Nav (not on login) */}
      {!isLogin && <NavBar page={page} setPage={setPage} />}

      {/* Page */}
      <div style={{ minHeight: "100vh" }}>
        {renderPage()}
      </div>
    </>
  );
}
export default PosturIA;
