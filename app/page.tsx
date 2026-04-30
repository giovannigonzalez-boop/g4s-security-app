"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Search, Power 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SCompletePanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentCoords, setCurrentCoords] = useState({ lat: 10.96, lng: -74.78 }); // Barranquilla

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(8);
    if (data) setLogs(data);
    setLoading(false);
  };

  // Función de simulación unificada que actualiza el mapa
  const simulateEvent = async (tipo: string, cli: string = "G4S User", cta: string = "BAQ-3733") => {
    // Generamos coordenadas aleatorias cerca de Barranquilla para la demo
    const lat = 10.95 + (Math.random() * 0.05);
    const lng = -74.80 + (Math.random() * 0.05);
    
    const { error } = await supabase.from('alarm_logs').insert([{ 
      nombre_cliente: cli, cuenta: cta, tipo_evento: tipo, ciudad: "Barranquilla", 
      fecha_evento: new Date().toLocaleTimeString(), latitud: lat, longitud: lng
    }]);
    
    if (!error) {
      setCurrentCoords({ lat, lng });
      fetchData();
    }
  };

  // Función para obtener la URL del mapa estático (CDN, sin terminal)
  const getMapUrl = (lat: number, lng: number) => {
    return `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=14&l=map&size=350,250&pt=${lng},${lat},pm2rdl`;
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR COMPACTO (Restaurado) */}
      <nav style={{ width: '85px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '25px 0', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ fontWeight: '900', fontSize: '24px', color: '#E11D48', marginBottom: '40px' }}>G4S</div>
        <div style={{ color: '#E11D48', textAlign: 'center' }}><Home size={28} /><div style={{fontSize:'10px', fontWeight:'bold'}}>SOC</div></div>
        <div style={{ flex: 1 }} />
        {/* BOTÓN SALIR (Restaurado) */}
        <div onClick={() => window.location.reload()} style={{ color: '#94A3B8', textAlign: 'center', cursor: 'pointer', marginBottom: '20px' }}>
          <LogOut size={28} /><div style={{fontSize:'10px', fontWeight:'bold'}}>SALIR</div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, marginLeft: '85px', padding: '30px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px' }}>
        
        <section>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>Consola Táctica G4S ARC</h1>
            <button onClick={fetchData} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer' }}>
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </header>

          {/* COLA DE EVENTOS (Principal y operativa) */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px', color: '#475569' }}>Señales en Tiempo Real</h3>
            {logs.map((log) => {
              const isPanic = log.tipo_evento?.toLowerCase().includes('pánico');
              return (
                <div key={log.id} 
                  onClick={() => log.latitud && setCurrentCoords({ lat: log.latitud, lng: log.longitud })}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: isPanic ? '#FFF1F2' : '#F1F5F9' }}>
                      {isPanic ? <AlertTriangle size={20} color="#E11D48"/> : <ShieldCheck size={20} color="#64748B"/>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.nombre_cliente}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>CTA: {log.cuenta} • {log.fecha_evento}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: isPanic ? '#E11D48' : '#334155' }}>{log.tipo_evento}</span>
                    {isPanic && (
                      <button onClick={() => simulateEvent('FALSA ALARMA ANULADA', log.nombre_cliente, log.cuenta)} style={{ padding: '6px 12px', backgroundColor: '#FFF1F2', color: '#E11D48', border: '1px solid #E11D48', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Falsa Alarma</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PANEL DERECHO (Comandos y Mapa) */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* CÍRCULO DE ARMADO (Restaurado e interactivo) */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulateEvent(isArmed ? 'DESARMADO' : 'ARMADO'); }} 
              style={{ width: '130px', height: '130px', borderRadius: '50%', border: `10px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', backgroundColor: isArmed ? '#ECFDF5' : '#FFF1F2', cursor: 'pointer' }}>
              {isArmed ? <CheckCircle2 size={60} color="#10B981" /> : <XCircle size={60} color="#E11D48" />}
            </div>
            <h2 style={{ color: isArmed ? '#10B981' : '#E11D48', margin: 0, fontSize: '18px' }}>{isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</h2>
          </div>

          {/* SIMULADOR (Restaurado) */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '14px', color: '#64748B', marginBottom: '15px' }}>Simulador ARC</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => simulateEvent('ALERTA DE PÁNICO')} style={simBtn}><Bell size={16} color="#E11D48"/></button>
              <button onClick={() => simulateEvent('APERTURA')} style={simBtn}><Power size={16} color="#10B981"/></button>
              <button onClick={() => simulateEvent('CIERRE')} style={simBtn}><ShieldCheck size={16} color="#3B82F6"/></button>
            </div>
          </div>

          {/* GEO-LOCALIZACIÓN (Integrada y segura) */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#1E293B' }}><MapPin size={16} style={{display:'inline', marginRight:'5px'}}/> Geo-Ubicación de Alarma</h4>
            <div style={{ height: '220px', backgroundColor: '#E5E7EB', borderRadius: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={getMapUrl(currentCoords.lat, currentCoords.lng)} 
                alt="Mapa de Ubicación" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

const simBtn = { flex: 1, padding: '15px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
