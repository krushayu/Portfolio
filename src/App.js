import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import './App.css';
import Home from "./Home/home";
import About from "./About/about";
import Work from "./Work/work";
import Contact from "./Contact/contact";
import ProjectDetail from "./Work/ProjectDetail";
import GitHub from "./GitHub/github";

function App() {
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () => document.removeEventListener("contextmenu", disableRightClick);
  }, []);

  return (
    <div className="watermark-bg">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Work />} />
          <Route path="/project/:domain/:id" element={<ProjectDetail />} />
          <Route path="/connect" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/github" element={<GitHub />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
