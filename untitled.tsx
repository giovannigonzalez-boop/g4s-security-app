import React, { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState("Sistema Protegido");

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#002d72', color: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <header>
        <img src="https://www.g4s.com/assets/g4s-logo.png" alt="G4S Logo" style={{ width: '150px' }} />
        <h1>Dashboard de Seguridad G4S</h1>
      </header>
      
      <div style={{ backgroundColor: 'white', color: '#333', padding: '20px', borderRadius: '10px', display: 'inline-block', marginTop: '50px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <h2>Estado del Sistema: <span style={{ color: 'green' }}>{status}</span></h2>
        <p>Inteligencia Artificial Gemini: <strong>Conectada</strong></p>
        <button 
          onClick={() => alert("Escaneando instalaciones...")}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#e31e24', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Iniciar Escaneo de Seguridad
        </button>
      </div>
      
      <footer style={{ marginTop: '100px', fontSize: '12px', opacity: '0.7' }}>
        © 2026 G4S Security Systems - IA Collaboration
      </footer>
    </div>
  );
}
