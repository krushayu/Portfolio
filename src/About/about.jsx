import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./about.css";
import profileImg from "../assest/profile.jpg";
import pData from "./portfolioData.json";

const { certifications, achievements } = pData;

const AchievementItem = ({ ach }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`ach-item ${open ? 'open' : ''}`}>
      <button className="ach-header" onClick={() => setOpen(!open)}>
        <div className="ach-header-left">
          {ach.badge && ach.badge.startsWith('http')
            ? <img src={ach.badge} alt="badge" className="ach-badge-icon" />
            : null}
          <span className="ach-title">{ach.title}</span>
        </div>
        <span className="ach-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="ach-body">
          <p className="ach-desc">
            <a href={ach.projectLink} target="_blank" rel="noopener noreferrer" className="ach-project-link">{ach.projectName} – </a>
            {ach.description}
          </p>
          {ach.tags && ach.tags.length > 0 && (
            <div className="ach-tags">
              {ach.tags.map((tag, j) => <span className="tag" key={j}>{tag}</span>)}
            </div>
          )}
          <a href={ach.eventLink} target="_blank" rel="noopener noreferrer" className="ach-event-link">
            View Event ↗
          </a>
        </div>
      )}
    </div>
  );
};


const LINES = [
  "Code. Create. Break. Learn. Repeat.",
];

const About = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let charIdx = 0;
    let pausing = false;
    let pauseCount = 0;
    const interval = setInterval(() => {
      if (pausing) {
        pauseCount++;
        if (pauseCount >= 13) { pausing = false; pauseCount = 0; charIdx = 0; }
        return;
      }
      charIdx++;
      setTyped(LINES[0].slice(0, charIdx));
      if (charIdx >= LINES[0].length) pausing = true;
    }, 60);
    return () => clearInterval(interval);
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
      const particleCount = Math.min(
        60,
        Math.floor((canvas.width * canvas.height) / 20000)
      );

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.08 + 0.02,
          originalX: Math.random() * canvas.width,
          originalY: Math.random() * canvas.height,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#0a0a0a");
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.005;

      // Update and draw particles with gentle wave motion
      particlesRef.current.forEach((particle) => {
        // Add subtle wave motion
        const waveX = Math.sin(time + particle.originalY * 0.01) * 0.3;
        const waveY = Math.cos(time + particle.originalX * 0.01) * 0.3;

        particle.x += particle.speedX + waveX;
        particle.y += particle.speedY + waveY;

        // Wrap around with smooth transition
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Radial gradient for glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * 1.5})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 1.2})`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="about-page">
      <canvas ref={canvasRef} className="background-canvas" />

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Header */}
        <header className="portfolio-header">
          <div className="logo">
            <NavLink to="/" className="logo-link">
              <span className="logo-text">Ayush</span>
              <div className="logo-line"></div>
            </NavLink>
          </div>
          <nav className="navigation">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>About</NavLink>
            <NavLink to="/work" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Work</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Contact</NavLink>
          </nav>
        </header>

        <main className="about-content">
          {/* Hero Section */}
          <div className="hero-section">
            {/* <div className="hero-badge">
              <span className="badge-dot"></span>
              <span className="badge-text">Software Developer</span>
            </div> */}
            
            <div className="hero-main">
              <div className="hero-image-wrapper">
                <div className="hero-image-container">
                  <div className="image-glow-ring"></div>
                  <div className="hero-image-frame">
                    <img src={profileImg} alt="Aayushya Shrivastava" className="hero-image" width="200" height="200" decoding="async" />
                  </div>
                </div>
              </div>
              
              <div className="hero-info">
                <h1 className="hero-name">
                  Aayush <span className="name-accent">Shrivastava</span>
                </h1>
                <div className="hero-tagline">
                  <span className="tagline-quote">"</span>
                  knowledge creates fear..
                  <span className="tagline-quote">"</span>
                </div>
                <div className="hero-location">
                  <svg className="location-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span>Paralakhemundi, Odisha, India</span>
                </div>
              </div>
            </div>

            <div className="hero-description">
              <p className="description-primary">
                I believe in one simple cycle:{" "}
                <span className="highlight-gradient">{typed}<span className="type-cursor">{typed.length < LINES[0].length ? "|" : ""}</span></span>
              </p>
              <p className="description-secondary">
                Currently pursuing B.Tech in Computer Science &amp; Engineering
                with a passion for software development, logical problem-solving
                and building scalable digital solutions. I enjoy transforming
                ideas into practical, cleanly implemented products.
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Left Column */}
            <div className="grid-column">
              {/* Education */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon-wrapper">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 3L1 9l11 6 11-6-11-6z" />
                      <path d="M5 13v5l7 3 7-3v-5" />
                    </svg>
                  </div>
                  <h3 className="section-title">Education</h3>
                </div>

                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h4 className="timeline-title">Centurion University of Technology and Management</h4>
                        <span className="timeline-date">2023 – 2027</span>
                      </div>
                      <p className="timeline-subtitle">Bachelor of Technology - Computer Science</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h4 className="timeline-title">Ram Dayalu Singh College</h4>
                        <span className="timeline-date">2023</span>
                      </div>
                      <p className="timeline-subtitle">Intermediate In Science</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h4 className="timeline-title">G.N. High School</h4>
                        <span className="timeline-date">2021</span>
                      </div>
                      <p className="timeline-subtitle">Matriculation</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon-wrapper">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <h3 className="section-title">Experience</h3>
                </div>

                <div className="experience-list">
                  <div className="experience-card">
                    <div className="experience-header">
                      <div>
                        <h4 className="experience-company">DIGISAMAKSH</h4>
                        <p className="experience-role">Web Developer</p>
                      </div>
                      <span className="experience-duration">June 2025 – Aug 2025</span>
                    </div>
                    <div className="experience-documents">
                      <a
                        href="https://digisamaksh-my.sharepoint.com/:i:/p/hr/IQDe8UasDwAxSoxC1pfeeznUASpYO2dVt5Ticr2CVY0v22g?e=WDT9Gd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="doc-link"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                        Certificate
                      </a>
                    </div>
                  </div>

                  <div className="experience-card">
                    <div className="experience-header">
                      <div>
                        <h4 className="experience-company">CodeAlpha</h4>
                        <p className="experience-role">Frontend Developer</p>
                      </div>
                      <span className="experience-duration">May 2025 – June 2025</span>
                    </div>
                    <div className="experience-documents">
                      <a
                        href="https://media.licdn.com/dms/image/v2/D4D22AQEWmwpkmdd2Rg/feedshare-shrink_800/B4DZcq0HfvGUAg-/0/1748770001914?e=1777507200&v=beta&t=pFgReYce6Oi0G5pPsVSOmSboVl1EUDI4I7s7sApJ3YQ"
                        className="doc-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                        Certificate
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="grid-column">
              {/* Skills */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon-wrapper">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h3 className="section-title">Skills & Technologies</h3>
                </div>

                <div className="skills-container">
                  <div className="skill-group">
                    <h4 className="skill-group-title">Primary Stack</h4>
                    <div className="skill-chips">
                      <span className="skill-chip">MERN Stack</span>
                      <span className="skill-chip">Node.js</span>
                      <span className="skill-chip">React.js</span>
                      <span className="skill-chip">MongoDB</span>
                      <span className="skill-chip">Express.js</span>
                      <span className="skill-chip">Cloudinary</span>
                    </div>
                  </div>

                  <div className="skill-group">
                    <h4 className="skill-group-title">Core Strengths</h4>
                    <div className="skill-chips">
                      <span className="skill-chip">Full-Stack Dev</span>
                      <span className="skill-chip">API Integration</span>
                      <span className="skill-chip">UI/UX Design</span>
                      <span className="skill-chip">Problem Solving</span>
                      <span className="skill-chip">Clean Code</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications & Achievements */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon-wrapper">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3 className="section-title">Certification & Achievements</h3>
                </div>

                <div className="achievements-list">

                  <div className="cert-section">
                    <p className="cert-section-label">Certifications</p>
                    <div className="cert-chips-scroll">
                      {certifications.map((cert, i) => (
                        <a key={i} href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-chip">
                          <span className="cert-chip-dot" />
                          <span className="cert-chip-title">{cert.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="ach-section">
                    <p className="cert-section-label">Achievements</p>
                    {achievements.map((ach, i) => (
                      <AchievementItem key={i} ach={ach} />
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Resume Section */}
        <div className="resume-section">
          <div className="resume-card">
            <div className="resume-icon-wrapper">
              <svg className="resume-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="resume-text">
              <h3 className="resume-title">Download My Resume</h3>
              <p className="resume-subtitle">Get a detailed overview of my experience and skills</p>
            </div>
            <a 
              href="/Resume_Aayush.pdf" 
              download="Resume_Aayush.pdf"
              className="resume-btn"
            >
              <span>Download Resume</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
              </svg>
            </a>
          </div>
        </div>

        <footer className="about-footer">
          <div className="footer-content">
            <div className="signature">© 2026 Aayushya Shrivastava</div>
            <div className="footer-nav">
              <Link to="/" className="footer-link">Home</Link>
              <span className="footer-separator">/</span>
              <Link to="/about" className="footer-link">About</Link>
              <span className="footer-separator">/</span>
              <Link to="/work" className="footer-link">Work</Link>
              <span className="footer-separator">/</span>
              <Link to="/connect" className="footer-link">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;
