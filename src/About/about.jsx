import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./about.css";
import profileImg from "../assest/profile.jpg";

const About = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

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
        40,
        Math.floor((canvas.width * canvas.height) / 30000)
      );

      for (let i = 0; i < particleCount; i++) {
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

      // Dark background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
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

      <div className="content-wrapper">
        <header className="about-header">
          <div className="logo">
            <Link to="/" className="logo-link">
              <span className="logo-text">Ayush</span>
              <div className="logo-line"></div>
            </Link>
          </div>
          <nav className="navigation">
            <Link to="/" className="nav-item">
              Home
            </Link>
            <Link to="/about" className="nav-item active">
              About
            </Link>
            <Link to="/work" className="nav-item">
              Work
            </Link>
            <Link to="/connect" className="nav-item">
              Contact
            </Link>
          </nav>
        </header>

        <main className="about-content">
          {/* Intro Section - Top Full Width */}
          <div className="intro-section">
            <div className="intro-content">
              <div className="name-image-container">
                <div className="image-container">
                  <div className="profile-image-placeholder">
                    <div className="image-frame">
                      <div className="image-overlay">
                        <img
                          src={profileImg}
                          alt="Aayushya Shrivastava"
                          className="profile-image"
                        />
                      </div>
                    </div>
                    <div className="image-glow"></div>
                  </div>
                </div>
                <div className="name-title-container">
                  <h1>Aayush Shrivastava</h1>
                  <div className="tagline">
                    <span className="hashtag">#AyushyaSignature</span>
                  </div>
                  <div className="location">
                    <span className="location-icon">📍</span>
                    <span className="location-text">
                      Paralakhemundi, Odisha, India
                    </span>
                  </div>
                </div>
              </div>

              <div className="intro-description">
                <p className="description-text">
                  I believe in one simple cycle:{" "}
                  <span className="highlight">
                    Code. Create. Break. Learn. Repeat.
                  </span>
                  That's how I grow - both as a developer and as a problem
                  solver.
                </p>
                <p className="description-text">
                  Currently pursuing B.Tech in Computer Science & Engineering
                  with a passion for software development, logical
                  problem-solving and building scalable digital solutions. I
                  enjoy transforming ideas into practical, cleanly implemented
                  products.
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Layout for Details */}
          <div className="details-sections">
            {/* Left Column */}
            <div className="left-column">
              {/* Education Section */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">🎓</div>
                  <h3 className="section-title">EDUCATION</h3>
                </div>

                <div className="education-list">
                  <div className="education-item">
                    <div className="education-header">
                      <h4 className="institution">
                        Centurion University of Technology and Management
                      </h4>
                      <span className="education-duration">2023 – 2027</span>
                    </div>
                    <p className="degree">
                      Bachelor of Technology (B.Tech) — Computer Science
                    </p>
                  </div>

                  <div className="education-item">
                    <div className="education-header">
                      <h4 className="institution">
                        Ram Dayalu Singh College, Muzaffarpur
                      </h4>
                      <span className="education-duration">2023</span>
                    </div>
                    <p className="degree">Intermediate In Science</p>
                  </div>

                  <div className="education-item">
                    <div className="education-header">
                      <h4 className="institution">
                        G.N. High School, Chandanpatti
                      </h4>
                      <span className="education-duration">2021</span>
                    </div>
                    <p className="degree">Matriculation</p>
                  </div>
                </div>
              </div>

              {/* Experience Section */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">💼</div>
                  <h3 className="section-title">EXPERIENCE</h3>
                </div>

                <div className="experience-list">
                  <div className="experience-item">
                    <div className="experience-header">
                      <div className="company-info">
                        <h4 className="company">DIGISAMAKSH</h4>
                        <span className="role">Web Developer</span>
                      </div>
                      <span className="duration">June 2025 – Present</span>
                    </div>
                    {/* <ul className="experience-points">
                      <li>Working on real-world web applications</li>
                      <li>Developing responsive, scalable user interfaces</li>
                      <li>Collaborating on backend logic and integrations</li>
                    </ul> */}
                    <div className="documents">
                      <a
                        href="https://drive.google.com/file/d/1Kjc6WUJkY7jOyjyRfHxwyD_M71S5trSv/view?usp=drive_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        View Offer Letter
                      </a>
                    </div>
                  </div>

                  <div className="experience-item">
                    <div className="experience-header">
                      <div className="company-info">
                        <h4 className="company">CodeAlpha</h4>
                        <span className="role">Frontend Developer</span>
                      </div>
                      <span className="duration">May 2025 – June 2025</span>
                    </div>
                    {/* <ul className="experience-points">
                      <li>Built modern, responsive frontend components</li>
                      <li>Improved UI consistency and performance</li>
                      <li>
                        Gained hands-on experience with production-level
                        workflows
                      </li>
                    </ul> */}
                    <div className="documents">
                      <a
                        href="https://media.licdn.com/dms/image/v2/D4D22AQEWmwpkmdd2Rg/feedshare-shrink_800/B4DZcq0HfvGUAg-/0/1748770001914?e=1768435200&v=beta&t=FEI1WOrMZpmqbGwOeZZatmg3a52IgXi-KZESppomXhc"
                        className="document-link"
                        target="_blank"
                      >
                        View Certificate
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="right-column">
              {/* Skills Section */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">🛠️</div>
                  <h3 className="section-title">SKILLS & TECHNOLOGIES</h3>
                </div>

                <div className="skills-grid">
                  <div className="skill-category">
                    <h4 className="category-title">Primary Stack</h4>
                    <div className="skills-list">
                      <div className="skill-item">MERN Stack</div>
                      <div className="skill-item">Node.js</div>
                      <div className="skill-item">Cloudinary Integration</div>
                      <div className="skill-item">React.js</div>
                      <div className="skill-item">MongoDB</div>
                      <div className="skill-item">Express.js</div>
                    </div>
                  </div>

                  <div className="skill-category">
                    <h4 className="category-title">Core Strengths</h4>
                    <div className="skills-list">
                      <div className="skill-item">Full-Stack Development</div>
                      <div className="skill-item">API Integration</div>
                      <div className="skill-item">UI/UX Design</div>
                      <div className="skill-item">Problem Solving</div>
                      <div className="skill-item">Data Handling</div>
                      <div className="skill-item">Clean Code</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications & Achievements */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">🏆</div>
                  <h3 className="section-title">
                    CERTIFICATIONS & ACHIEVEMENTS
                  </h3>
                </div>

                <div className="achievements-list">
                  <div className="achievement-item">
                    <div className="achievement-header">
                      <h4 className="achievement-title">
                        Gemini Certified University Student
                      </h4>
                      <a
                        href="https://edu.google.accredible.com/a7654f76-353b-4ab3-b867-b38a351c7fc3#acc.ITSuOAVX"
                        className="certificate-link"
                        target="_blank"
                      >
                        View Certificate
                      </a>
                    </div>
                    <div className="achievement-header">
                      <h4 className="achievement-title">
                        GeeksForGeeks - CUTM Training Program
                      </h4>
                      <a
                        href="https://media.geeksforgeeks.org/courses/certificates/d4427cb85f95a689d3df0480d8af3a33.pdf"
                        className="certificate-link"
                        target="_blank"
                      >
                        View Certificate
                      </a>
                    </div>
                  </div>

                  <div className="achievement-item">
                    <div className="achievement-header">
                      <h4 className="achievement-title">
                        🏆Eco Smart Hackathon 2025 Winner
                      </h4>
                      <span className="achievement-badge">1st Place</span>
                    </div>
                    <p className="achievement-description">
                      Won 1st place for developing <a href="http://health-hub-cutm-pkd.vercel.app/"target="_blank" rel="noopener noreferrer"style={{ textDecoration: "none", color: "white" }}>  <strong>HealthHUb - </strong></a>
                      A Health Data Management Web App with appointment booking
                      and doctor consultation features.
                    </p>
                    <div className="tags">
                      <span className="tag">HealthTech</span>
                      <span className="tag">Web App</span>
                      <span className="tag">Real-time</span>
                    </div>
                    <div className="documents">
                      <a
                        href="https://media.licdn.com/dms/image/v2/D4D22AQFTkc3SovHiqg/feedshare-shrink_800/B4DZWoP87TG4Ag-/0/1742284515056?e=1768435200&v=beta&t=_Ziq5o0Usgneggf7q2mkB2u_AqIVYs6GlfOhL-3kigU"
                        className="document-link"
                        target="_blank"
                      >
                        View Event
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="about-footer">
          <div className="footer-content">
            <div className="signature">&copy; 2025 Aayushya Shrivastava</div>
            <div className="footer-links">
              <Link to="/" className="footer-link">
                Home
              </Link>
              <span className="separator">/</span>
              <Link to="/about" className="footer-link">
                About
              </Link>
              <span className="separator">/</span>
              <Link to="/work" className="footer-link">
                Work
              </Link>
              <span className="separator">/</span>
              <Link to="/connect" className="footer-link">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;
