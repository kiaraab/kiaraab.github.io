// src/pages/WorkDetail.jsx

import React from "react";
import { useParams } from "react-router-dom";
import projects from "../data/projects";

const WorkDetail = () => {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return <div>Not found</div>;
  return (
    <div style={{ background: "#ffe5ec", minHeight: "100vh", padding: "2rem" }}>
      {/* ...existing code for header/nav... */}
      <div style={{ maxWidth: 700, margin: "0 auto", background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)", padding: "2rem" }}>
        <img src={project.thumbnail} alt={project.title} style={{ width: "100%", borderRadius: 16, marginBottom: 24 }} />
        <h1>{project.title}</h1>
        <p>{project.blurb}</p>
        {/* ...add more detail as needed... */}
      </div>
    </div>
  );
};

export default WorkDetail;