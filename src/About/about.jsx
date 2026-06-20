import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import SEO from "../SEO";
import "./about.css";
import profileImg from "../assest/profile.jpg";
import pData from "./portfolioData.json";

const { certifications, achievements } = pData;
const experiences = pData.experiences || [];

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
  "करने से पहले कभी सोचो नहीं, और करने के बाद सोचने का कोई मतलब नहीं...",
];

const About = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [typed, setTyped] = useState("");
  const [downloading, setDownloading] = useState(false);
  const resumeBtnRef = useRef(null);

  useEffect(() => {
    if (downloading && resumeBtnRef.current) {
      const bar = resumeBtnRef.current.querySelector('.resume-btn-progress');
      if (bar) { bar.style.width = '0%'; setTimeout(() => { bar.style.width = '100%'; }, 50); }
    }
  }, [downloading]);
  const [typeDone, setTypeDone] = useState(false);

  useEffect(() => {
    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx++;
      setTyped(LINES[0].slice(0, charIdx));
      if (charIdx >= LINES[0].length) {
        clearInterval(interval);
        setTypeDone(true);
      }
    }, 45);
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
      <SEO
        title="About"
        description="About Aayush Shrivastava (krushayu) – B.Tech CS student at Centurion University. Experience at DIGISAMAKSH & CodeAlpha. Certified by Google, GeeksForGeeks, Infosys. Hackathon winner."
        url="/about"
        keywords="Aayush Shrivastava about, krushayu education, krushayu experience, krushayu certifications, Centurion University developer"
      />
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
                  <span>Muzaffarpur, Bihar, India</span>
                </div>
              </div>
            </div>

            <div className="hero-description">
              <p className="description-primary">
                {" "}
                <span className="highlight-gradient">{typed}{!typeDone && <span className="type-cursor">|</span>}</span>
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
                  {experiences.map((exp, i) => (
                    <div className="experience-card" key={i}>
                      <div className="experience-header">
                        <div>
                          <h4 className="experience-company">{exp.company}</h4>
                          <p className="experience-role">{exp.role}</p>
                          <div className="experience-badges">
                            <span className="exp-type-badge">{exp.type}</span>
                            <span className="exp-emp-badge">{exp.employmentType}</span>
                          </div>
                        </div>
                        <div className="experience-meta">
                          <span className="experience-duration">{exp.duration}</span>
                          <span className="experience-location">{exp.location}</span>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="experience-desc">{exp.description}</p>
                      )}
                      {exp.certificateLink && (
                        <div className="experience-documents">
                          <a href={exp.certificateLink} target="_blank" rel="noopener noreferrer" className="doc-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            Certificate
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
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
                <div className="skills-bento">

                  {/* Big card - Full Stack */}
                  <div className="sb-card sb-card--wide sb-card--glow-blue">
                    <div className="sb-card-tag">01</div>
                    <h4 className="sb-card-title">Full Stack</h4>
                    <div className="sb-pills">
                      {[{n:"React.js",c:"#61DAFB"},{n:"Node.js",c:"#68A063"},{n:"Express.js",c:"#aaa"},{n:"MongoDB",c:"#47A248"},{n:"MERN Stack",c:"#fff"},{n:"REST API",c:"#888"},{n:"Socket.io",c:"#fff"},{n:"JavaScript",c:"#F7DF1E"}].map((s,i)=>(
                        <span key={i} className="sb-pill" style={{"--pc":s.c}}>{s.n}</span>
                      ))}
                    </div>
                  </div>

                  {/* Python & AI */}
                  <div className="sb-card sb-card--glow-purple">
                    <div className="sb-card-tag">02</div>
                    <h4 className="sb-card-title">Python & AI/ML</h4>
                    <div className="sb-pills">
                      {[{n:"Python",c:"#3572A5"},{n:"ML",c:"#FF6B6B"},{n:"OpenCV",c:"#5C3EE8"},{n:"TensorFlow",c:"#FF6F00"},{n:"YOLOv8",c:"#00BFFF"},{n:"NLP",c:"#9B59B6"}].map((s,i)=>(
                        <span key={i} className="sb-pill" style={{"--pc":s.c}}>{s.n}</span>
                      ))}
                    </div>
                  </div>

                  {/* Angular / MEAN */}
                  <div className="sb-card sb-card--glow-red">
                    <div className="sb-card-tag">03</div>
                    <h4 className="sb-card-title">MEAN & Angular</h4>
                    <div className="sb-pills">
                      {[{n:"Angular",c:"#DD0031"},{n:"TypeScript",c:"#3178C6"},{n:"MEAN Stack",c:"#eee"},{n:"RxJS",c:"#B7178C"}].map((s,i)=>(
                        <span key={i} className="sb-pill" style={{"--pc":s.c}}>{s.n}</span>
                      ))}
                    </div>
                  </div>

                  {/* Databases */}
                  <div className="sb-card sb-card--glow-green">
                    <div className="sb-card-tag">04</div>
                    <h4 className="sb-card-title">Databases</h4>
                    <div className="sb-pills">
                      {[{n:"MongoDB",c:"#47A248"},{n:"MySQL",c:"#4479A1"},{n:"SQL",c:"#336791"}].map((s,i)=>(
                        <span key={i} className="sb-pill" style={{"--pc":s.c}}>{s.n}</span>
                      ))}
                    </div>
                  </div>

                  {/* Dev Tools */}
                  <div className="sb-card sb-card--glow-orange">
                    <div className="sb-card-tag">05</div>
                    <h4 className="sb-card-title">Tools & Deploy</h4>
                    <div className="sb-pills">
                      {[{n:"Git",c:"#F05032"},{n:"GitHub",c:"#eee"},{n:"Vercel",c:"#eee"},{n:"Render",c:"#46E3B7"},{n:"Cloudinary",c:"#3448C5"},{n:"VS Code",c:"#007ACC"}].map((s,i)=>(
                        <span key={i} className="sb-pill" style={{"--pc":s.c}}>{s.n}</span>
                      ))}
                    </div>
                  </div>

                  {/* Core Strengths - full width bottom */}
                  <div className="sb-card sb-card--wide sb-card--strengths">
                    <div className="sb-card-tag">06</div>
                    <h4 className="sb-card-title">Core Strengths</h4>
                    <div className="sb-strengths-row">
                      {["Full-Stack Dev","API Integration","UI/UX Design","Problem Solving","Clean Code","Scalable Architecture"].map((s,i)=>(
                        <div key={i} className="sb-strength-item">
                          <span className="sb-strength-num">0{i+1}</span>
                          <span className="sb-strength-text">{s}</span>
                        </div>
                      ))}
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
              {/* <p className="resume-subtitle">Get a detailed overview of my experience and skills</p> */}
            </div>
            <a
              href="/Resume_Aayush.pdf"
              download="Resume_Aayush.pdf"
              className={`resume-btn ${downloading ? "downloading" : ""}`}
              ref={resumeBtnRef}
              onClick={() => {
                setDownloading(true);
                setTimeout(() => setDownloading(false), 3000);
              }}
            >
              <span className="resume-btn-text">
                {downloading ? "Downloading..." : "Download Resume"}
              </span>
              <span className="resume-btn-icon">
                {downloading ? (
                  <svg className="resume-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3"/>
                    <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/>
                  </svg>
                )}
              </span>
              <span className="resume-btn-progress" />
            </a>
          </div>
        </div>
<div>This is the older one.. Resume with new updates are added soon..</div>
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