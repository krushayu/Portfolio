import { useEffect, useRef } from "react";
import "./home.css";
import profileImg from "../assest/profile.jpg";
import { NavLink } from "react-router-dom";
const Home = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBackground();
    };

    const initBackground = () => {
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

  const socialLinks = {
  github: "https://github.com/krushayu",
  linkedin: "https://www.linkedin.com/in/krushayu/",
  telegram: "https://t.me/krushayu",
  medium: "https://krushayu.medium.com/",
};

  return (
    <div className="portfolio-home">
      {/* Background Canvas */}
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

        {/* Hero Section */}
        <main className="hero-section">
          {/* Left Column - Portrait */}
          <div className="portrait-column">
            <div className="portrait-container">
              <div className="portrait-frame">
                <div className="portrait-placeholder">
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="portrait-image"
                    width="380"
                    height="480"
                    fetchpriority="high"
                    decoding="async"
                  />
                  <div className="portrait-grid">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="grid-cell"></div>
                    ))}
                  </div>
                  <div className="portrait-overlay">
                    <div className="overlay-line"></div>
                    <div className="overlay-line"></div>
                  </div>
                  {/* Open to Work Tag */}
                  <div className="open-to-work-tag">
                    <span className="tag-dot"></span>
                    <span className="tag-text">Open to Work</span>
                  </div>
                </div>
                <div className="portrait-outline"></div>
                <div className="portrait-glow"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="content-column">
            <div className="typography-container">
              <div className="name-wrapper">
                <h1 className="first-name">Ayush</h1>
              </div>

              <div className="title-divider">
                <div className="divider-line"></div>
                <h2 className="subtitle">Student / Developer</h2>
                <div className="divider-line"></div>
              </div>

              <div className="description-card">
                <p className="description-text">
                  Passionate about <span className="highlight">technology</span>
                  , <span className="highlight">design</span>and{" "}
                  <span className="highlight">continuous learning</span>, I
                  focus on building impactful digital solutions that solve
                  real-world problems with clarity and precision.
                </p>

                <div className="description-line"></div>

                <p className="description-subtext">
                  Currently pursuing Computer Science. I am developing strong
                  foundations in software development while actively working on
                  projects that prepare me for a professional career in the tech
                  industry.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Social Links */}
        <footer className="social-footer">
          <div className="social-container">
  {Object.keys(socialLinks).map((platform) => (
    <a
      key={platform}
      href={socialLinks[platform]}
      className={`social-icon ${platform}`}
      aria-label={platform}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="icon-inner">
        <i
          className={`fab fa-${
            platform === "telegram" ? "telegram-plane" : platform
          }`}
        ></i>
      </div>
      <div className="icon-glow"></div>
    </a>
  ))}
</div>


          {/* <div className="scroll-indicator">
            <div className="scroll-line">
              <div className="scroll-dot"></div>
            </div>
            <span className="scroll-text">Explore</span>
          </div> */}
        </footer>
        <div className="footer-bottom">
          <p className="copyright">&copy; 2026 Aayushya Shrivastava</p>
          <div className="flag-counter-wrapper">
            <p className="flag-label">VISITORS BY COUNTRY</p>
            <a href="https://info.flagcounter.com/f8SJ" target="_blank" rel="noopener noreferrer">
              <img
                src="https://s01.flagcounter.com/count2/f8SJ/bg_111111/txt_AAAAAA/border_333333/columns_5/maxflags_10/viewers_0/labels_1/pageviews_1/flags_1/percent_0/"
                alt="Flag Counter"
                className="flag-counter-img"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
