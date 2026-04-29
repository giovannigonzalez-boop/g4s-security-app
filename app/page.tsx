"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Home, Video, Activity, CheckCircle2, XCircle, Search, RefreshCw, MapPin, Hash } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SProDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Cargar datos desde Supabase
  async function fetchG4SData() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alarm_logs')
        .select('id, nombre_client, cuenta, tipo_evento, ciudad, fecha_evento')
        .order('id', { ascending: false });
      
      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error("Error cargando datos:", error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchG4SData();
  }, []);

  // 2. Lógica del Buscador
  const filteredLogs = logs.filter(log => 
    log.nombre_client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.cuenta?.toString().includes(searchTerm) ||
    log.tipo_evento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', border: 'none',
    cursor: 'pointer', borderRadius: '8px', width: '100%', textAlign: 'left' as const,
    backgroundColor: active ? '#FEE2E2' : 'transparent',
    color: active ? '#E11D48' : '#606770',
    fontWeight: active ? 'bold' : 'normal',
    transition: '0.2s'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F2F5', fontFamily: 'sans-serif' }}>
      
      {/* BARRA LATERAL */}
      <nav style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #DADDE1', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'fixed', height: '100vh' }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '15px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' as const, marginBottom: '20px' }}>
          G4S MONITORING
        </div>
        <button onClick={() => setActiveTab('inicio')} style={sidebarBtnStyle(activeTab === 'inicio')}><Home size={20}/> Inicio</button>
        <button onClick={() => setActiveTab('video')} style={sidebarBtnStyle(activeTab === 'video')}><Video size={20}/> Video</button>
        <button onClick={() => setActiveTab('actividad')} style={sidebarBtnStyle(activeTab === 'actividad')}><Activity size={20}/> Actividad</button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>Estado del Sistema</h1>
          
          {/* BUSCADOR REAL */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} size={18} />
              <input 
                type="text" 
                placeholder="Buscar cliente o cuenta..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '10px 15px 10px 40px', borderRadius: '20px', border: '1px solid #DADDE1', width: '300px', outline: 'none', fontSize: '14px' }}
              />
            </div>
            <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '50%', border: '1px solid #DADDE1', backgroundColor: 'white', cursor: 'pointer' }}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '30px' }}>
          
          {/* LISTADO DE SEÑALES */}
          <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #F0F2F5', paddingBottom: '10px' }}>Señales Recibidas</h3>
            
            {loading ? <p>Conectando con base de datos...</p> : 
             filteredLogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredLogs.map((log) => (
                  <div key={log.id} style={{ padding: '15px', borderRadius: '8px', backgroundColor: '#F8F9FA', border: '1px solid #F0F2F5', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#E11D48' }}>{log.tipo_evento}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{log.nombre_client}</div>
                      <div style={{ fontSize: '12px', color: '#606770', display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <span style={{display:'flex', alignItems:'center', gap:'4px'}}><Hash size={12}/> {log.cuenta}</span>
                        <span style={{display:'flex', alignItems:'center', gap:'4px'}}><MapPin size={12}/> {log.ciudad}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#90949C' }}>
                      {log.fecha_evento}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center' as const, padding: '40px', color: '#90949C' }}>
                No se encontraron señales para "{searchTerm}"
              </div>
            )}
          </div>

          {/* ESTADO DE ALARMA */}
          <div style={{ flex: 1 }}>
            <div 
              onClick={() => setIsArmed(!isArmed)}
              style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', textAlign: 'center' as const, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }}
            >
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: `6px solid ${isArmed ? '#31A24C' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', backgroundColor: isArmed ? '#F0FFF4' : '#FFF5F5' }}>
                {isArmed ? <CheckCircle2 size={60} color="#31A24C" /> : <XCircle size={60} color="#E11D48" />}
              </div>
              <h2 style={{ color: isArmed ? '#31A24C' : '#E11D48', margin: '0', fontSize: '22px' }}>{isArmed ? 'ARMADO' : 'DESARMADO'}</h2>
              <p style={{ color: '#606770', fontSize: '14px', marginTop: '10px' }}>Partición 1</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
