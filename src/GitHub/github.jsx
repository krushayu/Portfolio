import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import SEO from "../SEO";
import "./github.css";

const GitHub = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/krushayu"),
          fetch("https://api.github.com/users/krushayu/repos?sort=updated&per_page=100"),
        ]);
        setProfile(await profileRes.json());
        const reposData = await reposRes.json();
        setRepos(reposData.filter((r) => !r.fork));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    handleResize();
    window.addEventListener("resize", handleResize);
    const particles = Array.from({ length: 35 }, () => ({
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
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", handleResize); if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, []);

  const filtered = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase())) ||
    (r.language && r.language.toLowerCase().includes(search.toLowerCase()))
  );

  const langColor = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
    HTML: "#e34c26", CSS: "#563d7c", Solidity: "#AA6746",
    Java: "#b07219", Shell: "#89e051",
  };

  return (
    <div className="gh-page">
      <SEO
        title="GitHub Repositories"
        description="GitHub public repositories by Aayush Shrivastava (krushayu) — Portfolio, Ventify, HelpForYou, Blockchain Medical Storage, Image Editor and more open source projects."
        url="/github"
        keywords="krushayu github, Aayush Shrivastava github repos, krushayu open source"
      />
      <canvas ref={canvasRef} className="background-canvas" />
      <div className="gh-wrapper">

        <header className="gh-header">
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

        {profile && (
          <div className="gh-profile">
            <img src={profile.avatar_url} alt="krushayu github profile" className="gh-avatar" />
            <div className="gh-profile-info">
              <h1 className="gh-name">
                {profile.name}
                <span className="gh-username">@{profile.login}</span>
              </h1>
              {profile.bio && <p className="gh-bio">{profile.bio}</p>}
              <div className="gh-stats">
                <div className="gh-stat"><strong>{profile.public_repos}</strong><span>Repos</span></div>
                <div className="gh-stat"><strong>{profile.followers}</strong><span>Followers</span></div>
                <div className="gh-stat"><strong>{profile.following}</strong><span>Following</span></div>
              </div>
              <a href="https://github.com/krushayu" target="_blank" rel="noopener noreferrer" className="gh-profile-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        )}

        <div className="gh-search-wrapper">
          <svg className="gh-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="gh-search"
            placeholder="Search repositories, language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="gh-clear" onClick={() => setSearch("")}>✕</button>}
        </div>

        {loading ? (
          <div className="gh-loading">
            <div className="loading-spinner" />
            <p>Fetching repositories...</p>
          </div>
        ) : (
          <>
            <p className="gh-count">{filtered.length} public repositories</p>
            <div className="gh-repos-grid">
              {filtered.map((repo) => (
                <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="gh-repo-card">
                  <div className="gh-repo-top">
                    <svg className="gh-repo-icon" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                    </svg>
                    <span className="gh-repo-name">{repo.name}</span>
                    {repo.stargazers_count > 0 && (
                      <span className="gh-stars">⭐ {repo.stargazers_count}</span>
                    )}
                  </div>
                  {repo.description && <p className="gh-repo-desc">{repo.description}</p>}
                  <div className="gh-repo-footer">
                    {repo.language && (
                      <span className="gh-lang">
                        <span className="gh-lang-dot" style={{ background: langColor[repo.language] || "#888" }} />
                        {repo.language}
                      </span>
                    )}
                    <span className="gh-updated">
                      {new Date(repo.updated_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                </a>
              ))}
              {filtered.length === 0 && (
                <div className="gh-no-results">No repositories found for "{search}"</div>
              )}
            </div>
          </>
        )}

        <footer className="gh-footer">
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
        </footer>
      </div>
    </div>
  );
};

export default GitHub;
