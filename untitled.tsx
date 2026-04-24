import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [status, setStatus] = React.useState("Sistema Protegido");

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#002d72', color: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <header>
        <h1 style={{fontSize: '2.5rem'}}>G4S SECURITY DASHBOARD</h1>
      </header>
      
      <div style={{ backgroundColor: 'white', color: '#333', padding: '30px', borderRadius: '15px', display: 'inline-block', marginTop: '50px', border: '5px solid #e31e24' }}>
        <h2 style={{margin: '0'}}>Estado: <span style={{ color: 'green' }}>{status}</span></h2>
        <p style={{fontSize: '18px'}}>IA Gemini: <strong>Activa</strong></p>
        <button 
          onClick={() => alert("Escaneo iniciado...")}
          style={{ padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#e31e24', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          INICIAR ESCANEO
        </button>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
