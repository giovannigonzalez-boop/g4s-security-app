"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Home, Video, Activity, CheckCircle2, XCircle, Search, RefreshCw, MapPin } from 'lucide-react';

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
    // IMPORTANTE: Nombres ajustados a tu imagen de Supabase
    const { data, error } = await supabase
      .from('alarm_logs')
      .select('id, nombre_client, cuenta, tipo_evento, ciudad, fecha_evento')
      .order('id', { ascending: false })
      .limit(10);
    
    if (error) console.error("Error Supabase:", error.message);
    else setLogs(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchG4SData(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F2F5', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <nav style={{ width: '250px', backgroundColor: '#FFF', borderRight: '1px solid #DDD', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'fixed', height: '100vh' }}>
        <div style={{ backgroundColor: '#E11D48', color: '#FFF', padding: '15px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>G4S SECURITY</div>
        <button onClick={() => setActiveTab('inicio')} style={btnStyle(activeTab === 'inicio')}><Home size={20}/> Inicio</button>
        <button onClick={() => setActiveTab('video')} style={btnStyle(activeTab === 'video')}><Video size={20}/> Video</button>
        <button onClick={() => setActiveTab('actividad')} style={btnStyle(activeTab === 'actividad')}><Activity size={20}/> Actividad</button>
      </nav>

      {/* CONTENIDO */}
      <main style={{ flex: 1, marginLeft: '250px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Panel de Control</h1>
          <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer', border: '1px solid #CCC' }}><RefreshCw size={20} className={loading ? 'animate-spin' : ''}/></button>
        </header>

        <div style={{ display: 'flex', gap: '20px' }}>
          {/* TABLA DE EVENTOS */}
          <div style={{ flex: 2, backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #EEE', paddingBottom: '10px' }}>Eventos Recientes</h3>
            {logs.length > 0 ? logs.map(log => (
              <div key={log.id} style={{ padding: '15px', borderBottom: '1px solid #F9F9F9', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#E11D48' }}>{log.tipo_evento}</div>
                  <div style={{ fontSize: '14px' }}>{log.nombre_client}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Cuenta: {log.cuenta} | {log.ciudad}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#AAA' }}>{log.fecha_evento}</div>
              </div>
            )) : <p style={{ textAlign: 'center', color: '#999' }}>{loading ? 'Cargando...' : 'No hay datos. Revisa el RLS en Supabase.'}</p>}
          </div>

          {/* BOTÓN ARMADO */}
          <div onClick={() => setIsArmed(!isArmed)} style={{ flex: 1, backgroundColor: '#FFF', padding: '30px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', height: 'fit-content', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: `6px solid ${isArmed ? '#22C55E' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              {isArmed ? <CheckCircle2 size={50} color="#22C55E"/> : <XCircle size={50} color="#E11D48"/>}
            </div>
            <h2 style={{ color: isArmed ? '#22C55E' : '#E11D48' }}>{isArmed ? 'ARMADO' : 'DESARMADO'}</h2>
            <p style={{ fontSize: '12px', color: '#999' }}>Haz clic para cambiar estado</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function btnStyle(active) {
  return {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%', textAlign: 'left',
    backgroundColor: active ? '#FEE2E2' : 'transparent', color: active ? '#E11D48' : '#666', fontWeight: active ? 'bold' : 'normal'
  };
}
