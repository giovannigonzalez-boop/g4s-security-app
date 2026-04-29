"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, Power, ShieldCheck, RefreshCw, 
  CheckCircle2, XCircle, LogOut, AlertTriangle, ShieldOff
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Page() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR DATOS
  const fetchG4SData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('alarm_logs')
      .select('*')
      .order('id', { ascending: false })
      .limit(8);
    if (data) setLogs(data);
    setLoading(false);
  };

  // 2. SIMULAR EVENTO
  const simulateEvent = async (tipo: string, cliente: string = "G4S User", cuenta: string = "BAQ-3733") => {
    const nuevo = {
      nombre_cliente: cliente,
      cuenta: cuenta,
      tipo_evento: tipo,
      ciudad: "Barranquilla",
      fecha_evento: new Date().toLocaleTimeString(),
    };
    const { error } = await supabase.from('alarm_logs').insert([nuevo]);
    if (!error) fetchG4SData();
  };

  // 3. LOGOUT FUNCIONAL
  const handleLogout = () => {
    if (confirm("¿Cerrar sesión de G4S Monitoring?")) {
      window.location.href = "https://g4s.com"; // O la página que prefieras
    }
  };

  useEffect(() => { fetchG4SData(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F7FA', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <nav style={{ width: '90px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E8ECEF', padding: '30px 0', position: 'fixed', height: '100vh', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '35px' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(225,29,72,0.3)' }}>G4S</div>
          <Home size={28} color="#E11D48" style={{ cursor: 'pointer' }} />
        </div>
        {/* BOTÓN SALIR CORREGIDO */}
        <button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', marginBottom: '20px', textAlign: 'center' }}>
          <LogOut size={30} color="#E11D48" />
          <div style={{ fontSize: '10px', color: '#E11D48', fontWeight: 'bold' }}>SALIR</div>
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, marginLeft: '90px', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Panel de Control G4S</h1>
          <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '50%', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer' }}>
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          
          {/* WIDGET ARMADO */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '35px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulateEvent(isArmed ? 'DESARMADO' : 'ARMADO'); }}
              style={{ width: '150px', height: '150px', borderRadius: '50%', border: `8px solid ${isArmed ? '#38A169' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', backgroundColor: isArmed ? '#F0FFF4' : '#FFF5F5', cursor: 'pointer' }}>
              {isArmed ? <CheckCircle2 size={60} color="#38A169" /> : <XCircle size={60} color="#E11D48" />}
            </div>
            <h2 style={{ fontSize: '20px', color: '#4A5568' }}>Partición Principal</h2>
            <p style={{ color: isArmed ? '#38A169' : '#E11D48', fontWeight: 'bold' }}>{isArmed ? 'ARMADO' : 'DESARMADO'}</p>
          </div>

          {/* SIMULADOR DE SEÑALES */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', color: '#718096', marginBottom: '15px' }}>Simular Evento</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              <button onClick={() => simulateEvent('ALERTA DE PÁNICO')} style={btnStyle}><Bell size={18} color="#E11D48"/> Simular Pánico</button>
              <button onClick={() => simulateEvent('TEST PERIÓDICO')} style={btnStyle}><RefreshCw size={18} color="#718096"/> Enviar Test</button>
            </div>
          </div>

          {/* LISTA DE ACTIVIDAD CON FALSA ALARMA */}
          <div style={{ gridColumn: 'span 2', backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Actividad Reciente</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {logs.map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F7FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: log.tipo_evento?.includes('PÁNICO') ? '#FFF5F5' : '#F0F4F8' }}>
                      {log.tipo_evento?.includes('PÁNICO') ? <AlertTriangle size={20} color="#E11D48"/> : <ShieldCheck size={20} color="#4A5568"/>}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{log.nombre_cliente}</div>
                      <div style={{ fontSize: '12px', color: '#A0AEC0' }}>{log.fecha_evento} • {log.ciudad}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: log.tipo_evento?.includes('PÁNICO') ? '#E11D48' : '#4A5568' }}>{log.tipo_evento}</div>
                      <div style={{ fontSize: '11px', color: '#CBD5E0' }}>Cuenta: {log.cuenta}</div>
                    </div>
                    {/* BOTÓN FALSA ALARMA PARA PÁNICOS */}
                    {log.tipo_evento?.includes('PÁNICO') && (
                      <button 
                        onClick={() => simulateEvent('FALSA ALARMA (ANULADA)', log.nombre_cliente, log.cuenta)}
                        style={{ padding: '8px 12px', backgroundColor: '#FFF5F5', border: '1px solid #E11D48', color: '#E11D48', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <ShieldOff size={14} /> Falsa Alarma
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const btnStyle = {
  padding: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', 
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold' as const, color: '#334155'
};
