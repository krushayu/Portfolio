import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./work.css";
import projectsData from "./projects.json";

const Work = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [selectedDomain, setSelectedDomain] = useState("web-dev");
  const [selectedProject, setSelectedProject] = useState(null);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    try {
      setDomains(projectsData.domains);
      setLoading(false);
    } catch (error) {
      console.error("Error loading projects data:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = [];
      const count = Math.min(40, Math.floor((canvas.width * canvas.height) / 30000));
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1 + 0.5,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          opacity: Math.random() * 0.05 + 0.02,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
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

    handleResize();
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleDomainChange = (id) => {
    if (id === selectedDomain) return;
    setAnimating(true);
    setTimeout(() => {
      setSelectedDomain(id);
      setAnimating(false);
    }, 220);
  };

  const currentDomain = domains.find((d) => d.id === selectedDomain);
  const currentProjects = currentDomain?.projects || [];

  const domainDescriptions = {
    "web-dev": "Responsive & scalable web applications",
    "ai-ml": "AI-powered tools & intelligent systems",
    "data-science": "Insights from data using ML & statistics",
    python: "Python scripts & automation tools",
    blockchain: "Decentralized apps & smart contracts",
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = "auto";
  };

  const totalProjects = domains.reduce((acc, d) => acc + d.projects.length, 0);
  const totalTech = [...new Set(domains.flatMap((d) => d.projects.flatMap((p) => p.technologies)))].length;
  const totalAwards = domains.flatMap((d) => d.projects).filter((p) => p.status.includes("🏆")).length;

  if (loading) {
    return (
      <div className="work-page">
        <canvas ref={canvasRef} className="background-canvas" />
        <div className="content-wrapper">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="work-page">
      <canvas ref={canvasRef} className="background-canvas" />

      <div className="content-wrapper">
        {/* Header */}
        <header className="work-header">
          <Link to="/" className="logo-link">
            <span className="logo-text">Ayush</span>
            <div className="logo-line" />
          </Link>
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
            {/* <p className="hero-eyebrow">— Portfolio</p> */}
            <h1 className="hero-title">My work</h1>
            {/* <p className="hero-sub">Things I've built, explored & shipped.</p> */}
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{totalProjects}</span>
              <span className="hero-stat-label">Projects</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">{domains.length}</span>
              <span className="hero-stat-label">Domains</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">{totalTech}+</span>
              <span className="hero-stat-label">Technologies</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">{totalAwards}</span>
              <span className="hero-stat-label">Awards</span>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="work-layout">
          {/* Sidebar */}
          <aside className="domain-sidebar">
            <p className="sidebar-label">Filter by domain</p>
            {domains.map((domain) => (
              <button
                key={domain.id}
                className={`domain-tab ${selectedDomain === domain.id ? "active" : ""}`}
                onClick={() => handleDomainChange(domain.id)}
                style={{ "--domain-color": domain.color }}
              >
                <span className="domain-tab-icon">{domain.icon}</span>
                <div className="domain-tab-info">
                  <span className="domain-tab-name">{domain.name}</span>
                  <span className="domain-tab-count">
                    {domain.projects.length} project{domain.projects.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {selectedDomain === domain.id && <span className="domain-tab-arrow">›</span>}
              </button>
            ))}

            <div className="sidebar-stats">
              <div className="sidebar-stat-row">
                <span className="sidebar-stat-label">Total Projects</span>
                <span className="sidebar-stat-value">{totalProjects}</span>
              </div>
              <div className="sidebar-stat-row">
                <span className="sidebar-stat-label">Technologies</span>
                <span className="sidebar-stat-value">{totalTech}+</span>
              </div>
              <div className="sidebar-stat-row">
                <span className="sidebar-stat-label">🏆 Awards</span>
                <span className="sidebar-stat-value">{totalAwards}</span>
              </div>
            </div>
          </aside>

          {/* Projects Area */}
          <div className="projects-area">
            {/* Domain Banner */}
            <div className="domain-banner" style={{ "--domain-color": currentDomain?.color }}>
              <div className="domain-banner-left">
                <span className="domain-banner-icon">{currentDomain?.icon}</span>
                <div>
                  <h2 className="domain-banner-title">{currentDomain?.name}</h2>
                  <p className="domain-banner-desc">{domainDescriptions[selectedDomain]}</p>
                </div>
              </div>
              <div className="domain-banner-count">
                <span>{currentProjects.length}</span>
                <small>projects</small>
              </div>
            </div>

            {/* Grid */}
            <div className={`projects-grid ${animating ? "grid-exit" : "grid-enter"}`}>
              {currentProjects.length > 0 ? (
                currentProjects.map((project, idx) => (
                  <div
                    key={project.id}
                    className="project-card"
                    onClick={() => openProjectModal(project)}
                    style={{ "--domain-color": currentDomain?.color, "--delay": `${idx * 60}ms` }}
                  >
                    <div className="card-glow" />
                    <div className="card-number">0{idx + 1}</div>
                    <div className="project-meta">
                      <span className="project-date">{project.month} {project.year}</span>
                      <span className="project-status">{project.status}</span>
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tech">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="tech-tag more">+{project.technologies.length - 4}</span>
                      )}
                    </div>
                    <div className="project-footer">
                      <span className="view-details-btn">
                        View details
                        <svg className="btn-icon" viewBox="0 0 24 24">
                          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-projects"><p>No projects in this domain yet.</p></div>
              )}
            </div>
          </div>
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

      {/* Modal */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={closeProjectModal}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-accent-bar" style={{ background: `linear-gradient(90deg, ${currentDomain?.color}, transparent)` }} />
            <button className="modal-close" onClick={closeProjectModal}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>

            <div className="modal-header">
              <div className="modal-meta">
                <span className="modal-domain-badge" style={{ "--domain-color": currentDomain?.color }}>
                  {currentDomain?.icon} {currentDomain?.name}
                </span>
                <span className="modal-date">{selectedProject.month} {selectedProject.year}</span>
                <span className="modal-status-badge">{selectedProject.status}</span>
              </div>
              <h2 className="modal-title">{selectedProject.title}</h2>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <p className="modal-desc">{selectedProject.description}</p>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-label">Key Features</h4>
                <ul className="features-list">
                  {selectedProject.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-label">Technologies</h4>
                <div className="tech-tags">
                  {selectedProject.technologies.map((t, i) => (
                    <span key={i} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedProject.liveLink && selectedProject.liveLink !== "#" && (
                <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="modal-link live-link">
                  <svg className="link-icon" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                  Live Demo
                </a>
              )}
              {selectedProject.githubLink && selectedProject.githubLink !== "#" && (
                <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="modal-link github-link">
                  <svg className="link-icon" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Work;
