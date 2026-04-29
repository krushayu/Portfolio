import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import SEO from "../SEO";
import "./work.css";
import projectsData from "./projects.json";

const Work = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Flatten all projects from all domains
  const allProjects = projectsData.domains.flatMap((d) =>
    d.projects.map((p) => ({ ...p, domain: d.name, domainColor: d.color, domainIcon: d.icon }))
  );

  const filtered = allProjects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
    p.domain.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1 + 0.5,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.05 + 0.02,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const openProject = (p) => {
const domainSlug = p.domain.toLowerCase().replace(/[\s/]+/g, "-");
    navigate(`/project/${domainSlug}/${p.id}`);
  };

  return (
    <div className="work-page">
      <SEO
        title="Projects"
        description="All projects by Aayush Shrivastava (krushayu) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â YamGram, HealthHub, Ventify, HelpForYou, Blockchain Medical Storage, AI GD Analyzer, Wild Animal Detection, Image Editor."
        url="/work"
        keywords="krushayu projects, YamGram, HealthHub, Ventify, HelpForYou, Blockchain, AI projects, krushayu portfolio work"
      />
      <canvas ref={canvasRef} className="background-canvas" />
      <div className="content-wrapper">

        {/* Header */}
        <header className="work-header">
          <NavLink to="/" className="logo-link">
            <span className="logo-text">Ayush</span>
            <div className="logo-line" />
          </NavLink>
          <nav className="navigation">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>About</NavLink>
            <NavLink to="/work" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Work</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Contact</NavLink>
          </nav>
        </header>

        {/* Hero */}
        <div className="work-hero">
          <div className="hero-left">
            <h1 className="hero-title">My Work</h1>
            <p className="hero-sub">
              <span className="hero-sub-num">{allProjects.length}</span>
              <span>projects</span>
              <span className="hero-sub-dot" />
              <span className="hero-sub-num">{projectsData.domains.length}</span>
              <span>domains</span>
            </p>
          </div>
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search projects, tech, domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¢</button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="projects-grid">
          {filtered.length > 0 ? filtered.map((project, idx) => (
            <div
              key={`${project.domain}-${project.id}`}
              className="project-card"
              style={{ "--domain-color": project.domainColor, "--delay": `${idx * 60}ms` }}
              onClick={() => openProject(project)}
            >
              <div className="card-glow" />
              <div className="card-top">
                <span className="card-domain-badge" style={{ color: project.domainColor }}>
                  {project.domainIcon} {project.domain}
                </span>
                <span className="card-status">{project.status}</span>
              </div>
              <h3 className="card-title">{project.title}</h3>
              <p className="card-desc">{project.description}</p>
              <div className="card-tech">
                {project.technologies.slice(0, 4).map((t, i) => (
                  <span key={i} className="tech-tag">{t}</span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="tech-tag more">+{project.technologies.length - 4}</span>
                )}
              </div>
              <div className="card-footer">
                <span className="card-date">{project.month} {project.year}</span>
                <span className="card-cta">
                  View Details
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          )) : (
            <div className="no-results">
              <p>No projects found for "<strong>{search}</strong>"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="work-footer">
          <div className="footer-content">
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
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Work;
