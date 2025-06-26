// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/index";
import WorkDetail from "./pages/WorkDetail";
// ...existing code...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        {/* ...existing code... */}
      </Routes>
    </Router>
  );
}

export default App;