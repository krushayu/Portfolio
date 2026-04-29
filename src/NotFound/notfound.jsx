import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./notfound.css";

const NotFound = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 1 + 0.5, speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15, opacity: Math.random() * 0.05 + 0.02,
    }));
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0; if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0; if (p.y < 0) p.y = canvas.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`; ctx.fill();
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <div className="nf-page">
      <canvas ref={canvasRef} className="background-canvas" />
      <div className="nf-wrapper">
        <Link to="/" className="nf-logo">
          <span>Ayush</span>
          <div className="nf-logo-line" />
        </Link>
        <div className="nf-content">
          <div className="nf-code">404</div>
          <div className="nf-divider" />
          <h1 className="nf-title">Page Not Found</h1>
          <p className="nf-desc">The page you're looking for doesn't exist or has been moved.</p>
          <div className="nf-actions">
            <Link to="/" className="nf-btn primary">Go Home</Link>
            <Link to="/work" className="nf-btn secondary">View Projects</Link>
            <Link to="/contact" className="nf-btn secondary">Contact</Link>
          </div>
        </div>
        <p className="nf-footer">&copy; 2026 Aayushya Shrivastava</p>
      </div>
    </div>
  );
};

export default NotFound;
