"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, RefreshCw, LogOut, MapPin, ShieldAlert, Radio, Lock, Unlock } from 'lucide-react';

export default function G4SARC_FinalConsole() {
  const [session, setSession] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [systemArmed, setSystemArmed] = useState(true); // Estado maestro

  // 1. FUNCIÓN PARA ACTUALIZAR LA BASE DE DATOS (ARMADO/DESARMADO)
  const handleSystemToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus.includes("Armado") ? "Sistema Desarmado" : "Sistema Armado";
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/alarm_logs?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ tipo_evento: newStatus, created_at: new Date().toISOString() })
      });
      fetchData(); // Recargar para ver el cambio
    } catch (e) { alert("Error al actualizar"); }
  };

  // 2. FUNCIÓN DE BÚSQUEDA REAL EN LOS 20,000 REGISTROS
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
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // 3. SIMULADOR DE PÁNICO (ESTO SÍ INSERTA UN REGISTRO REAL)
  const simulatePanic = async () => {
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
          nombre_cliente: "CLIENTE VIP TEST",
          cuenta: "BAQ-9999",
          latitud: 10.9685,
          longitud: -74.7813
        })
      });
      fetchData();
      alert("¡Señal de Pánico enviada a la base de datos!");
    } catch (e) { alert("Error en simulación"); }
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  if (!session) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
      <button onClick={() => setSession(true)} style={{ padding: '20px 40px', background: '#E11D48', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
        INGRESAR A CONSOLA G4S
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      {/* Barra Lateral */}
      <aside style={{ width: '100px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
        <div style={{ background: '#E11D48', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '40px' }}>G4S</div>
        <Home size={28} color="#E11D48" />
        <div style={{ flex: 1 }} />
        <LogOut onClick={() => setSession(false)} style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </aside>

      {/* Contenido Principal */}
      <main style={{ flex: 1, padding: '40px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Historial Real G4S ARC</h1>
            <button onClick={fetchData} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
              <RefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: log.tipo_evento?.includes("PÁNICO") ? '#E11D48' : '#0F172A' }}>{log.tipo_evento}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{log.nombre_cliente} • {log.cuenta}</div>
                </div>
                <button 
                  onClick={() => handleSystemToggle(log.id, log.tipo_evento)}
                  style={{ background: log.tipo_evento?.includes("Armado") ? '#0F172A' : '#E11D48', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                >
                  {log.tipo_evento?.includes("Armado") ? 'DESARMAR' : 'ARMAR'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Panel de Control Derecho */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '25px', textAlign: 'center' }}>
            <div 
              onClick={() => setSystemArmed(!systemArmed)}
              style={{ width: '100px', height: '100px', borderRadius: '50%', background: systemArmed ? '#F0FDF4' : '#FFF1F2', border: `5px solid ${systemArmed ? '#10B981' : '#E11D48'}`, margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              {systemArmed ? <Lock color="#10B981" size={40} /> : <Unlock color="#E11D48" size={40} />}
            </div>
            <h3 style={{ margin: 0, color: systemArmed ? '#10B981' : '#E11D48' }}>{systemArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8' }}>Clic para cambio manual</p>
          </div>

          <div style={{ background: '#0F172A', color: 'white', padding: '25px', borderRadius: '25px', textAlign: 'center' }}>
            <Radio color="#E11D48" size={30} />
            <h4 style={{ margin: '10px 0' }}>MODO SIMULACIÓN</h4>
            <button onClick={simulatePanic} style={{ background: '#E11D48', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>
              ENVIAR PÁNICO REAL
            </button>
          </div>
        </section>
      </main>
      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
