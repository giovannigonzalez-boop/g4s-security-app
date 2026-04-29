"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Home, Video, Activity, CheckCircle2, XCircle, Search, RefreshCw } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SProDashboard() {
  const [logs, setLogs] = useState([]);
  const [isArmed, setIsArmed] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');
  const [loading, setLoading] = useState(true);

  // Función para traer datos con tus columnas reales
  async function fetchG4SData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('alarm_logs')
      .select('id, nombre_cliente, cuenta, tipo_evento, ciudad, fecha_hora')
      .order('fecha_hora', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error("Error Supabase:", error);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchG4SData();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F2F5', color: '#1C1E21', fontFamily: 'Arial, sans-serif' }}>
      
      {/* BARRA LATERAL INTERACTIVA */}
      <nav style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #DADDE1', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '15px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
          G4S SMART MONITORING
        </div>
        
        <SidebarButton 
          icon={<Home size={20}/>} 
          label="Inicio" 
          active={activeTab === 'inicio'} 
          onClick={() => setActiveTab('inicio')} 
        />
        <SidebarButton 
          icon={<Video size={20}/>} 
          label="Video" 
          active={activeTab === 'video'} 
          onClick={() => setActiveTab('video')} 
        />
        <SidebarButton 
          icon={<Activity size={20}/>} 
          label="Actividad" 
          active={activeTab === 'actividad'} 
          onClick={() => setActiveTab('actividad')} 
        />
      </nav>

      {/* ÁREA DE CONTENIDO */}
      <main style={{ flex: 1, padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
            {activeTab === 'inicio' ? 'Panel de Control' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <button onClick={fetchG4SData} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', borderRadius: '20px', border: '1px solid #DADDE1', backgroundColor: 'white', cursor: 'pointer' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualizar
          </button>
        </header>

        {activeTab === 'inicio' ? (
          <div style={{ display: 'flex', gap: '30px' }}>
            
            {/* TABLA DE EVENTOS CON TUS COLUMNAS */}
            <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #F0F2F5', paddingBottom: '10px' }}>Eventos en Tiempo Real</h3>
              
              {loading ? <p>Conectando con Supabase...</p> : 
               logs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {logs.map((log) => (
                    <div key={log.id} style={{ padding: '15px', borderRadius: '8px', backgroundColor: '#F8F9FA', border: '1px solid #F0F2F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#E11D48' }}>{log.tipo_evento}</div>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{log.nombre_cliente} - <span style={{ color: '#606770' }}>{log.ciudad}</span></div>
                        <div style={{ fontSize: '12px', color: '#90949C' }}>Cuenta: {log.cuenta}</div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '12px', color: '#606770' }}>
                        {log.fecha_hora ? new Date(log.fecha_hora).toLocaleString() : 'Sin fecha'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#90949C' }}>
                  No se encontraron eventos. Revisa las políticas RLS en Supabase.
                </div>
              )}
            </div>

            {/* BOTÓN INTERACTIVO DE ARMADO */}
            <div 
              onClick={() => setIsArmed(!isArmed)}
              style={{ 
                flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '30px', textAlign: 'center', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', height: 'fit-content'
              }}
            >
              <div style={{ 
                width: '120px', height: '120px', borderRadius: '50%', border: `6px solid ${isArmed ? '#31A24C' : '#E11D48'}`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                backgroundColor: isArmed ? '#F0FFF4' : '#FFF5F5'
              }}>
                {isArmed ? <CheckCircle2 size={60} color="#31A24C" /> : <XCircle size={60} color="#E11D48" />}
              </div>
              <h2 style={{ color: isArmed ? '#31A24C' : '#E11D48', margin: '0 0 10px 0', fontSize: '22px' }}>
                {isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}
              </h2>
              <p style={{ color: '#606770', fontSize: '14px' }}>
                Presiona para {isArmed ? 'DESARMAR' : 'ARMAR'} la Partición 1
              </p>
            </div>

          </div>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '60px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Shield size={48} color="#DADDE1" style={{ marginBottom: '20px' }} />
            <h3>Módulo de {activeTab}</h3>
            <p style={{ color: '#606770' }}>Esta sección está siendo configurada para G4S.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Componente pequeño para los botones del menú
function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', border: 'none', 
        cursor: 'pointer', borderRadius: '8px', width: '100%', textAlign: 'left', transition: '0.2s',
        backgroundColor: active ? '#FEE2E2' : 'transparent', 
        color: active ? '#E11D48' : '#606770',
        fontWeight: active ? 'bold' : 'normal'
      }}
    >
      {icon} {label}
    </button>
  );
}
