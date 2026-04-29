"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Home, Video, Activity, CheckCircle2, XCircle, Search, RefreshCw, MapPin, Hash } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SProDashboard() {
  const [logs, setLogs] = useState([]);
  const [isArmed, setIsArmed] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');
  const [loading, setLoading] = useState(true);

  async function fetchG4SData() {
    setLoading(true);
    // IMPORTANTE: Ajustado a tus nombres reales de columna en Supabase
    const { data, error } = await supabase
      .from('alarm_logs')
      .select('id, nombre_client, cuenta, tipo_evento, ciudad, fecha_evento')
      .order('id', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error("Error detectado:", error.message);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  }

  useEffect(() => { fetchG4SData(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F2F5', color: '#1C1E21', fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* MENU LATERAL G4S */}
      <nav style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #DADDE1', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'fixed', height: '100vh' }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '15px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', fontSize: '18px' }}>
          G4S MONITORING
        </div>
        
        <button onClick={() => setActiveTab('inicio')} style={navButtonStyle(activeTab === 'inicio')}>
          <Home size={20}/> Inicio
        </button>
        <button onClick={() => setActiveTab('video')} style={navButtonStyle(activeTab === 'video')}>
          <Video size={20}/> Video
        </button>
        <button onClick={() => setActiveTab('actividad')} style={navButtonStyle(activeTab === 'actividad')}>
          <Activity size={20}/> Actividad
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>Panel de Control</h1>
          <button onClick={fetchG4SData} style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #DADDE1', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> 
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </header>

        <div style={{ display: 'flex', gap: '30px' }}>
          
          {/* LISTA DE EVENTOS REALES */}
          <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #F0F2F5', paddingBottom: '10px', color: '#4B4B4B' }}>Eventos Recientes</h3>
            
            {logs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {logs.map((log) => (
                  <div key={log.id} style={{ padding: '18px', borderRadius: '10px', backgroundColor: '#F8F9FA', borderLeft: '5px solid #E11D48', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '800', color: '#1C1E21', fontSize: '15px' }}>{log.tipo_evento}</div>
                      <div style={{ fontSize: '14px', margin: '4px 0', color: '#4B4B4B' }}>
                         <strong>{log.nombre_client}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#606770', display: 'flex', gap: '15px' }}>
                        <span style={{display:'flex', alignItems:'center', gap:'4px'}}><Hash size={12}/> {log.cuenta}</span>
                        <span style={{display:'flex', alignItems:'center', gap:'4px'}}><MapPin size={12}/> {log.ciudad}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#90949C', fontWeight: '600' }}>
                      {log.fecha_evento}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <Activity size={48} color="#DADDE1" />
                <p style={{ color: '#606770', marginTop: '15px' }}>
                  {loading ? 'Buscando señales...' : 'No hay datos. Verifica que el RLS en Supabase esté en "Disabled".'}
                </p>
              </div>
            )}
          </div>

          {/* BOTON DE ARMADO INTERACTIVO */}
          <div style={{ flex: 1 }}>
            <div 
              onClick={() => setIsArmed(!isArmed)}
              style={{ 
                backgroundColor: 'white', borderRadius: '12px', padding: '35px', textAlign: 'center', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer', transition: '0.3s'
              }}
            >
              <div style={{ 
                width: '130px', height: '130px', borderRadius: '50%', border: `8px solid ${isArmed ? '#31A24C' : '#E11D48'}`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px',
                backgroundColor: isArmed ? '#F0FFF4' : '#FFF5F5'
              }}>
                {isArmed ? <CheckCircle2 size={70} color="#31A24C" /> : <XCircle size={70} color="#E11D48" />}
              </div>
              <h2 style={{ color: isArmed ? '#31A24C' : '#E11D48', margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
                {isArmed ? 'SISTEMA ARMADO' : 'DESARMADO'}
              </h2>
              <p style={{ color: '#606770', fontSize: '14px', marginTop: '10px' }}>Partición Principal</p>
              <div style={{ marginTop: '20px', fontSize: '12px', color: '#90949C', borderTop: '1px solid #F0F2F5', paddingTop: '15px' }}>
                Haz clic para cambiar el estado
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function navButtonStyle(active) {
  return {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', border: 'none', 
    cursor: 'pointer', borderRadius: '8px', width: '100%', textAlign: 'left', transition: '0.2s',
    backgroundColor: active ? '#FEE2E2' : 'transparent', 
    color: active ? '#E11D48' : '#606770',
    fontWeight: active ? 'bold' : 'normal',
    fontSize: '15px'
  };
}
