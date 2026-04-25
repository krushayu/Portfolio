import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import projectsData from "./projects.json";
import "./projectDetail.css";

const ProjectDetail = () => {
  const { domain, id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const allProjects = projectsData.domains.flatMap((d) =>
    d.projects.map((p) => ({ ...p, domain: d.name, domainColor: d.color, domainIcon: d.icon }))
  );

  const proj = allProjects.find(
    (p) => p.domain.toLowerCase().replace(/\s/g, "-") === domain && String(p.id) === String(id)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    handleResize();
    window.addEventListener("resize", handleResize);
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 1 + 0.5, speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15, opacity: Math.random() * 0.05 + 0.02,
    }));
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0; if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0; if (p.y < 0) p.y = canvas.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`; ctx.fill();
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", handleResize); if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, []);

  if (!proj) return <div style={{ color: "#fff", padding: "4rem", textAlign: "center" }}>Project not found. <Link to="/work" style={{ color: "#fff" }}>Go back</Link></div>;

  return (
    <div className="pd-page">
      <canvas ref={canvasRef} className="background-canvas" />
      <div className="pd-wrapper">

        {/* Header */}
        <header className="pd-header">
          <Link to="/" className="logo-link">
            <span className="logo-text">Ayush</span>
            <div className="logo-line" />
          </Link>
          <nav className="navigation">
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/about" className="nav-item">About</Link>
            <Link to="/work" className="nav-item active">Work</Link>
            <Link to="/contact" className="nav-item">Contact</Link>
          </nav>
        </header>

        {/* Back */}
        <button className="pd-back" onClick={() => navigate("/work")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Work
        </button>

        {/* Hero */}
        <div className="pd-hero" style={{ "--domain-color": proj.domainColor }}>
          <div className="pd-hero-glow" />
          <div className="pd-meta">
            <span className="pd-domain" style={{ color: proj.domainColor }}>{proj.domainIcon} {proj.domain}</span>
            <span className="pd-date">{proj.month} {proj.year}</span>
            <span className="pd-status">{proj.status}</span>
          </div>
          <h1 className="pd-title">{proj.title}</h1>
          <p className="pd-tagline">{proj.description}</p>
          <div className="pd-actions">
            {proj.liveLink && proj.liveLink !== "#" && (
              <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="pd-btn primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Live Demo
              </a>
            )}
            {proj.githubLink && proj.githubLink !== "#" && (
              <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="pd-btn secondary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pd-content">

          {/* About */}
          <div className="pd-card">
            <h2 className="pd-card-title">
              <span className="pd-card-icon">📋</span> About the Project
            </h2>
            <p className="pd-card-text">{proj.description}</p>
          </div>

          {/* Features */}
          <div className="pd-card">
            <h2 className="pd-card-title">
              <span className="pd-card-icon">✨</span> Key Features
            </h2>
            <ul className="pd-features">
              {proj.features.map((f, i) => (
                <li key={i}>
                  <span className="pd-feature-dot" style={{ background: proj.domainColor }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="pd-card">
            <h2 className="pd-card-title">
              <span className="pd-card-icon">🛠️</span> Tech Stack
            </h2>
            <div className="pd-tech">
              {proj.technologies.map((t, i) => (
                <span key={i} className="pd-tech-tag" style={{ "--domain-color": proj.domainColor }}>{t}</span>
              ))}
            </div>
          </div>
   
        </div>

        {/* Need Source Code */}
        <div className="pd-contact-note">
          <span>Need Source Code?</span>
          <Link to="/contact" className="pd-contact-link">Contact Me &rarr;</Link>
        </div>

        <footer className="pd-footer">
          <div className="signature">&copy; 2026 Aayushya Shrivastava</div>
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <span className="separator">/</span>
            <Link to="/about" className="footer-link">About</Link>
            <span className="separator">/</span>
            <Link to="/work" className="footer-link">Work</Link>
            <span className="separator">/</span>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProjectDetail;
