"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, RefreshCw, LogOut, ShieldAlert, Radio, Lock, Unlock, Clock, MapPin } from 'lucide-react';

export default function G4S_ARC_Console_Final() {
  const [session, setSession] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // Coordenadas iniciales (Barranquilla)
  const [currentCoords, setCurrentCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const res = await fetch(`${url}/rest/v1/alarm_logs?select=*&order=created_at.desc&limit=15`, {
        headers: { 'apikey': key || '', 'Authorization': `Bearer ${key}`, 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
      
      // Si el registro más reciente tiene coordenadas, movemos el mapa
      if (data[0] && data[0].latitud && data[0].longitud) {
        setCurrentCoords({ lat: data[0].latitud, lng: data[0].longitud });
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // FUNCIÓN GENÉRICA PARA CREAR EVENTOS (PANICO O ARMADO) CON DATOS ALEATORIOS
  const createNewEvent = async (tipo: string) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    // Generar coordenadas aleatorias cerca de Barranquilla para que el mapa se mueva
    const newLat = 10.96 + (Math.random() * 0.05);
    const newLng = -74.78 - (Math.random() * 0.05);
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/alarm_logs`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipo_evento: tipo,
          nombre_cliente: `CLIENTE G4S - ${randomNum}`,
          cuenta: `ARC-${randomNum}`,
          latitud: newLat,
          longitud: newLng,
          created_at: new Date().toISOString()
        })
      });
      fetchData(); // Refrescar historial y mapa
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const latest = logs[0] || {};
  const isPanic = latest.tipo_evento === "PÁNICO";
  const isArmed = latest.tipo_evento === "Sistema Armado";

  if (!session) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
      <button onClick={() => setSession(true)} style={{ padding: '20px 40px', background: '#E11D48', color: 'white', borderRadius: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '18px' }}>ENTRAR A CONSOLA G4S</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '90px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ background: '#E11D48', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '40px' }}>G4S</div>
        <Home size={28} color="#E11D48" />
        <div style={{ flex: 1 }} />
        <LogOut onClick={() => setSession(false)} size={28} color="#94A3B8" style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: '90px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#0F172A' }}>Monitor de Alarmas</h1>
            <RefreshCw onClick={fetchData} size={24} color="#E11D48" className={loading ? 'animate-spin' : ''} style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '25px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ background: log.tipo_evento === 'PÁNICO' ? '#FFF1F2' : '#F0FDF4', padding: '12px', borderRadius: '14px' }}>
                    {log.tipo_evento === 'PÁNICO' ? <ShieldAlert color="#E11D48" /> : <ShieldCheck color="#10B981" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: log.tipo_evento === 'PÁNICO' ? '#E11D48' : '#0F172A' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>{log.nombre_cliente} • <b>{log.cuenta}</b> • {log.created_at ? new Date(log.created_at).toLocaleTimeString() : ''}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PANEL DERECHO */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* BOTÓN ARMADO/DESARMADO (GENERA NUEVA CUENTA) */}
          <div style={{ background: 'white', padding: '30px', borderRadius: '35px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
             <button 
                onClick={() => createNewEvent(isArmed ? "Sistema Desarmado" : "Sistema Armado")}
                style={{ width: '100%', padding: '25px', background: isArmed ? '#0F172A' : '#10B981', color: 'white', border: 'none', borderRadius: '20px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}
             >
               {isArmed ? <Unlock size={30} /> : <Lock size={30} />}
               {isArmed ? 'DESARMAR SISTEMA' : 'ARMAR SISTEMA'}
             </button>
          </div>

          {/* BOTÓN ANULAR (SOLO SI EL ÚLTIMO ES PÁNICO) */}
          {isPanic && (
            <button 
              onClick={() => createNewEvent("FALSA ALARMA ANULADA")}
              style={{ width: '100%', padding: '25px', background: '#FFF1F2', border: '2px solid #E11D48', borderRadius: '30px', color: '#E11D48', fontWeight: '900', cursor: 'pointer' }}
            >
              <ShieldAlert size={40} style={{ margin: '0 auto 10px' }} />
              <div>ANULAR ALERTA PÁNICO</div>
            </button>
          )}

          {/* GPS DINÁMICO CONECTADO AL ÚLTIMO REGISTRO */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '15px', display: 'flex', gap: '8px', fontSize: '14px' }}><MapPin color="#E11D48" /> UBICACIÓN EN TIEMPO REAL</div>
            <img 
              src={`https://static-maps.yandex.ru/1.x/?ll=${currentCoords.lng},${currentCoords.lat}&z=14&l=map&size=360,240&pt=${currentCoords.lng},${currentCoords.lat},pm2rdl`} 
              style={{ width: '100%', borderRadius: '20px', border: '1px solid #E2E8F0' }} 
              alt="GPS"
            />
          </div>

          {/* SIMULADOR DE PÁNICO */}
          <div style={{ background: '#0F172A', padding: '30px', borderRadius: '30px', textAlign: 'center' }}>
            <Radio color="#E11D48" style={{ marginBottom: '15px' }} />
            <button onClick={() => createNewEvent("PÁNICO")} style={{ width: '100%', padding: '15px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>SIMULAR PÁNICO</button>
          </div>
        </aside>
      </main>

      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
