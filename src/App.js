import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Home/home";
import About from "./About/about";
import Work from "./Work/work";
import Contact from "./Contact/contact";
import ComingSoon from "./comingsoon";
import './App.css';

function App() {
  useEffect(() => {
  const disableRightClick = (e) => e.preventDefault();
  document.addEventListener("contextmenu", disableRightClick);

  return () => {
    document.removeEventListener("contextmenu", disableRightClick);
  };
}, []);

  return (
    <div className="watermark-bg">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Work />} />
          <Route path="/connect" element={<Contact />} />
          <Route path="/comingsoon" element={<ComingSoon />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
} 

export default App;
