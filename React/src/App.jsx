import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home.jsx';
import Students from './components/Students.jsx';
import Courses from './components/Courses.jsx';
import './styles/app.css';

export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" to="/">Microservicios</Link>
          <div>
            <Link className="nav-link d-inline text-white mx-3" to="/">Inicio</Link>
            <Link className="nav-link d-inline text-white mx-3" to="/students">Estudiantes</Link>
            <Link className="nav-link d-inline text-white mx-3" to="/courses">Cursos</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
      <div className="footer-space" />
    </Router>
  );
}
