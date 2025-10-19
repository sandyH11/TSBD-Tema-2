import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Students from './components/Students';
import Courses from './components/Courses';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Microservicios</Link>
          <div>
            <Link className="nav-link d-inline text-white" to="/">Inicio</Link>
            <Link className="nav-link d-inline text-white" to="/students">Estudiantes</Link>
            <Link className="nav-link d-inline text-white" to="/courses">Cursos</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </Router>
  );
}

export default App;
