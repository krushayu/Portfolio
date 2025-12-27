import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./work.css";
import projectsData from "./projects.json"; // JSON file import

const Work = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [selectedDomain, setSelectedDomain] = useState("web-dev");
  const [selectedProject, setSelectedProject] = useState(null);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBackground();
    };

    // Initialize geometric background
    const initBackground = () => {
      // Clear existing particles
      particlesRef.current = [];

      // Create grid lines
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          type: "grid",
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.1 + 0.05,
        });
      }

      // Create floating geometric shapes
      for (let i = 0; i < 20; i++) {
        particlesRef.current.push({
          type: "shape",
          shape: ["circle", "triangle", "square"][
            Math.floor(Math.random() * 3)
          ],
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 80 + 20,
          rotation: Math.random() * Math.PI * 2,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.08 + 0.02,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
        });
      }

      // Create subtle particles
      for (let i = 0; i < 100; i++) {
        particlesRef.current.push({
          type: "particle",
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.2 + 0.05,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    // Mouse tracking
    const handleMouseMove = (e) => {
      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // Draw geometric shapes
    const drawShape = (ctx, shape, x, y, size, rotation, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;

      switch (shape) {
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.closePath();
          ctx.stroke();
          break;
        case "square":
          ctx.beginPath();
          ctx.rect(-size / 2, -size / 2, size, size);
          ctx.stroke();
          break;
      }
      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.7)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        if (particle.type === "grid") {
          // Grid lines
          ctx.beginPath();
          ctx.moveTo(particle.x, 0);
          ctx.lineTo(particle.x, canvas.height);
          ctx.strokeStyle = `rgba(255, 255, 255, ${particle.opacity})`;
          ctx.lineWidth = particle.size;
          ctx.stroke();

          particle.x += particle.speed;
          if (particle.x > canvas.width) particle.x = 0;

          ctx.beginPath();
          ctx.moveTo(0, particle.y);
          ctx.lineTo(canvas.width, particle.y);
          ctx.stroke();

          particle.y += particle.speed;
          if (particle.y > canvas.height) particle.y = 0;
        } else if (particle.type === "shape") {
          // Geometric shapes
          drawShape(
            ctx,
            particle.shape,
            particle.x,
            particle.y,
            particle.size,
            particle.rotation,
            particle.opacity
          );

          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.rotation += particle.rotationSpeed;

          // Wrap around screen
          if (particle.x > canvas.width + particle.size)
            particle.x = -particle.size;
          if (particle.x < -particle.size)
            particle.x = canvas.width + particle.size;
          if (particle.y > canvas.height + particle.size)
            particle.y = -particle.size;
          if (particle.y < -particle.size)
            particle.y = canvas.height + particle.size;
        } else if (particle.type === "particle") {
          // Particles with mouse interaction
          const dx = mousePosRef.current.x - particle.x;
          const dy = mousePosRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Gentle push away from mouse
          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.x -= dx * force * 0.02;
            particle.y -= dy * force * 0.02;
          }

          particle.x += particle.speedX;
          particle.y += particle.speedY;

          // Pulsing opacity
          particle.opacity =
            0.05 + Math.sin(Date.now() * particle.pulseSpeed) * 0.1;

          // Wrap around screen
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.y > canvas.height) particle.y = 0;
          if (particle.y < 0) particle.y = canvas.height;

          // Draw particle with subtle glow
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
          ctx.fill();

          // Very subtle glow effect
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.3})`;
          ctx.fill();
        }
      });

      // Draw subtle light gradients
      const lightGradient = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.7,
        0,
        canvas.width * 0.3,
        canvas.height * 0.7,
        400
      );
      lightGradient.addColorStop(0, "rgba(120, 120, 255, 0.03)");
      lightGradient.addColorStop(1, "rgba(120, 120, 255, 0)");
      ctx.fillStyle = lightGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const currentDomain = domains.find(d => d.id === selectedDomain);
  const currentProjects = currentDomain?.projects || [];

  const openProjectModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  // Loading State
  if (loading) {
    return (
      <div className="work-page">
        <canvas ref={canvasRef} className="background-canvas" />
        <div className="content-wrapper">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="work-page">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="background-canvas" />

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Header */}
        <header className="work-header">
          <div className="logo">
            <Link to="/" className="logo-link">
              <span className="logo-text">Ayush</span>
              <div className="logo-line"></div>
            </Link>
          </div>
          <nav className="navigation">
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/about" className="nav-item">About</Link>
            <Link to="/work" className="nav-item active">Work</Link>
            <Link to="/connect" className="nav-item">Contact</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="work-content">
          {/* Domain Navigation */}
          <div className="domain-navigation">
            <div className="domain-tabs">
              {domains.map((domain) => (
                <button
                  key={domain.id}
                  className={`domain-tab ${selectedDomain === domain.id ? 'active' : ''}`}
                  onClick={() => setSelectedDomain(domain.id)}
                  style={{
                    '--domain-color': domain.color,
                    borderColor: selectedDomain === domain.id ? domain.color : 'transparent'
                  }}
                >
                  <span className="domain-icon">{domain.icon}</span>
                  <span className="domain-name">{domain.name}</span>
                  <span className="project-count">{domain.projects.length} projects</span>
                </button>
              ))}
            </div>
          </div>

          {/* Domain Header */}
          <div className="domain-header" style={{ '--domain-color': currentDomain?.color }}>
            <div className="domain-info">
              <div className="domain-icon-large">{currentDomain?.icon}</div>
              <div>
                <h2 className="domain-title">{currentDomain?.name}</h2>
                <p className="domain-description">
                  {selectedDomain === 'web-dev' && 'Building responsive, scalable web applications using modern technologies.'}
                  {selectedDomain === 'data-science' && 'Extracting insights from data using machine learning and statistical analysis.'}
                  {selectedDomain === 'python' && 'Python scripts and applications for automation and data processing.'}
                  {selectedDomain === 'blockchain' && 'Exploring decentralized applications and smart contract development.'}
                </p>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="project-card"
                  onClick={() => openProjectModal(project)}
                  style={{ '--domain-color': currentDomain?.color }}
                >
                  <div className="project-header">
                    <div className="project-meta">
                      <span className="project-date">{project.month} {project.year}</span>
                      <span className="project-status">{project.status}</span>
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                  </div>
                  
                  <div className="project-tech">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="tech-tag more">+{project.technologies.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="project-actions">
                    <button className="view-details-btn">
                      View Details
                      <svg className="btn-icon" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="project-glow"></div>
                </div>
              ))
            ) : (
              <div className="no-projects">
                <p>No projects found for this domain.</p>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="work-stats">
            <div className="stat-card">
              <div className="stat-icon">📁</div>
              <div className="stat-content">
                <div className="stat-number">
                  {domains.reduce((acc, domain) => acc + domain.projects.length, 0)}
                </div>
                <div className="stat-label">Total Projects</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-number">{domains.length}</div>
                <div className="stat-label">Domains</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💻</div>
              <div className="stat-content">
                <div className="stat-number">
                  {[...new Set(domains.flatMap(d => d.projects.flatMap(p => p.technologies)))].length}+
                </div>
                <div className="stat-label">Technologies</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-number">
                  {domains.flatMap(d => d.projects).filter(p => p.status.includes('🏆')).length}
                </div>
                <div className="stat-label">Awards</div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="work-footer">
          <div className="footer-content">
            <div className="signature">&copy; 2025 Aayushya Shrivastava</div>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <span className="separator">/</span>
              <Link to="/about" className="footer-link">About</Link>
              <span className="separator">/</span>
              <Link to="/work" className="footer-link">Work</Link>
              <span className="separator">/</span>
              <Link to="/connect" className="footer-link">Contact</Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={closeProjectModal}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProjectModal}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            
            <div className="modal-header">
              <div className="modal-category">
                <span className="modal-category-badge">{currentDomain?.name}</span>
                <span className="modal-date">{selectedProject.month} {selectedProject.year}</span>
              </div>
              <h2 className="modal-title">{selectedProject.title}</h2>
              <div className="modal-status">
                <span className="modal-status-badge">{selectedProject.status}</span>
              </div>
            </div>
            
            <div className="modal-content">
              <div className="modal-description">
                <h3 className="description-title">Project Overview</h3>
                <p>{selectedProject.description}</p>
                
                <div className="features-section">
                  <h4>Key Features</h4>
                  <ul className="features-list">
                    {selectedProject.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="technologies-section">
                  <h4>Technologies Used</h4>
                  <div className="tech-tags">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="modal-links">
                {selectedProject.liveLink && selectedProject.liveLink !== '#' && (
                  <a 
                    href={selectedProject.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="modal-link live-link"
                  >
                    <svg className="link-icon" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    Live Demo
                  </a>
                )}
                
                {selectedProject.githubLink && (
                  <a 
                    href={selectedProject.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="modal-link github-link"
                  >
                    <svg className="link-icon" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Work;