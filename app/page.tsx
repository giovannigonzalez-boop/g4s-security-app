"use client";
import React from 'react';

export default function TestPanel() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#E11D48',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '50px' }}>G4S ARC TEST</h1>
      <p style={{ fontSize: '20px' }}>Si ves este fondo ROJO, el código se actualizó correctamente.</p>
      
      <button 
        onClick={() => alert('¡El sistema de botones funciona!')}
        style={{ 
          padding: '20px 50px', 
          fontSize: '25px', 
          fontWeight: 'bold', 
          backgroundColor: '#FFEB3B', 
          color: 'black', 
          border: 'none', 
          borderRadius: '20px',
          cursor: 'pointer',
          marginTop: '30px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
        }}
      >
        BOTÓN DE PRUEBA PDF
      </button>

      <div style={{ marginTop: '50px', color: 'white' }}>
        Presiona CTRL + F5 después de hacer el Commit.
      </div>
    </div>
  );
}
