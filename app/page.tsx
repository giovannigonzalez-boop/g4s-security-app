"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Home, Video, Activity, CheckCircle2, XCircle, Search, RefreshCw, Bell, Power, ShieldCheck } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Mantenemos el nombre de la función estándar para que Vercel no se confunda
export default function Page() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  async function fetchG4SData() {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(10);
    if (data) setLogs(data);
    setLoading(false);
  }

  async function simulateEvent(tipo: string, cliente: string = "Simulación G4S", cuenta: string = "SIM-999") {
    const nuevoEvento = {
      nombre_cliente: cliente,
      cuenta: cuenta,
      tipo_evento: tipo,
      ciudad: "Central de Monitoreo",
      fecha_evento: new Date().toLocaleString(),
    };
    const { error } = await supabase.from('alarm_logs').insert([nuevoEvento]);
    if (!error) fetchG4SData();
  }

  useEffect(() => { fetchG4SData(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F2F5', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR CON BOTONES VISIBLES */}
      <nav style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #DADDE1', padding: '20px', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '15px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>G4S CENTRAL</div>
        
        <p style={{ fontSize: '11px', color: '#999', fontWeight: 'bold', marginBottom: '10px' }}>SIMULADOR DE ALARMAS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => simulateEvent('ALERTA DE PÁNICO')} style={{ padding: '12px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><Bell size={18}/> Pánico</button>
          <button onClick={() => simulateEvent('APERTURA LOCAL')} style={{ padding: '12px', backgroundColor: '#31A24C', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><Power size={18}/> Apertura</button>
          <button onClick={() => simulateEvent('CIERRE SISTEMA')} style={{ padding: '12px', backgroundColor: '#1877F2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldCheck size={18}/> Cierre</button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Monitor de Señales Interactiva</h1>
          <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '50%', border: '1px solid #DADDE1', backgroundColor: 'white', cursor: 'pointer' }}><RefreshCw size={20}/></button>
        </header>

        <div style={{ display: 'flex', gap: '25px' }}>
          <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #EEE', paddingBottom: '10px' }}>Cola de Eventos</h3>
            {logs.map((log) => (
              <div key={log.id} style={{ padding: '15px', borderBottom: '1px solid #F8F9FA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#E11D48' }}>{log.tipo_evento}</div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{log.nombre_cliente}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{log.cuenta} | {log.fecha_evento}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => simulateEvent('FALSA ALARMA', log.nombre_cliente, log.cuenta)} style={{ padding: '5px 10px', border: '1px solid #FF9800', color: '#FF9800', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Anular</button>
                  <button onClick={() => simulateEvent('CIERRE OK', log.nombre_cliente, log.cuenta)} style={{ padding: '5px 10px', border: '1px solid #4CAF50', color: '#4CAF50', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Cerrar</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <div onClick={() => { setIsArmed(!isArmed); simulateEvent(isArmed ? 'DESARMADO APP' : 'ARMADO APP'); }} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: `6px solid ${isArmed ? '#31A24C' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                {isArmed ? <CheckCircle2 size={50} color="#31A24C" /> : <XCircle size={50} color="#E11D48" />}
              </div>
              <h2 style={{ color: isArmed ? '#31A24C' : '#E11D48', margin: 0 }}>{isArmed ? 'ARMADO' : 'DESARMADO'}</h2>
              <p style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>Clic para enviar comando</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
