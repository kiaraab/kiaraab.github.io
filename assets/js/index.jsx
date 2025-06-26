// src/pages/index.jsx

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import projects from "../data/projects"; // Your project data array
import "./Home.css";

const Home = () => {
  const [showHint, setShowHint] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Horizontal scroll with mouse wheel
  const handleWheel = (e) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
      if (showHint) setShowHint(false);
    }
  };

  // Touch drag for mobile
  let startX = 0;
  let scrollLeft = 0;
  const handleTouchStart = (e) => {
    startX = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };
  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX);
    if (showHint) setShowHint(false);
  };

  return (
    <div className="home-root">
      <header className="home-header">
        <div className="site-title">kb</div>
        <nav>
          <a href="/about">about</a>
          <a href="/resume">résumé</a>
        </nav>
      </header>
      <main>
        <h1 className="work-title">Work</h1>
        <div
          className="work-gallery"
          ref={scrollRef}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {projects.map((proj) => (
            <div
              className="project-card"
              key={proj.slug}
              onClick={() => navigate(`/work/${proj.slug}`)}
            >
              <img src={proj.thumbnail} alt={proj.title} />
              <div className="card-content">
                <h2>{proj.title}</h2>
                <p>{proj.blurb}</p>
              </div>
            </div>
          ))}
          {showHint && (
            <div className="scroll-hint">
              <span>Swipe →</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;