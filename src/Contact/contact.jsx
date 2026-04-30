import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import SEO from "../SEO";
import emailjs from "@emailjs/browser";
import "./contact.css";
// import { FaGithub, FaLinkedin, FaBlog } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef();

  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  // About page style background animation
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // Prepare template parameters with date and time
      const now = new Date();
      const templateParams = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        message: formData.message,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        to_email: process.env.REACT_APP_EMAILJS_EMAIL,
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      console.log("Email sent successfully:", result.text);

      // Success message
      setSubmitted(true);
      setIsSending(false);

      // Reset form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        message: "",
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error sending email:", error);

      // Error message for user
      setSubmitted(false);
      setIsSending(false);

      alert(
        "Failed to send message. Please try again later or contact me directly at rajaayush931@gmail.com"
      );
    }
  };

  // const socialLinks = {
  //   github: "/comingsoon",
  //   linkedin: "/comingsoon",
  //   blogs: "/comingsoon",
  // };

  return (
    <div className="portfolio-contact">
      <SEO
        title="Contact"
        description="Contact Aayush Shrivastava (krushayu) — Full Stack Developer. Email: rajaayush931@gmail.com. Available for freelance, internships and collaborations."
        url="/contact"
        keywords="contact krushayu, hire Aayush Shrivastava, krushayu email, krushayu freelance"
      />
      {/* Background Canvas (About page style) */}
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

        <main className="contact-content">
          {/* Intro Section */}
          <div className="intro-section">
            <div className="intro-content">
              <div className="contact-header">
                <h1 className="contact-title">get in touch</h1>
                <div className="title-underline"></div>
              </div>

              <div className="intro-description">
                <p className="description-text">
                  Let's collaborate and build something{" "}
                  <span className="highlight">amazing</span> together. Whether
                  you have a project in mind or just want to connect, I'd love
                  to hear from you. Your message will be sent directly to my
                  email.
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="contact-sections">
            <div className="left-column">
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">✍️</div>
                  <h3 className="section-title">SEND A MESSAGE</h3>
                </div>

                <form
                  ref={formRef}
                  className="contact-form"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group">
                    <div className="input-with-label">
                      <label htmlFor="name" className="input-label">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="contact-input"
                      />
                      <div className="input-line"></div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <div className="input-with-label">
                        <label htmlFor="email" className="input-label">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="contact-input"
                        />
                        <div className="input-line"></div>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-with-label">
                        <label htmlFor="mobile" className="input-label">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          id="mobile"
                          name="mobile"
                          placeholder="Enter your mobile number"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="contact-input"
                        />
                        <div className="input-line"></div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-with-label">
                      <label htmlFor="message" className="input-label">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project, ideas, or questions..."
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="contact-textarea"
                      ></textarea>
                      <div className="input-line"></div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSending}
                  >
                    <span className="button-text">
                      {isSending ? "SENDING..." : "SEND MESSAGE"}
                    </span>
                    <span className="button-arrow">→</span>
                  </button>

                  {submitted && (
                    <div className="success-message">
                      <div className="success-content">
                        <div className="success-icon">✓</div>
                        <div>
                          <h4>Message Sent Successfully!</h4>
                          <p>
                            Thank you for reaching out. I've received your
                            message and will get back to you within 24 hours.
                          </p>
                        
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

            </div>

            {/* Right Column - Map */}
            <div className="right-column">
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">📍</div>
                  <h3 className="section-title">I'm Here..</h3>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7553.683218262049!2d84.1376441!3d18.8052108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1766844388834!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: "14px", marginTop: "16px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Centurion University Location"
                ></iframe>
              </div>

              {/* GitHub Card */}
              <div className="section-card gh-contact-card">
                <div className="gh-contact-top">
                  <svg className="gh-contact-logo" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <div>
                    <h3 className="gh-contact-name">krushayu</h3>
                    <p className="gh-contact-sub">github.com/krushayu</p>
                  </div>
                </div>
                <p className="gh-contact-desc">Check out my open source projects, contributions and code on GitHub.</p>
                <div className="gh-contact-links">
                  <a href="https://github.com/krushayu" target="_blank" rel="noopener noreferrer" className="gh-contact-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View GitHub Profile
                  </a>
                  <Link to="/github" className="gh-contact-btn gh-contact-btn--secondary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    Browse Repositories
                  </Link>
                </div>
              </div>

              {/* Social Cards Row */}
              <div className="social-cards-row">

                {/* LinkedIn */}
                <a href="https://www.linkedin.com/in/krushayu/" target="_blank" rel="noopener noreferrer" className="social-card social-card--linkedin">
                  <div className="social-card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div className="social-card-info">
                    <p className="social-card-name">LinkedIn</p>
                    <p className="social-card-handle">in/krushayu</p>
                  </div>
                  <svg className="social-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>

                {/* Medium */}
                <a href="https://krushayu.medium.com/" target="_blank" rel="noopener noreferrer" className="social-card social-card--medium">
                  <div className="social-card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                    </svg>
                  </div>
                  <div className="social-card-info">
                    <p className="social-card-name">Medium</p>
                    <p className="social-card-handle">krushayu.medium.com</p>
                  </div>
                  <svg className="social-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>

                {/* Telegram */}
                <a href="https://t.me/krushayu" target="_blank" rel="noopener noreferrer" className="social-card social-card--telegram">
                  <div className="social-card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div className="social-card-info">
                    <p className="social-card-name">Telegram</p>
                    <p className="social-card-handle">@krushayu</p>
                  </div>
                  <svg className="social-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>

              </div>

            </div>
          </div>
        </main>

        <footer className="contact-footer">
          <div className="footer-content">
            <div className="signature">&copy; 2026 Aayushya Shrivastava</div>
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
              <Link to="/contact" className="footer-link">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Contact;