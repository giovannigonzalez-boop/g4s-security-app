"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, RefreshCw, LogOut, ShieldAlert, Radio, Lock, Unlock, Clock, MapPin } from 'lucide-react';

export default function G4S_ARC_Console_Final() {
  const [session, setSession] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/alarm_logs?select=*&order=created_at.desc&limit=15`, {
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

  const updateStatus = async (id: any, newStatus: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/alarm_logs?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tipo_evento: newStatus })
      });
      fetchData();
    } catch (e) { alert("Error"); }
  };

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
          tipo_evento: "PÁNICO",
          nombre_cliente: "CLIENTE CRÍTICO G4S",
          cuenta: "BAQ-9901",
          created_at: new Date().toISOString()
        })
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const latestEvent = logs[0] || {};
  const isPanicActive = latestEvent.tipo_evento === "PÁNICO";

  if (!session) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
      <button onClick={() => setSession(true)} style={{ padding: '20px 40px', background: '#E11D48', color: 'white', borderRadius: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '18px' }}>INGRESAR ARC G4S</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '100px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ background: '#E11D48', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: '900', marginBottom: '50px' }}>G4S</div>
        <Home size={30} color="#E11D48" style={{ marginBottom: '40px', cursor: 'pointer' }} />
        <Radio size={30} color="#94A3B8" style={{ cursor: 'pointer' }} />
        <div style={{ flex: 1 }} />
        <LogOut onClick={() => setSession(false)} size={30} color="#94A3B8" style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '100px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A' }}>Log de Activaciones</h1>
            <RefreshCw onClick={fetchData} className={loading ? 'animate-spin' : ''} style={{ cursor: 'pointer', color: '#94A3B8' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '25px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ marginBottom: '20px', color: '#64748B', fontSize: '14px', letterSpacing: '1px' }}>HISTORIAL EN TIEMPO REAL</h3>
            {logs.map((log) => {
              const isP = log.tipo_evento === "PÁNICO";
              const isArm = log.tipo_evento?.includes("Armado");
              const time = log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
              
              return (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ background: isP ? '#FFF1F2' : '#F0FDF4', padding: '12px', borderRadius: '14px' }}>
                      {isP ? <ShieldAlert color="#E11D48" size={24} /> : <ShieldCheck color="#10B981" size={24} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '16px', color: isP ? '#E11D48' : '#0F172A' }}>{log.tipo_evento}</div>
                      <div style={{ fontSize: '13px', color: '#64748B' }}>{time} • CTA: {log.cuenta}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateStatus(log.id, isArm ? "Sistema Desarmado" : "Sistema Armado")}
                    style={{ background: isArm ? '#0F172A' : '#E11D48', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                  >
                    {isArm ? 'DESARMAR' : 'ARMAR'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* PANEL DERECHO DINÁMICO */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* WIDGET ESTADO */}
          <div style={{ background: 'white', padding: '35px', borderRadius: '35px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: `6px solid ${isPanicActive ? '#E11D48' : '#10B981'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', background: isPanicActive ? '#FFF1F2' : '#F0FDF4' }}>
              {isPanicActive ? <ShieldAlert size={50} color="#E11D48" /> : <ShieldCheck size={50} color="#10B981" />}
            </div>
            <h2 style={{ color: isPanicActive ? '#E11D48' : '#10B981', fontWeight: '900', margin: 0 }}>
              {isPanicActive ? 'SISTEMA EN ALERTA' : 'SISTEMA ARMADO'}
            </h2>
          </div>

          {/* BOTÓN GRANDE DE ANULACIÓN (SÓLO APARECE EN PÁNICO) */}
          {isPanicActive && (
            <div 
              onClick={() => updateStatus(latestEvent.id, "FALSA ALARMA ANULADA")}
              style={{ background: '#FFF1F2', border: '2px solid #E11D48', padding: '40px 20px', borderRadius: '35px', textAlign: 'center', cursor: 'pointer', transition: '0.3s' }}
            >
              <div style={{ background: '#E11D48', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                <ShieldAlert color="white" size={30} />
              </div>
              <h3 style={{ color: '#E11D48', fontWeight: '900', margin: 0 }}>ANULAR ALERTA PÁNICO</h3>
            </div>
          )}

          {/* UBICACIÓN */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '35px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', fontWeight: 'bold', fontSize: '14px' }}>
              <MapPin color="#E11D48" size={20} /> UBICACIÓN DE SEÑAL
            </div>
            <img 
              src={`https://static-maps.yandex.ru/1.x/?ll=-74.7813,10.9685&z=15&l=map&size=360,220&pt=-74.7813,10.9685,pm2rdl`} 
              style={{ width: '100%', borderRadius: '20px' }} alt="mapa" 
            />
          </div>

          {/* SIMULADOR */}
          <div style={{ background: '#0F172A', padding: '25px', borderRadius: '35px', textAlign: 'center' }}>
            <Radio color="#E11D48" style={{ marginBottom: '15px' }} />
            <button onClick={triggerPanic} style={{ width: '100%', padding: '15px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>SIMULAR PÁNICO</button>
          </div>
        </aside>
      </main>

      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
