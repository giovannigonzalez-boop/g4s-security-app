import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  // Estados de la alarma
  const [alarmState, setAlarmState] = useState('DISARMED'); // DISARMED, ARMED, TRIGGERED
  const [logs, setLogs] = useState<{time: string, msg: string}[]>([]);

  // Función para registrar eventos
  const addLog = (message: string) => {
    const now = new Date().toLocaleTimeString();
    setLogs(prev => [{time: now, msg: message}, ...prev].slice(0, 5));
  };

  const handleTrigger = () => {
    if (alarmState === 'ARMED') {
      setAlarmState('TRIGGERED');
      addLog("¡ALERTA! Intrusión detectada en Zona Norte");
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      backgroundColor: alarmState === 'TRIGGERED' ? '#8b0000' : '#002d72', 
      color: 'white', 
      minHeight: '100vh',
      transition: 'background-color 0.5s ease'
    }}>
      <h1>G4S Smart Monitoring - Simulador v2.0</h1>

      {/* PANEL PRINCIPAL */}
      <div style={{ backgroundColor: 'white', color: '#333', padding: '20px', borderRadius: '15px', maxWidth: '500px', margin: '20px auto', border: '4px solid #e31e24' }}>
        <h2 style={{ color: alarmState === 'TRIGGERED' ? 'red' : 'black' }}>
          ESTADO: {alarmState === 'DISARMED' ? '🔓 DESARMADO' : alarmState === 'ARMED' ? '🛡️ ARMADO' : '🚨 ¡INTRUSIÓN!'}
        </h2>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={() => {setAlarmState('ARMED'); addLog("Sistema Armado Remotamente")}} style={btnStyle}>Armar</button>
          <button onClick={() => {setAlarmState('DISARMED'); addLog("Sistema Desactivado")}} style={{...btnStyle, backgroundColor: '#666'}}>Desarmar</button>
        </div>
      </div>

      {/* SIMULADOR DE SENSORES */}
      <div style={{ marginTop: '30px' }}>
        <h3>Simulador de Sensores</h3>
        <button onClick={handleTrigger} style={sensorBtnStyle}>Sensor de Movimiento</button>
        <button onClick={handleTrigger} style={sensorBtnStyle}>Contacto de Puerta</button>
      </div>

      {/* REGISTRO DE EVENTOS (Simulación de Base de Datos) */}
      <div style={{ marginTop: '40px', textAlign: 'left', maxWidth: '400px', margin: '40px auto' }}>
        <h4>Historial de Eventos Recientes:</h4>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '5px' }}>
          {logs.length === 0 ? <p>No hay eventos registrados</p> : logs.map((log, i) => (
            <p key={i} style={{ fontSize: '14px', borderBottom: '1px solid #444' }}>
              <strong>[{log.time}]</strong> {log.msg}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

const btnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#e31e24', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' };
const sensorBtnStyle = { margin: '5px', padding: '10px', cursor: 'pointer', backgroundColor: '#ffd700', color: 'black', border: 'none', borderRadius: '5px' };

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
