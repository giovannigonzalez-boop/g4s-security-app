"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, RefreshCw, LogOut, ShieldAlert, Radio, Lock, Unlock, Clock, MapPin } from 'lucide-react';

export default function G4S_Console_Final() {
  const [session, setSession] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/alarm_logs?select=*&order=created_at.desc&limit=12`, {
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
    } catch (e) { alert("Error al actualizar"); }
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
          nombre_cliente: "CLIENTE G4S - EMERGENCIA",
          cuenta: "BAQ-1288",
          created_at: new Date().toISOString()
        })
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const latestEvent = logs[0] || {};
  const isPanic = latestEvent.tipo_evento === "PÁNICO";
  const isSystemArmed = latestEvent.tipo_evento?.includes("Armado");

  if (!session) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
      <button onClick={() => setSession(true)} style={{ padding: '20px 40px', background: '#E11D48', color: 'white', borderRadius: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>INGRESAR CONSOLA G4S</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '90px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ background: '#E11D48', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '40px' }}>G4S</div>
        <Home size={28} color="#E11D48" style={{ marginBottom: '30px' }} />
        <div style={{ flex: 1 }} />
        <LogOut onClick={() => setSession(false)} size={28} color="#94A3B8" style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '90px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0F172A' }}>Log de Activaciones G4S</h1>
            <RefreshCw onClick={fetchData} className={loading ? 'animate-spin' : ''} style={{ cursor: 'pointer', color: '#94A3B8' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ background: log.tipo_evento === 'PÁNICO' ? '#FFF1F2' : '#F0FDF4', padding: '10px', borderRadius: '12px' }}>
                    {log.tipo_evento === 'PÁNICO' ? <ShieldAlert color="#E11D48" /> : <ShieldCheck color="#10B981" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: log.tipo_evento === 'PÁNICO' ? '#E11D48' : '#0F172A' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                       CTA: {log.cuenta} • <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {log.created_at ? new Date(log.created_at).toLocaleTimeString() : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PANEL DERECHO CON BOTONES DE CONTROL */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* BOTÓN DE ARMADO/DESARMADO PRINCIPAL (REEMPLAZA AL CÍRCULO) */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '25px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
             <button 
                onClick={() => updateStatus(latestEvent.id, isSystemArmed ? "Sistema Desarmado" : "Sistema Armado")}
                style={{ width: '100%', padding: '20px', background: isSystemArmed ? '#0F172A' : '#10B981', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
             >
               {isSystemArmed ? <Unlock size={24} /> : <Lock size={24} />}
               {isSystemArmed ? 'DESARMAR SISTEMA' : 'ARMAR SISTEMA'}
             </button>
          </div>

          {/* BOTÓN DE FALSA ALARMA (VISIBLE SOLO SI HAY PÁNICO) */}
          {isPanic && (
            <button 
              onClick={() => updateStatus(latestEvent.id, "FALSA ALARMA ANULADA")}
              style={{ width: '100%', padding: '30px 20px', background: '#FFF1F2', color: '#E11D48', border: '2px solid #E11D48', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
            >
              <ShieldAlert size={40} style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '18px' }}>ANULAR FALSA ALARMA</div>
            </button>
          )}

          {/* SIMULADOR */}
          <div style={{ background: '#0F172A', padding: '25px', borderRadius: '25px', textAlign: 'center' }}>
            <Radio color="#E11D48" style={{ marginBottom: '10px' }} />
            <div style={{ color: 'white', fontSize: '12px', marginBottom: '15px', fontWeight: 'bold' }}>SIMULADOR ARC</div>
            <button onClick={triggerPanic} style={{ width: '100%', padding: '15px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>DISPARAR PÁNICO</button>
          </div>

          {/* MAPA */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '25px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
             <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16} color="#E11D48" /> UBICACIÓN ARC</div>
             <div style={{ width: '100%', height: '180px', background: '#F1F5F9', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '12px' }}>Mapa de Monitoreo Activo</div>
          </div>
        </aside>
      </main>
      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
