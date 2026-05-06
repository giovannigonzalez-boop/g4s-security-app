"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, RefreshCw, LogOut, ShieldAlert, Radio, Lock, Unlock, Clock } from 'lucide-react';

export default function G4S_ARC_Console_V3() {
  const [session, setSession] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. CARGA DE DATOS (Muestra los 20 más recientes de tus 20,000 registros)
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

  // 2. FUNCIÓN PARA ANULAR O CAMBIAR ESTADO (Escribe en Supabase)
  const updateEventStatus = async (id: any, newStatus: string) => {
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
      fetchData(); // Refresca la lista automáticamente
    } catch (e) { alert("Error al actualizar"); }
  };

  // 3. SIMULACIÓN DE PÁNICO REAL
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
          nombre_cliente: "SIMULACIÓN G4S ARC",
          cuenta: "ARC-999",
          created_at: new Date().toISOString()
        })
      });
      fetchData();
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
      {/* BARRA LATERAL CON BOTÓN DE CERRAR SESIÓN */}
      <aside style={{ width: '100px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
        <div style={{ background: '#E11D48', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '40px' }}>G4S</div>
        <Home size={28} color="#E11D48" />
        <div style={{ flex: 1 }} />
        <button onClick={() => setSession(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', color: '#64748B' }}>
          <LogOut size={28} />
          <div style={{ fontSize: '10px', fontWeight: 'bold' }}>SALIR</div>
        </button>
      </aside>

      <main style={{ flex: 1, padding: '40px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0F172A' }}>Log de Activaciones G4S</h1>
            <RefreshCw onClick={fetchData} className={loading ? 'animate-spin' : ''} style={{ cursor: 'pointer', color: '#64748B' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            {logs.map((log) => {
              const isPanic = log.tipo_evento?.includes("PÁNICO");
              const isArmed = log.tipo_evento?.includes("Armado");
              const eventTime = log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--';

              return (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                     <div style={{ background: isPanic ? '#FFF1F2' : '#F0FDF4', padding: '10px', borderRadius: '12px' }}>
                        {isPanic ? <ShieldAlert color="#E11D48" /> : <ShieldCheck color="#10B981" />}
                     </div>
                     <div>
                        <div style={{ fontWeight: 'bold', color: isPanic ? '#E11D48' : '#0F172A' }}>{log.tipo_evento}</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>
                          {log.nombre_cliente} • <span style={{ fontWeight: 'bold', color: '#0F172A' }}>{log.cuenta}</span> • <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {eventTime}
                        </div>
                     </div>
                  </div>
                  
                  {/* BOTONES DINÁMICOS */}
                  <div>
                    {isPanic ? (
                      <button 
                        onClick={() => updateEventStatus(log.id, "FALSA ALARMA ANULADA")}
                        style={{ background: '#E11D48', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                      >
                        ANULAR FALSA ALARMA
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateEventStatus(log.id, isArmed ? "Sistema Desarmado" : "Sistema Armado")}
                        style={{ background: isArmed ? '#0F172A' : '#E11D48', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                      >
                        {isArmed ? 'DESARMAR' : 'ARMAR'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PANEL DERECHO: ESTADO Y SIMULADOR */}
        <aside>
          <div style={{ background: 'white', padding: '30px', borderRadius: '25px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
             <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: logs[0]?.tipo_evento?.includes("PÁNICO") ? '#FFF1F2' : '#F0FDF4', border: '4px solid', borderColor: logs[0]?.tipo_evento?.includes("PÁNICO") ? '#E11D48' : '#10B981', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {logs[0]?.tipo_evento?.includes("PÁNICO") ? <ShieldAlert color="#E11D48" size={30} /> : <Lock color="#10B981" size={30} />}
             </div>
             <div style={{ fontWeight: 'bold', fontSize: '18px', color: logs[0]?.tipo_evento?.includes("PÁNICO") ? '#E11D48' : '#10B981' }}>
               {logs[0]?.tipo_evento?.includes("PÁNICO") ? 'ALERTA DETECTADA' : 'SISTEMA PROTEGIDO'}
             </div>
          </div>

          <div style={{ background: '#0F172A', color: 'white', padding: '25px', borderRadius: '25px', textAlign: 'center' }}>
            <Radio color="#E11D48" size={30} style={{ marginBottom: '10px' }} />
            <div style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' }}>SIMULADOR DE EVENTOS</div>
            <button 
              onClick={triggerPanic} 
              style={{ width: '100%', padding: '15px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)' }}
            >
              DISPARAR PÁNICO REAL
            </button>
          </div>
        </aside>
      </main>
      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
