"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, RefreshCw, LogOut, ShieldAlert, Radio, Lock, Unlock, Clock, MapPin } from 'lucide-react';

export default function G4S_ARC_Console_Total() {
  const [session, setSession] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // FUNCIÓN DE CARGA - REVISADA PARA TRAER TODO EL HISTORIAL RECIENTE
  const fetchData = async () => {
    setLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      // Traemos los últimos 50 registros para asegurar variedad de cuentas
      const response = await fetch(`${supabaseUrl}/rest/v1/alarm_logs?select=*&order=created_at.desc&limit=50`, {
        headers: {
          'apikey': supabaseKey || '',
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      const data = await response.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error en Refresh:", e);
    } finally {
      setLoading(false);
    }
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
      fetchData(); // Recarga automática tras cambio
    } catch (e) { alert("Error al actualizar estado"); }
  };

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
          tipo_evento: "PÁNICO",
          nombre_cliente: "CLIENTE EMERGENCIA G4S",
          cuenta: "BAQ-" + Math.floor(Math.random() * 9000),
          created_at: new Date().toISOString()
        })
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const latestEvent = logs[0] || {};
  const isPanic = latestEvent.tipo_evento === "PÁNICO";
  const isArmed = latestEvent.tipo_evento?.includes("Armado");

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

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: '90px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Log de Activaciones</h1>
            <div onClick={fetchData} style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <RefreshCw size={24} color="#E11D48" className={loading ? 'animate-spin' : ''} />
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '25px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            {logs.length === 0 && <p style={{textAlign:'center', color:'#94A3B8'}}>Cargando historial...</p>}
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ background: log.tipo_evento === 'PÁNICO' ? '#FFF1F2' : '#F0FDF4', padding: '12px', borderRadius: '14px' }}>
                    {log.tipo_evento === 'PÁNICO' ? <ShieldAlert color="#E11D48" /> : <ShieldCheck color="#10B981" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: log.tipo_evento === 'PÁNICO' ? '#E11D48' : '#0F172A' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>
                       {log.nombre_cliente} • <b>{log.cuenta}</b> • <Clock size={12} style={{ display: 'inline', marginBottom:'-2px' }} /> {log.created_at ? new Date(log.created_at).toLocaleTimeString() : ''}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => updateStatus(log.id, log.tipo_evento?.includes("Armado") ? "Sistema Desarmado" : "Sistema Armado")}
                  style={{ background: log.tipo_evento?.includes("Armado") ? '#0F172A' : '#E11D48', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  {log.tipo_evento?.includes("Armado") ? 'DESARMAR' : 'ARMAR'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SIDE PANEL */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* BOTÓN ARMADO MAESTRO (REEMPLAZA AL CÍRCULO) */}
          <div style={{ background: 'white', padding: '30px', borderRadius: '30px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
             <button 
                onClick={() => updateStatus(latestEvent.id, isArmed ? "Sistema Desarmado" : "Sistema Armado")}
                style={{ width: '100%', padding: '25px', background: isArmed ? '#0F172A' : '#10B981', color: 'white', border: 'none', borderRadius: '20px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}
             >
               {isArmed ? <Unlock size={30} /> : <Lock size={30} />}
               {isArmed ? 'DESARMAR SISTEMA' : 'ARMAR SISTEMA'}
             </button>
          </div>

          {/* TARJETA FALSA ALARMA (SOLO EN PÁNICO) */}
          {isPanic && (
            <div 
              onClick={() => updateStatus(latestEvent.id, "FALSA ALARMA ANULADA")}
              style={{ padding: '35px 20px', background: '#FFF1F2', border: '2px solid #E11D48', borderRadius: '30px', textAlign: 'center', cursor: 'pointer' }}
            >
              <ShieldAlert size={50} color="#E11D48" style={{ margin: '0 auto 15px' }} />
              <h3 style={{ color: '#E11D48', fontWeight: '900', margin: 0 }}>ANULAR FALSA ALARMA</h3>
              <p style={{ fontSize: '12px', color: '#E11D48', marginTop: '10px' }}>Haga clic para archivar señal</p>
            </div>
          )}

          {/* UBICACIÓN */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
             <div style={{ fontWeight: 'bold', marginBottom: '15px', display: 'flex', gap: '8px' }}><MapPin color="#E11D48" /> UBICACIÓN DE SEÑAL</div>
             <img src={`https://static-maps.yandex.ru/1.x/?ll=-74.7813,10.9685&z=14&l=map&size=350,200&pt=-74.7813,10.9685,pm2rdl`} style={{ width: '100%', borderRadius: '20px' }} />
          </div>

          {/* SIMULADOR */}
          <div style={{ background: '#0F172A', padding: '30px', borderRadius: '30px', textAlign: 'center' }}>
            <Radio color="#E11D48" style={{ marginBottom: '15px' }} />
            <button onClick={simulatePanic} style={{ width: '100%', padding: '15px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>SIMULAR PÁNICO</button>
          </div>
        </aside>
      </main>

      <style jsx>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
