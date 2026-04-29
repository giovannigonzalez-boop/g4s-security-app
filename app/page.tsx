"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Home, Video, Activity, CheckCircle2, XCircle, Search, RefreshCw, AlertTriangle, Bell, Power, ShieldCheck } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SSimulatorDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  async function fetchG4SData() {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(10);
    if (data) setLogs(data);
    setLoading(false);
  }

  // --- FUNCIÓN PARA SIMULAR/INSERTAR EVENTOS ---
  async function simulateEvent(tipo: string, cliente: string = "Simulación G4S", cuenta: string = "SIM-999") {
    const nuevoEvento = {
      nombre_cliente: cliente,
      cuenta: cuenta,
      tipo_evento: tipo,
      ciudad: "Central de Monitoreo",
      fecha_evento: new Date().toLocaleString(),
    };

    const { error } = await supabase.from('alarm_logs').insert([nuevoEvento]);
    if (error) alert("Error al simular: " + error.message);
    else fetchG4SData(); // Refrescar lista
  }

  useEffect(() => { fetchG4SData(); }, []);

  const filteredLogs = logs.filter(log => 
    String(log.nombre_cliente || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(log.cuenta || "").toLowerCase().includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F2F5', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR CON BOTONES DE SIMULACIÓN RÁPIDA */}
      <nav style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #DADDE1', padding: '20px', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '15px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' as const }}>G4S CENTRAL</div>
        
        <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', marginTop: '10px' }}>SIMULAR EVENTOS</p>
        <button onClick={() => simulateEvent('ALERTA DE PÁNICO', 'Usuario Prueba', 'BAQ123')} style={simBtnStyle('#E11D48')}><Bell size={18}/> Generar Alarma</button>
        <button onClick={() => simulateEvent('APERTURA LOCAL', 'Almacenes Éxito', 'BOG444')} style={simBtnStyle('#31A24C')}><Power size={18}/> Simular Apertura</button>
        <button onClick={() => simulateEvent('CIERRE DE SISTEMA', 'Tienda D1', 'MED555')} style={simBtnStyle('#1877F2')}><ShieldCheck size={18}/> Simular Cierre</button>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Monitor de Señales Interactiva</h1>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} size={18} />
            <input 
              type="text" placeholder="Buscar señal..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 15px 10px 40px', borderRadius: '20px', border: '1px solid #DADDE1', width: '250px' }}
            />
          </div>
        </header>

        <div style={{ display: 'flex', gap: '25px' }}>
          {/* PANEL DE SEÑALES CON ACCIONES */}
          <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #EEE', paddingBottom: '10px' }}>Cola de Eventos</h3>
            
            {filteredLogs.map((log) => (
              <div key={log.id} style={{ padding: '15px', borderBottom: '1px solid #F8F9FA', marginBottom: '10px', borderRadius: '8px', backgroundColor: '#fcfcfc', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ backgroundColor: getEventColor(log.tipo_evento), color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>{log.tipo_evento}</span>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '5px' }}>{log.nombre_cliente}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Cuenta: {log.cuenta} | {log.fecha_evento}</div>
                  </div>
                  
                  {/* BOTONES DE ACCIÓN PARA EL CLIENTE */}
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <button onClick={() => simulateEvent('CANCELADO POR USUARIO', log.nombre_cliente, log.cuenta)} style={actionBtn('#FF9800')}>Falsa Alarma</button>
                    <button onClick={() => simulateEvent('CIERRE CONFIRMADO', log.nombre_cliente, log.cuenta)} style={actionBtn('#4CAF50')}>Cerrar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CONTROL DE ARMADO */}
          <div style={{ flex: 1 }}>
            <div onClick={() => {
                setIsArmed(!isArmed);
                simulateEvent(isArmed ? 'DESARMADO DESDE APP' : 'ARMADO DESDE APP', 'Dueño de Casa', 'MI-CASA-1');
              }} 
              style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', textAlign: 'center' as const, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: `6px solid ${isArmed ? '#31A24C' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', backgroundColor: isArmed ? '#F0FFF4' : '#FFF5F5' }}>
                {isArmed ? <CheckCircle2 size={50} color="#31A24C" /> : <XCircle size={50} color="#E11D48" />}
              </div>
              <h2 style={{ color: isArmed ? '#31A24C' : '#E11D48', margin: 0, fontSize: '20px' }}>{isArmed ? 'ARMADO' : 'DESARMADO'}</h2>
              <p style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>Presiona para enviar comando</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ESTILOS AUXILIARES
const simBtnStyle = (color: string) => ({
  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: 'none', borderRadius: '8px',
  cursor: 'pointer', backgroundColor: color, color: 'white', fontWeight: 'bold' as const, fontSize: '13px'
});

const actionBtn = (color: string) => ({
  padding: '5px 10px', border: `1px solid ${color}`, borderRadius: '4px', backgroundColor: 'transparent',
  color: color, fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' as const
});

function getEventColor(tipo: string) {
  if (tipo?.includes('Alarma') || tipo?.includes('PÁNICO')) return '#E11D48';
  if (tipo?.includes('Apertura')) return '#31A24C';
  if (tipo?.includes('Cierre') || tipo?.includes('CANCELADO')) return '#1877F2';
  return '#666';
}
