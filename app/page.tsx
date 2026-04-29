"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, Power, ShieldCheck, RefreshCw, 
  CheckCircle2, XCircle, Search, MapPin, Hash 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

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
    const nuevo = {
      nombre_cliente: cliente,
      cuenta: cuenta,
      tipo_evento: tipo,
      ciudad: "Central G4S",
      fecha_evento: new Date().toLocaleTimeString(),
    };
    const { error } = await supabase.from('alarm_logs').insert([nuevo]);
    if (!error) fetchG4SData();
  }

  useEffect(() => { fetchG4SData(); }, []);

  const filtered = logs.filter(log => 
    String(log.nombre_cliente || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(log.cuenta || "").toLowerCase().includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9', fontFamily: 'sans-serif' }}>
      <nav style={{ width: '280px', backgroundColor: '#0F172A', color: 'white', padding: '24px', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 'bold' }}><span style={{ color: '#E11D48' }}>G4S</span> MONITORING</div>
          <p style={{ fontSize: '10px', color: '#94A3B8' }}>OPERATIONS CENTER</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => simulateEvent('ALERTA DE PÁNICO')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', backgroundColor: '#E11D48', color: 'white', fontWeight: 'bold' }}><Bell size={18}/> Pánico</button>
          <button onClick={() => simulateEvent('APERTURA LOCAL')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', backgroundColor: '#10B981', color: 'white', fontWeight: 'bold' }}><Power size={18}/> Apertura</button>
          <button onClick={() => simulateEvent('CIERRE SISTEMA')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', backgroundColor: '#3B82F6', color: 'white', fontWeight: 'bold' }}><ShieldCheck size={18}/> Cierre</button>
        </div>
      </nav>

      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>Panel de Control G4S</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} size={18} />
              <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 15px 10px 40px', borderRadius: '12px', border: '1px solid #E2E8F0', width: '250px' }} />
            </div>
            <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer' }}><RefreshCw size={20} className={loading ? 'animate-spin' : ''}/></button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '30px' }}>
          <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#475569' }}>Cola de Eventos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map((log) => (
                <div key={log.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '4px', height: '40px', backgroundColor: log.tipo_evento?.includes('PÁNICO') ? '#E11D48' : '#10B981', borderRadius: '2px' }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: log.tipo_evento?.includes('PÁNICO') ? '#E11D48' : '#1E293B' }}>{log.tipo_evento}</div>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>{log.nombre_cliente}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Cuenta: {log.cuenta} • {log.fecha_evento}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => simulateEvent('FALSA ALARMA', log.nombre_cliente, log.cuenta)} style={{ padding: '6px 12px', border: '1px solid #F59E0B', borderRadius: '8px', color: '#F59E0B', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: 'transparent' }}>Anular</button>
                    <button onClick={() => simulateEvent('GESTIONADO', log.nombre_cliente, log.cuenta)} style={{ padding: '6px 12px', border: '1px solid #10B981', borderRadius: '8px', color: '#10B981', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: 'transparent' }}>Cerrar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div onClick={() => { setIsArmed(!isArmed); simulateEvent(isArmed ? 'DESARMADO APP' : 'ARMADO APP'); }} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px 24px', textAlign: 'center' as const, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: `8px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', backgroundColor: isArmed ? '#ECFDF5' : '#FFF1F2' }}>
                {isArmed ? <CheckCircle2 size={60} color="#10B981" /> : <XCircle size={60} color="#E11D48" />}
              </div>
              <h2 style={{ color: isArmed ? '#10B981' : '#E11D48', margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{isArmed ? 'ARMADO' : 'DESARMADO'}</h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '8px' }}>Clic para enviar comando</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
