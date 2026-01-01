import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

  const contactMethods = [
    {
      platform: "Email",
      value: "rajaayush931@gmail.com",
      icon: "✉️",
      link: "mailto:rajaayush931@gmail.com",
    },
    {
      platform: "Phone",
      value: "+91 8083030197",
      icon: "📱",
      link: "tel:+918083030197",
    },
    {
      platform: "Location",
      value: "Paralakhemundi, Odisha",
      icon: "📍",
    },
  ];

  // const socialLinks = {
  //   github: "/comingsoon",
  //   linkedin: "/comingsoon",
  //   blogs: "/comingsoon",
  // };

  return (
    <div className="portfolio-contact">
      {/* Background Canvas (About page style) */}
      <canvas ref={canvasRef} className="background-canvas" />

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Header */}
        <header className="portfolio-header">
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
            <Link to="/about" className="nav-item">
              About
            </Link>
            <Link to="/work" className="nav-item">
              Work
            </Link>
            <Link to="/contact" className="nav-item active">
              Contact
            </Link>
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
            {/* Left Column - Contact Info */}
            <div className="left-column">
              {/* Contact Methods */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">📞</div>
                  <h3 className="section-title">CONTACT METHODS</h3>
                </div>

                <div className="contact-methods-grid">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="contact-method-card">
                      <div className="method-icon">{method.icon}</div>
                      <div className="method-details">
                        <h4 className="method-platform">{method.platform}</h4>
                        {method.link ? (
                          <a
                            href={method.link}
                            className="method-value"
                            target={
                              method.platform === "Email" ||
                              method.platform === "Phone"
                                ? "_self"
                                : "_blank"
                            }
                            rel={
                              method.platform === "Email" ||
                              method.platform === "Phone"
                                ? ""
                                : "noopener noreferrer"
                            }
                          >
                            {method.value}
                          </a>
                        ) : (
                          <p className="method-value">{method.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              {/* <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">🔗</div>
                  <h3 className="section-title">EXPLORE</h3>
                </div>

                <div className="social-buttons">
                  {Object.entries(socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      className="social-button"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="social-button-icon">
                        {platform === "github" && <FaGithub />}
                        {platform === "linkedin" && <FaLinkedin />}
                        {platform === "blogs" && <FaBlog />}
                      </span>

                      <span className="social-button-text">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                      <span className="social-button-arrow">→</span>
                    </a>
                  ))}
                </div>
              </div> */}

              {/* Availability */}
              {/* <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">⏰</div>
                  <h3 className="section-title">AVAILABILITY</h3>
                </div>

                <div className="availability-info">
                  <div className="availability-item">
                    <div className="availability-label">Response Time</div>
                    <div className="availability-value">Within 24 hours</div>
                  </div>
                  <div className="availability-item">
                    <div className="availability-label">Status</div>
                    <div className="availability-status">
                      <span className="status-dot"></span>
                      Available for projects
                    </div>
                  </div>
                  <div className="availability-item">
                    <div className="availability-label">Working Hours</div>
                    <div className="availability-value">9 AM - 6 PM IST</div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Right Column - Contact Form */}
            <div className="right-column">
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
                          <p className="success-note">
                            A confirmation has been sent to your email.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Google Maps Section */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">📍</div>
                  <h3 className="section-title">I'm Here..</h3>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7553.683218262049!2d84.1376441!3d18.8052108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1766844388834!5m2!1sen!2sin"
                  width="100%"
                  height="280"
                  style={{
                    border: 0,
                    borderRadius: "14px",
                    marginTop: "16px",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Centurion University Location"
                ></iframe>
              </div>
            </div>
          </div>
        </main>

        <footer className="contact-footer">
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
