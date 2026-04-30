"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Search 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SGeoPanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(5);
    if (data) setLogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Función para obtener la URL de un mapa estático (Google Maps o similar)
  // Esto muestra una imagen del mapa basada en la ubicación de la última señal
  const getMapUrl = (lat: number = 10.96, lng: number = -74.78) => {
    return `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=13&l=map&size=600,400&pt=${lng},${lat},pm2rdl`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <nav style={{ width: '80px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '25px 0', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '30px' }}>G4S</div>
        <Home size={24} color="#E11D48" />
        <div style={{ flex: 1 }} />
        <LogOut size={24} color="#94A3B8" onClick={() => window.location.reload()} style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, marginLeft: '80px', padding: '30px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px' }}>
        
        <section>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>Consola de Geo-Monitoreo ARC</h1>
            <button onClick={fetchData} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer' }}>
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </header>

          {/* MAPA VISUAL (Sin necesidad de terminal) */}
          <div style={{ height: '450px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {logs.length > 0 ? (
              <img 
                src={getMapUrl(logs[0].latitud, logs[0].longitud)} 
                alt="Ubicación de Alarma" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ color: '#94A3B8' }}>Cargando mapa de operaciones...</div>
            )}
          </div>

          {/* LISTA DE ACTIVIDAD ABAJO */}
          <div style={{ marginTop: '25px', backgroundColor: 'white', borderRadius: '20px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#64748B', marginBottom: '15px' }}>Ubicación de Señales Críticas</h3>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <MapPin size={18} color={log.tipo_evento?.includes('PÁNICO') ? '#E11D48' : '#64748B'} />
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.nombre_cliente}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: log.tipo_evento?.includes('PÁNICO') ? '#E11D48' : '#1E293B' }}>{log.tipo_evento}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Lat: {log.latitud} | Lng: {log.longitud}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PANEL DERECHO */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#1E293B', borderRadius: '24px', padding: '30px', color: 'white', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={50} color="#10B981" />
            </div>
            <h3 style={{ fontSize: '18px', margin: 0 }}>SOC BARRANQUILLA</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>Sincronizado con Supabase Cloud</p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '25px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '15px' }}>Estadísticas de Zona</h4>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              <p>● Pánicos activos: <strong>{logs.filter(l => l.tipo_evento?.includes('PÁNICO')).length}</strong></p>
              <p>● Despachos en curso: <strong>0</strong></p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
