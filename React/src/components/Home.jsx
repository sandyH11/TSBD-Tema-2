import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/home.css';

export default function Home(){
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="header-hero">
        <h1>Sistema de Gestión de Microservicios</h1>
        <p>Administra Estudiantes y Cursos</p>
        <div className="hero-buttons">
          <div className="hero-card" style={{background:'#2563eb'}} onClick={() => navigate('/students')}>
            <i className="bi bi-people-fill"></i>
            <div style={{fontSize:20, marginTop:8}}>Estudiantes</div>
          </div>
          <div className="hero-card" style={{background:'#10b981'}} onClick={() => navigate('/courses')}>
            <i className="bi bi-book-fill"></i>
            <div style={{fontSize:20, marginTop:8}}>Cursos</div>
          </div>
        </div>
      </div>
    </div>
  );
}
