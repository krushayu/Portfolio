import { useEffect, useRef } from "react";
import "./home.css";
import profileImg from "../assest/profile.jpg";
import { Link } from "react-router-dom";
const Home = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

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
            <span className="logo-text">Ayush</span>
            <div className="logo-line"></div>
          </div>
          <nav className="navigation">
            <Link to="/" className="nav-item">
              Home
            </Link>
            <Link to="/about" className="nav-item">
              About
            </Link>
            <Link to="/work" className="nav-item">
              Work
            </Link>
            <Link to="/Connect" className="nav-item">
              Contact
            </Link>
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
        <p>&copy; 2025 Aayushya Shrivastava</p>
      </div>
    </div>
  );
};

export default Home;
