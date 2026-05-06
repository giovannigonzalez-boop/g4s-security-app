"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, RefreshCw, LogOut, MapPin, ShieldAlert, Radio, Lock, Unlock } from 'lucide-react';

export default function G4S_Consola_Final() {
  const [session, setSession] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  // 1. CARGAR DATOS (Trae los últimos 20 de tus 20,000 registros)
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/alarm_logs?select=*&order=created_at.desc&limit=20`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        }
      });
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
      if (data.length > 0) setCoords({ lat: data[0].latitud, lng: data[0].longitud });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // 2. FUNCIÓN PARA EL BOTÓN ARMAR/DESARMAR (Escribe en la BD)
  const toggleStatus = async (id: any, currentStatus: string) => {
    const nextStatus = currentStatus.includes("Armado") ? "Sistema Desarmado" : "Sistema Armado";
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/alarm_logs?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tipo_evento: nextStatus })
      });
      fetchData();
    } catch (e) { alert("Error al conectar"); }
  };

  // 3. SIMULAR PÁNICO (Crea un registro nuevo que aparecerá arriba)
  const triggerPanic = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/alarm_logs`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipo_evento: "ALERTA DE PÁNICO",
          nombre_cliente: "SIMULACIÓN PRESENTACIÓN",
          cuenta: "CTA-PRESENTACION",
          latitud: 10.9685,
          longitud: -74.7813
        })
      });
      fetchData();
      alert("¡Señal de Pánico enviada!");
    } catch (e) { alert("Error"); }
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  if (!session) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
      <button onClick={() => setSession(true)} style={{ padding: '20px 40px', background: '#E11D48', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
        INGRESAR A CONSOLA G4S ARC
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '100px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
        <div style={{ background: '#E11D48', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '40px' }}>G4S</div>
        <Home size={28} color="#E11D48" />
        <div style={{ flex: 1 }} />
        <LogOut onClick={() => setSession(false)} style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </aside>

      <main style={{ flex: 1, padding: '40px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Historial Real G4S ARC</h1>
            <RefreshCw onClick={fetchData} className={loading ? 'animate-spin' : ''} style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                   <div style={{ background: log.tipo_evento?.includes("PÁNICO") ? '#FFF1F2' : '#F0FDF4', padding: '10px', borderRadius: '10px' }}>
                      {log.tipo_evento?.includes("PÁNICO") ? <ShieldAlert color="#E11D48" /> : <ShieldCheck color="#10B981" />}
                   </div>
                   <div>
                      <div style={{ fontWeight: 'bold' }}>{log.tipo_evento}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{log.nombre_cliente} • {log.cuenta}</div>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {log.tipo_evento?.includes("PÁNICO") ? (
                    <button onClick={() => toggleStatus(log.id, "Pánico")} style={{ background: '#E11D48', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>ANULAR</button>
                  ) : (
                    <button onClick={() => toggleStatus(log.id, log.tipo_evento)} style={{ background: '#0F172A', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>
                      {log.tipo_evento?.includes("Armado") ? 'DESARMAR' : 'ARMAR'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside>
          <div style={{ background: 'white', padding: '30px', borderRadius: '25px', textAlign: 'center', marginBottom: '20px' }}>
             <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: logs[0]?.tipo_evento?.includes("PÁNICO") ? '#FFF1F2' : '#F0FDF4', border: '4px solid', borderColor: logs[0]?.tipo_evento?.includes("PÁNICO") ? '#E11D48' : '#10B981', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {logs[0]?.tipo_evento?.includes("PÁNICO") ? <ShieldAlert color="#E11D48" /> : <Lock color="#10B981" />}
             </div>
             <div style={{ fontWeight: 'bold' }}>{logs[0]?.tipo_evento?.includes("PÁNICO") ? 'ALERTA DETECTADA' : 'SISTEMA PROTEGIDO'}</div>
          </div>
          <img src={`https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=14&l=map&size=320,200&pt=${coords.lng},${coords.lat},pm2rdl`} style={{ width: '100%', borderRadius: '20px' }} />
          <div style={{ background: '#0F172A', color: 'white', padding: '20px', borderRadius: '20px', marginTop: '20px', textAlign: 'center' }}>
            <Radio color="#E11D48" size={24} />
            <div style={{ margin: '10px 0', fontSize: '13px' }}>MODO SIMULACIÓN</div>
            <button onClick={triggerPanic} style={{ width: '100%', padding: '10px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>DISPARAR PÁNICO</button>
          </div>
        </aside>
      </main>
      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
