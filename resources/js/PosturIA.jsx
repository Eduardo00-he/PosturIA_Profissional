import { useState, useEffect, useRef } from "react";

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
  const pts = data.length ? data : [30, 45, 35, 60, 40, 55, 38, 65, 42, 58];
  const max = Math.max(...pts), min = Math.min(...pts);
  const w = 100, h = 50;
  const points = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h * 0.8 - h * 0.1;
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
    { label: "Início", id: "home" },
    { label: "Solução", id: "solution" },
    { label: "Tecnologia", id: "tech" },
    { label: "Contato", id: "contact" },
    { label: "Planos", id: "shop" },
  ];
  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Logo />
        </button>
        <ul className={`nav-links${open ? " open" : ""}`}>
          {links.map(l => (
            <li key={l.id}>
              <a href="#" onClick={e => { e.preventDefault(); setPage(l.id); setOpen(false); }}>
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
    { icon: "🦴", title: "Escoliose", text: "Curvatura anormal da coluna que afeta postura e qualidade de vida, especialmente em jovens durante o crescimento." },
    { icon: "🪑", title: "Má Postura em Escritório", text: "Horas em frente ao computador causam tensão cervical, dores lombares e síndrome do ombro cruzado." },
    { icon: "📚", title: "Problemas em Estudantes", text: "Mochila pesada e longas horas de estudo criam padrões posturais inadequados desde a adolescência." },
    { icon: "💢", title: "Hipercifose", text: "Curvatura excessiva da coluna torácica, causando a clássica 'corcunda', dores musculares e fadiga." },
    { icon: "⚡", title: "Hérnia de Disco", text: "Pressão inadequada sobre os discos intervertebrais leva a compressão nervosa e dor irradiante." },
    { icon: "😰", title: "Dores Lombares Crônicas", text: "A principal causa de afastamento do trabalho no Brasil. Afeta 80% das pessoas em algum momento da vida." },
  ];

  const techs = [
    { icon: "🔌", name: "ESP32" }, { icon: "📡", name: "IoT" },
    { icon: "🧠", name: "Machine Learning" }, { icon: "📊", name: "Dashboard" },
    { icon: "📶", name: "Bluetooth" }, { icon: "🌐", name: "Wi-Fi" },
    { icon: "⚙️", name: "MPU6050" }, { icon: "🔋", name: "Li-ion" },
    { icon: "🤖", name: "IA" }, { icon: "📱", name: "MQTT" },
  ];

  const faqs = [
    { q: "Como funciona o monitoramento em tempo real?", a: "Os sensores IMU do colete capturam dados a cada 100ms, processados pelo ESP32 e enviados via MQTT para o dashboard clínico. O médico visualiza a angulação da coluna ao vivo." },
    { q: "O colete é confortável para uso prolongado?", a: "Sim. O design ergonômico utiliza tecido respirável e os componentes eletrônicos são distribuídos para não interferir nos movimentos naturais do usuário." },
    { q: "Médicos e fisioterapeutas podem acompanhar remotamente?", a: "Absolutamente. O dashboard web permite acesso de qualquer dispositivo com internet, com alertas em tempo real quando o paciente apresenta postura inadequada." },
    { q: "Qual a duração da bateria?", a: "A bateria Li-ion integrada oferece até 12 horas de monitoramento contínuo, com carregamento via USB-C em aproximadamente 2 horas." },
  ];

  // Generate real-time-looking chart data
  const [chartData, setChartData] = useState([30, 45, 35, 60, 40, 55, 38, 65, 42, 58]);
  useEffect(() => {
    const iv = setInterval(() => {
      setChartData(prev => [...prev.slice(1), Math.floor(30 + Math.random() * 40)]);
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero grid-bg" id="home">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, width: "100%" }}>
          <div className="hero-content">
            <div className="label">Saúde 4.0 — Inovação Médica</div>
            <h1 className="hero-title">
              O Futuro da<br />
              <span className="glow">Reabilitação</span><br />
              Postural
            </h1>
            <p className="hero-sub">
              Colete inteligente com IA que monitora, corrige e previne problemas posturais em tempo real. Conectando pacientes e profissionais de saúde.
            </p>
            <div className="hero-btns">
              <button className="btn-cyan" onClick={() => setPage("shop")}>
                <span>Adquirir Colete</span>
              </button>
              <button className="btn-outline" onClick={() => setPage("login")}>
                Área Profissional
              </button>
            </div>
            <div className="stats-row">
              {[
                { n: "10M+", l: "Brasileiros com dores na coluna" },
                { n: "94%", l: "Precisão da IA" },
                { n: "Real-time", l: "Monitoramento" },
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
              Cervical: 12°
            </div>
            <div className="data-node" style={{ bottom: 80, left: -10, animationDelay: "1s" }}>
              Lombar: 28°
            </div>
            <div className="data-node" style={{ bottom: 20, right: 10, animationDelay: "0.5s" }}>
              IA Active ●
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
            Sem monitoramento contínuo, posturas inadequadas se repetem fora do ambiente clínico — aumentando lesões, custos e sofrimento.
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
          <div className="label">A Solução PosturIA</div>
          <h2 className="title">Como o sistema <span className="glow">funciona</span></h2>
          <div className="steps">
            {[
              { n: "01", title: "Usuário veste o colete", text: "O colete PosturIA é colocado sobre a roupa. Os sensores IMU se posicionam nos pontos-chave da coluna." },
              { n: "02", title: "Sensores detectam postura", text: "MPU6050/9250 capturam aceleração e giroscópio a 100Hz. A IA classifica a postura em tempo real." },
              { n: "03", title: "Feedback háptico imediato", text: "Motores vibratórios alertam o usuário sutilmente quando detectam postura inadequada, criando memória muscular." },
              { n: "04", title: "Dashboard clínico ao vivo", text: "Médicos e fisioterapeutas acompanham angulação, histórico e relatórios pelo painel web remoto." },
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
          <div className="label">Stack Tecnológico</div>
          <h2 className="title">Tecnologias que fazem<br /><span className="glow">a diferença</span></h2>
          <div className="tech-grid">
            {techs.map(t => (
              <div key={t.name} className="tech-chip">
                <div className="tech-chip-icon">{t.icon}</div>
                <div className="tech-chip-name">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REALTIME DEMO */}
      <section className="section grid-bg">
        <div className="container">
          <div className="label">Demonstração ao Vivo</div>
          <h2 className="title">Monitoramento em <span className="glow">tempo real</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginTop: 48 }}>
            <div className="glass" style={{ padding: 28 }}>
              <div className="graph-title">ANGULAÇÃO CERVICAL — AO VIVO</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, color: "var(--cyan)" }}>
                  {chartData[chartData.length - 1]}°
                </span>
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Angulação atual</span>
              </div>
              <MiniChart data={chartData} />
            </div>
            <div className="glass" style={{ padding: 28 }}>
              <div className="graph-title">STATUS DO COLETE</div>
              <div className="angle-bar">
                {[
                  { name: "Cervical", val: chartData[chartData.length - 1], max: 90, color: chartData[chartData.length - 1] > 45 ? "#ff4455" : "var(--cyan)" },
                  { name: "Dorsal", val: 34, max: 90, color: "var(--cyan)" },
                  { name: "Lombar", val: 58, max: 90, color: "#ffaa00" },
                ].map(a => (
                  <div key={a.name} className="angle-row">
                    <span className="angle-name">{a.name}</span>
                    <div className="angle-track">
                      <div className="angle-fill" style={{ width: `${(a.val / a.max) * 100}%`, background: a.color }} />
                    </div>
                    <span className="angle-val" style={{ color: a.color }}>{a.val}°</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass" style={{ padding: 28 }}>
              <div className="graph-title">INDICADORES POSTURAIS</div>
              {[
                { label: "Postura Correta", val: "73%", ok: true },
                { label: "Alertas hoje", val: "12", ok: true },
                { label: "Postura Incorreta", val: "27%", ok: false },
                { label: "Tempo com colete", val: "4h32m", ok: true },
              ].map(i => (
                <div key={i.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{i.label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: i.ok ? "var(--cyan)" : "#ff6677" }}>{i.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="label">Especialistas</div>
          <h2 className="title">O que os profissionais<br /><span className="glow">dizem</span></h2>
          <div className="testimonials-grid">
            <div className="glass testimonial-card">
              <p className="testimonial-text">
                "O PosturIA representa um avanço significativo na ortopedia preventiva. A capacidade de monitoramento contínuo e feedback imediato resolve um problema crítico: o paciente corrige a postura apenas durante a consulta. Com este dispositivo, a correção ocorre 24 horas por dia, acelerando a reabilitação e prevenindo progressão de lesões como hérnias e escoliose."
              </p>
              <div className="testimonial-author">
                <div className="avatar">DR</div>
                <div>
                  <div className="author-name">Dr. Rodrigo Almeida</div>
                  <div className="author-role">Ortopedista — CRM 58432</div>
                </div>
              </div>
            </div>
            <div className="glass testimonial-card">
              <p className="testimonial-text">
                "Na fisioterapia, o maior desafio é garantir que o paciente mantenha os exercícios e a postura correta entre as sessões. O PosturIA transforma isso: posso acompanhar remotamente o comportamento postural em tempo real, ajustar o protocolo de tratamento com dados reais e engajar o paciente de forma ativa em sua própria reabilitação. Tecnologia transformadora."
              </p>
              <div className="testimonial-author">
                <div className="avatar">MC</div>
                <div>
                  <div className="author-name">Dra. Marina Carvalho</div>
                  <div className="author-role">Fisioterapeuta — CREFITO 24891</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="section grid-bg">
        <div className="container" style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
          <div className="label" style={{ justifyContent: "center" }}>Nossa Ambição</div>
          <h2 className="title">Democratizar a saúde postural<br /><span className="glow">para todos os brasileiros</span></h2>
          <p style={{ color: "var(--text-dim)", fontSize: 16, marginBottom: 48 }}>
            A PosturIA acredita que tecnologia de ponta deve ser acessível. Nossa missão é integrar IA à fisioterapia, prevenir doenças musculoesqueléticas e conectar pacientes a profissionais de saúde de forma inteligente e eficiente.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {[
              { icon: "🌍", title: "Acessibilidade" },
              { icon: "🤝", title: "Integração Clínica" },
              { icon: "🧬", title: "IA à Serviço da Saúde" },
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
                Colete inteligente para reabilitação postural com IA. Saúde 4.0 ao alcance de todos.
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
                {["Início", "Solução", "Tecnologia", "Planos", "Contato"].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-title">Fundadores</div>
              <ul className="footer-links">
                {["Samuel Prates", "Eduardo Henrique", "Arthur Camargo", "Samuel Soares", "Naldo Braz"].map(f => (
                  <li key={f}><a href="#" style={{ cursor: "default" }}>{f}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-title">Legal</div>
              <ul className="footer-links">
                {["Política de Privacidade", "Termos de Uso", "LGPD", "Certificações"].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer-copy">
            <p>© 2025 PosturIA — Todos os direitos reservados</p>
            <p>Desenvolvido para SENAI / WorldSkills Brasil</p>
          </div>
        </div>
      </footer>
    </>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [step, setStep] = useState("login"); // login | role

  const handleLogin = () => {
    if (user === "Eduardo0" && pass === "Posturia0.") {
      setStep("role");
    } else {
      setErr("Credenciais inválidas. Tente: Eduardo0 / Posturia0.");
    }
  };

  if (step === "role") {
    return (
      <div className="login-wrap grid-bg">
        <div style={{ textAlign: "center" }}>
          <Logo size={28} />
          <h2 style={{ fontFamily: "var(--font-display)", marginTop: 32, marginBottom: 8, color: "var(--text)" }}>
            Bem-vindo, Eduardo
          </h2>
          <p style={{ color: "var(--text-dim)", marginBottom: 40 }}>Como deseja acessar o sistema?</p>
          <div className="role-grid" style={{ maxWidth: 400, margin: "0 auto" }}>
            <div className="role-card" onClick={() => onLogin("medico")}>
              <div className="role-icon">👨‍⚕️</div>
              <div className="role-name">Médico</div>
            </div>
            <div className="role-card" onClick={() => onLogin("clinica")}>
              <div className="role-icon">🏥</div>
              <div className="role-name">Clínica</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrap grid-bg">
      <div className="glass login-card">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Logo size={26} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text-dim)", marginTop: 12, letterSpacing: 2, fontWeight: 400 }}>
            ÁREA PROFISSIONAL
          </h2>
        </div>
        {err && (
          <div style={{ background: "rgba(255,68,85,0.08)", border: "1px solid rgba(255,68,85,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#ff6677" }}>
            {err}
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Login</label>
          <input className="form-input" value={user} onChange={e => { setUser(e.target.value); setErr(""); }} placeholder="Digite seu login" />
        </div>
        <div className="form-group">
          <label className="form-label">Senha</label>
          <input className="form-input" type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} placeholder="••••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <button className="btn-cyan" style={{ width: "100%", marginTop: 8, justifyContent: "center" }} onClick={handleLogin}>
          <span>Acessar Sistema</span>
        </button>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--text-dim)" }}>
          Credencial: Eduardo0 / Posturia0.
        </p>
      </div>
    </div>
  );
}

// ─── DOCTOR DASHBOARD ─────────────────────────────────────────────
const PATIENTS = [
  { name: "Lucas Almeida", age: 34, condition: "Lombalgia Crônica", online: true, vestOn: "08:15", vestOff: null, cervical: 18, dorsal: 32, lombar: 62 },
  { name: "Pedro Martins", age: 28, condition: "Escoliose Leve", online: true, vestOn: "09:02", vestOff: null, cervical: 24, dorsal: 45, lombar: 38 },
  { name: "Rafael Costa", age: 45, condition: "Hérnia de Disco L4-L5", online: false, vestOn: "07:30", vestOff: "11:20", cervical: 12, dorsal: 28, lombar: 75 },
  { name: "Ana Souza", age: 22, condition: "Hipercifose Postural", online: true, vestOn: "10:15", vestOff: null, cervical: 35, dorsal: 58, lombar: 22 },
  { name: "Júlia Lima", age: 31, condition: "Cervicalgia Tensional", online: false, vestOn: "06:45", vestOff: "09:30", cervical: 42, dorsal: 20, lombar: 18 },
];

function DoctorDash({ onLogout }) {
  const [selected, setSelected] = useState(null);
  const [activeNav, setActiveNav] = useState("pacientes");
  const [chartData, setChartData] = useState([30, 45, 35, 60, 40, 55, 38]);
  const [modalPaciente, setModalPaciente] = useState(false);
  // Trocado de email para patologia aqui:
  const [formPaciente, setFormPaciente] = useState({ nome: "", patologia: "", medico_id: null });
  const [pacientes, setPacientes] = useState(PATIENTS);
  const [msgPaciente, setMsgPaciente] = useState("");

  const salvarPaciente = async () => {
    try {
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || "" },
        body: JSON.stringify(formPaciente),
      });
      if (res.ok) {
        setMsgPaciente("Paciente cadastrado com sucesso!");
        setFormPaciente({ nome: "", patologia: "", medico_id: 1 }); // Limpa o formulário corrigido
        setTimeout(() => { setModalPaciente(false); setMsgPaciente(""); }, 1500);
      } else {
        const err = await res.json();
        setMsgPaciente("Erro: " + (err.message || JSON.stringify(err.errors)));
      }
    } catch {
      setMsgPaciente("Erro de conexão.");
    }
  };

  useEffect(() => {
    const iv = setInterval(() => {
      setChartData(prev => [...prev.slice(1), Math.floor(20 + Math.random() * 60)]);
    }, 1800);
    return () => clearInterval(iv);
  }, []);

  const p = selected !== null ? PATIENTS[selected] : null;

  return (
    <div className="dash-layout">
      {/* Sidebar */}
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

      {/* Main */}
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>
              {p ? p.name : "Painel Médico"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Dr. Henrique Silva — Ortopedista</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--font-display)", letterSpacing: 1 }}>
              {new Date().toLocaleTimeString("pt-BR")}
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px #00ff88" }} />
          </div>
        </div>

        <div className="dash-content">
          {!p ? (
            <>
              {/* Metrics */}
              <div className="metrics-row">
                <div className="metric-card">
                  <div className="metric-val" style={{ color: "var(--cyan)" }}>5</div>
                  <div className="metric-lbl">Pacientes</div>
                </div>
                <div className="metric-card">
                  <div className="metric-val" style={{ color: "#00ff88" }}>3</div>
                  <div className="metric-lbl">Coletes online</div>
                </div>
                <div className="metric-card">
                  <div className="metric-val" style={{ color: "#ffaa00" }}>12</div>
                  <div className="metric-lbl">Alertas hoje</div>
                </div>
                <div className="metric-card">
                  <div className="metric-val" style={{ color: "var(--cyan)" }}>78%</div>
                  <div className="metric-lbl">Postura correta (média)</div>
                </div>
              </div>
              
              {/* Header da lista com o botão alinhado */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase" }}>
                  Lista de Pacientes
                </div>
                <button className="btn-cyan" style={{ padding: "8px 16px", fontSize: "10px" }} onClick={() => setModalPaciente(true)}>
                  <span>+ Adicionar Paciente</span>
                </button>
              </div>

              {/* Patient list */}
              <div className="patient-list">
                {PATIENTS.map((pt, i) => (
                  <div key={i} className="patient-row" onClick={() => setSelected(i)}>
                    <div className="patient-info">
                      <div className={`status-dot ${pt.online ? "status-online" : "status-offline"}`} />
                      <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                        {pt.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{pt.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{pt.condition}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: pt.online ? "#00ff88" : "var(--text-dim)" }}>
                        {pt.online ? "● Online" : "Offline"}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                        Colete: {pt.vestOn} {pt.vestOff ? `– ${pt.vestOff}` : "– em uso"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Patient Detail */
            <>
              <button className="btn-outline" style={{ marginBottom: 24, padding: "8px 16px", fontSize: "10px" }} onClick={() => setSelected(null)}>
                ← Voltar
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                <div className="metric-card">
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Paciente</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text)" }}>{p.name}</div>
                </div>
                <div className="metric-card">
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Diagnóstico</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "var(--cyan)" }}>{p.condition}</div>
                </div>
                <div className="metric-card">
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Status do Colete</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: p.online ? "#00ff88" : "#ff6677" }}>
                    {p.online ? "● Online" : "Offline"}
                  </div>
                </div>
                <div className="metric-card">
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Horário</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text)" }}>
                    {p.vestOn} {p.vestOff ? `– ${p.vestOff}` : "– em uso"}
                  </div>
                </div>
              </div>

              {/* Angles */}
              <div className="glass graph-wrap" style={{ marginBottom: 20 }}>
                <div className="graph-title">ANGULAÇÃO DA COLUNA — TEMPO REAL</div>
                <div className="angle-bar">
                  {[
                    { name: "Cervical", val: p.cervical, max: 90 },
                    { name: "Dorsal", val: p.dorsal, max: 90 },
                    { name: "Lombar", val: p.lombar, max: 90 },
                  ].map(a => {
                    const pct = (a.val / a.max) * 100;
                    const color = pct > 60 ? "#ff4455" : pct > 40 ? "#ffaa00" : "var(--cyan)";
                    return (
                      <div key={a.name} className="angle-row">
                        <span className="angle-name">{a.name}</span>
                        <div className="angle-track">
                          <div className="angle-fill" style={{ width: `${pct}%`, background: color }} />
                        </div>
                        <span className="angle-val" style={{ color }}>{a.val}°</span>
                        <span style={{ fontSize: 12, color: color === "var(--cyan)" ? "#00ff88" : color, marginLeft: 8 }}>
                          {pct > 60 ? "⚠" : "✓"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart */}
              <div className="glass graph-wrap">
                <div className="graph-title">HISTÓRICO DE VARIAÇÃO POSTURAL — ÚLTIMA HORA</div>
                <MiniChart data={chartData} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal de cadastro atualizado para Patologia */}
      {modalPaciente && (
        <div className="modal-overlay" onClick={() => setModalPaciente(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalPaciente(false)}>✕</button>
            <div className="modal-title">Adicionar Paciente</div>
            <div className="modal-sub">Preencha os dados do novo paciente</div>
            
            {/* Array mudou aqui para gerar input de patologia */}
            {[{ key: "nome", label: "Nome Completo" }, { key: "patologia", label: "Patologia" }].map(f => (
              <div key={f.key} className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" placeholder={f.label}
                  value={formPaciente[f.key]}
                  onChange={e => setFormPaciente(prev => ({ ...prev, [f.key]: e.target.value }))} />
              </div>
            ))}

            {msgPaciente && (
              <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13,
                background: msgPaciente.startsWith("Erro") ? "rgba(255,68,85,0.1)" : "rgba(0,255,136,0.1)",
                border: `1px solid ${msgPaciente.startsWith("Erro") ? "rgba(255,68,85,0.3)" : "rgba(0,255,136,0.3)"}`,
                color: msgPaciente.startsWith("Erro") ? "#ff6677" : "#00ff88" }}>
                {msgPaciente}
              </div>
            )}
            <button className="btn-cyan" style={{ width: "100%", justifyContent: "center" }} onClick={salvarPaciente}>
              <span>Salvar Paciente</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CLINIC DASHBOARD ─────────────────────────────────────────────
const DOCTORS = [
  { name: "Dr. Henrique Silva", crm: "CRM 58432", specialty: "Ortopedia", patients: [0, 1, 2] },
  { name: "Dra. Mariana Costa", crm: "CRM 71204", specialty: "Fisioterapia", patients: [2, 3] },
  { name: "Dr. Rafael Souza", crm: "CRM 39876", specialty: "Neurologia", patients: [4, 0] },
];

function ClinicDash({ onLogout }) {
  const [selDoc, setSelDoc] = useState(null);

  const d = selDoc !== null ? DOCTORS[selDoc] : null;

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><Logo size={18} /></div>
        <ul className="sidebar-nav">
          {[
            { label: "Visão Geral", icon: "🏥" },
            { label: "Médicos", icon: "👨‍⚕️" },
            { label: "Pacientes", icon: "👥" },
            { label: "Métricas", icon: "📊" },
          ].map(n => (
            <li key={n.label}>
              <button><span>{n.icon}</span> {n.label}</button>
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
              {d ? d.name : "Painel da Clínica"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Centro de Reabilitação PosturIA</div>
          </div>
        </div>

        <div className="dash-content">
          {!d ? (
            <>
              <div className="metrics-row">
                <div className="metric-card">
                  <div className="metric-val" style={{ color: "var(--cyan)" }}>3</div>
                  <div className="metric-lbl">Médicos ativos</div>
                </div>
                <div className="metric-card">
                  <div className="metric-val" style={{ color: "#00ff88" }}>5</div>
                  <div className="metric-lbl">Pacientes totais</div>
                </div>
                <div className="metric-card">
                  <div className="metric-val" style={{ color: "#00ff88" }}>3</div>
                  <div className="metric-lbl">Coletes online</div>
                </div>
                <div className="metric-card">
                  <div className="metric-val" style={{ color: "var(--cyan)" }}>82%</div>
                  <div className="metric-lbl">Aderência média</div>
                </div>
              </div>

              <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", marginBottom: 16, textTransform: "uppercase" }}>
                Médicos da Clínica
              </div>
              <div className="patient-list">
                {DOCTORS.map((doc, i) => (
                  <div key={i} className="patient-row" onClick={() => setSelDoc(i)}>
                    <div className="patient-info">
                      <div className="avatar">{doc.name.split(" ").slice(0, 2).map(w => w[0]).join("")}</div>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{doc.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{doc.specialty} — {doc.crm}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                      {doc.patients.length} paciente{doc.patients.length > 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
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
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--cyan)" }}>{d.specialty}</div>
                </div>
                <div className="metric-card">
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Registro</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text)" }}>{d.crm}</div>
                </div>
              </div>

              <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", marginBottom: 16, textTransform: "uppercase" }}>
                Pacientes Vinculados
              </div>
              <div className="patient-list">
                {d.patients.map(pi => {
                  const pt = PATIENTS[pi];
                  return (
                    <div key={pi} className="patient-row" style={{ cursor: "default" }}>
                      <div className="patient-info">
                        <div className={`status-dot ${pt.online ? "status-online" : "status-offline"}`} />
                        <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                          {pt.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{pt.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{pt.condition}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, color: pt.online ? "#00ff88" : "var(--text-dim)" }}>
                          {pt.online ? "● Online" : "Offline"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                          Cervical {pt.cervical}° | Lombar {pt.lombar}°
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────
function ContactPage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const faqs = [
    { q: "Qual o prazo de entrega do colete?", a: "O colete PosturIA é enviado em até 5 dias úteis após a confirmação do pagamento, com rastreamento em tempo real." },
    { q: "Posso usar o colete sem o aplicativo?", a: "O colete funciona de forma autônoma com feedback háptico, mas o dashboard requer conexão Wi-Fi para sincronização." },
    { q: "Há garantia no produto?", a: "Sim. O PosturIA acompanha garantia de 12 meses contra defeitos de fabricação e suporte técnico incluso." },
    { q: "O plano Premium inclui acompanhamento médico?", a: "O plano Premium IA+ inclui acesso ao painel clínico para um profissional de saúde de sua escolha." },
  ];

  return (
    <>
      <div style={{ height: 80 }} />
      <section className="section">
        <div className="container">
          <div className="label">Contato e Suporte</div>
          <h2 className="title">Fale com a <span className="glow">PosturIA</span></h2>
          <div className="contact-grid">
            <div>
              <div className="contact-info">
                {[
                  { icon: "📧", label: "E-mail", val: "posturiacontacts@gmail.com" },
                  { icon: "📞", label: "Telefone", val: "(31) 98671-1880" },
                  { icon: "📱", label: "Instagram", val: "@postur.ia" },
                  { icon: "⏰", label: "Atendimento", val: "Seg–Sex: 8h–18h" },
                ].map(c => (
                  <div key={c.label} className="contact-item">
                    <div className="contact-icon">{c.icon}</div>
                    <div>
                      <div className="contact-label">{c.label}</div>
                      <div className="contact-val">{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="glass" style={{ padding: 32 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--text)", marginBottom: 24, letterSpacing: 1 }}>
                  ENVIAR MENSAGEM
                </div>
                {["Nome completo", "E-mail", "Telefone"].map(f => (
                  <div key={f} className="form-group">
                    <label className="form-label">{f}</label>
                    <input className="form-input" placeholder={f} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Mensagem</label>
                  <textarea className="form-input" rows={4} placeholder="Descreva sua dúvida ou necessidade..." style={{ resize: "vertical" }} />
                </div>
                <button className="btn-cyan" style={{ width: "100%", justifyContent: "center" }}>
                  <span>Enviar Mensagem</span>
                </button>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginTop: 80 }}>
            <div className="label">FAQ</div>
            <h3 className="title" style={{ fontSize: 28 }}>Perguntas <span className="glow">frequentes</span></h3>
            <div style={{ maxWidth: 700, marginTop: 32 }}>
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
        </div>
      </section>
    </>
  );
}

// ─── SHOP PAGE ────────────────────────────────────────────────────
function ShopPage() {
  const [modal, setModal] = useState(null); // null | "essential" | "premium"
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", cpf: "", endereco: "", cidade: "", estado: "" });

  const handleBuy = () => {
    setSuccess(true);
  };

  return (
    <>
      <div style={{ height: 80 }} />
      <section className="section">
        <div className="container">
          <div className="label">Planos e Preços</div>
          <h2 className="title">Escolha seu <span className="glow">PosturIA</span></h2>
          <p style={{ color: "var(--text-dim)", maxWidth: 520 }}>
            Invista na sua saúde postural. Tecnologia de ponta com acompanhamento profissional.
          </p>
          <div className="plans-grid">
            {/* Essencial */}
            <div className="plan-card">
              <div className="plan-name">Plano Essencial</div>
              <div className="plan-price">R$699</div>
              <div className="plan-period">pagamento único + frete grátis</div>
              <ul className="plan-features">
                <li>Colete PosturIA completo</li>
                <li>Monitoramento básico em tempo real</li>
                <li>Dashboard simplificado</li>
                <li>Feedback háptico ativo</li>
                <li>Acompanhamento médico básico</li>
                <li>Garantia de 12 meses</li>
              </ul>
              <button className="btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => { setModal("essential"); setSuccess(false); }}>
                Adquirir Agora
              </button>
            </div>

            {/* Premium */}
            <div className="plan-card featured">
              <div className="plan-badge">Mais Popular</div>
              <div className="plan-name">Plano Premium IA+</div>
              <div className="plan-price">R$899</div>
              <div className="plan-period">pagamento único + frete grátis</div>
              <ul className="plan-features">
                <li>Tudo do plano Essencial</li>
                <li>Envio de dados em tempo real</li>
                <li>Relatórios automáticos com IA</li>
                <li>Assistente de IA integrado</li>
                <li>Gráficos e relatórios visuais</li>
                <li>Notificações via WhatsApp</li>
                <li>Análise de comportamento corporal</li>
                <li>Apoio clínico avançado</li>
                <li>Painel do profissional de saúde</li>
              </ul>
              <button className="btn-cyan" style={{ width: "100%", justifyContent: "center" }} onClick={() => { setModal("premium"); setSuccess(false); }}>
                <span>Adquirir Agora</span>
              </button>
            </div>
          </div>

          {/* Differentials */}
          <div style={{ marginTop: 80 }}>
            <div className="label">Diferenciais</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginTop: 32 }}>
              {[
                { icon: "⚡", title: "Feedback Imediato", text: "Correção em milissegundos através dos motores vibratórios integrados." },
                { icon: "📡", title: "Monitoramento Contínuo", text: "Dados capturados 24/7 com sincronização automática." },
                { icon: "🏥", title: "Integração Clínica", text: "Dashboard dedicado para médicos e fisioterapeutas." },
                { icon: "🛡️", title: "Tecnologia Acessível", text: "Preço justo com qualidade profissional de ponta." },
              ].map(d => (
                <div key={d.title} className="glass problem-card">
                  <span className="problem-icon">{d.icon}</span>
                  <div className="problem-title">{d.title}</div>
                  <p className="problem-text">{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            {!success ? (
              <>
                <div className="modal-title">
                  {modal === "essential" ? "Plano Essencial — R$699" : "Plano Premium IA+ — R$899"}
                </div>
                <div className="modal-sub">Preencha seus dados para prosseguir com a compra</div>
                {[
                  { key: "nome", label: "Nome Completo" },
                  { key: "email", label: "E-mail" },
                  { key: "telefone", label: "Telefone" },
                  { key: "cpf", label: "CPF" },
                  { key: "endereco", label: "Endereço" },
                  { key: "cidade", label: "Cidade" },
                  { key: "estado", label: "Estado" },
                ].map(f => (
                  <div key={f.key} className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label">{f.label}</label>
                    <input className="form-input" placeholder={f.label}
                      value={form[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <button className="btn-cyan" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={handleBuy}>
                  <span>Finalizar Pedido</span>
                </button>
              </>
            ) : (
              <div className="success-box">
                <div className="success-icon">🔐</div>
                <div className="success-title">Pedido Registrado!</div>
                <p className="success-msg">
                  Você seria encaminhado para a área de pagamento segura da PosturIA para concluir sua compra com criptografia SSL e total segurança.
                </p>
                <button className="btn-cyan" style={{ marginTop: 28, justifyContent: "center" }} onClick={() => setModal(null)}>
                  <span>Fechar</span>
                </button>
              </div>
            )}
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
  const [role, setRole] = useState(null); // medico | clinica

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = (r) => {
    setRole(r);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setRole(null);
    setPage("home");
  };

  const renderPage = () => {
    if (page === "login") return <LoginPage onLogin={handleLogin} />;
    if (page === "dashboard") {
      if (role === "medico") return <DoctorDash onLogout={handleLogout} />;
      if (role === "clinica") return <ClinicDash onLogout={handleLogout} />;
      return <LoginPage onLogin={handleLogin} />;
    }
    if (page === "contact") return <ContactPage />;
    if (page === "shop") return <ShopPage />;
    return <HomePage setPage={setPage} />;
  };

  const isDash = page === "dashboard";
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

      {/* Nav (not on dashboard) */}
      {!isDash && !isLogin && <NavBar page={page} setPage={setPage} />}

      {/* Page */}
      <div style={{ minHeight: "100vh" }}>
        {renderPage()}
      </div>
    </>
  );
}
export default PosturIA;
