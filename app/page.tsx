"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, Power, ShieldCheck, RefreshCw, Search, 
  AlertTriangle, CheckCircle2, XCircle, ChevronRight, LogOut, Settings
} from 'lucide-react';

// Conexión directa usando las variables de Vercel
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Page() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(false);

  // FUNCIÓN DE CARGA REFORZADA
  async function fetchG4SData() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alarm_logs')
        .select('*')
        .order('id', { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error de Supabase:", error.message);
      } else {
        setLogs(data || []);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    } finally {
      setLoading(false);
    }
  }

  // FUNCIÓN DE SIMULACIÓN
  async function simulateEvent(tipo: string) {
    const nuevo = {
      nombre_cliente: "G4S User - Prueba",
      cuenta: "BAQ-3733",
      tipo_evento: tipo,
      ciudad: "Barranquilla",
      fecha_evento: new Date().toLocaleTimeString(),
    };
    
    const { error } = await supabase.from('alarm_logs').insert([nuevo]);
    if (error) alert("Error al insertar: " + error.message);
    else fetchG4SData();
  }

  useEffect(() => {
    fetchG4SData();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F7FA', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <nav style={{ width: '90px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E8ECEF', padding: '30px 0', position: 'fixed', height: '100vh', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(225, 29, 72, 0.3)' }}>G4S</div>
          <div style={{ color: '#E11D48', textAlign: 'center' }}><Home size={28} /><div style={{ fontSize: '10px', fontWeight: 'bold' }}>INICIO</div></div>
        </div>
        <div onClick={() => window.location.reload()} style={{ color: '#718096', textAlign: 'center', cursor: 'pointer', marginBottom: '20px' }}>
          <LogOut size={28} /><div style={{ fontSize: '10px', fontWeight: 'bold' }}>SALIR</div>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main style={{ flex: 1, marginLeft: '90px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2D3748' }}>G4S Monitoring System</h1>
          <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''}/>
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          
          {/* WIDGET ARMADO */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulateEvent(isArmed ? 'DESARMADO' : 'ARMADO'); }}
              style={{ width: '160px', height: '160px', borderRadius: '50%', border: `8px solid ${isArmed ? '#38A169' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', backgroundColor: isArmed ? '#F0FFF4' : '#FFF5F5', cursor: 'pointer' }}>
              {isArmed ? <CheckCircle2 size={60} color="#38A169" /> : <XCircle size={60} color="#E11D48" />}
            </div>
            <h2 style={{ fontSize: '20px', color: '#4A5568', margin: 0 }}>Partición 1</h2>
            <h3 style={{ color: isArmed ? '#38A169' : '#E11D48', fontWeight: 'bold', marginTop: '10px' }}>{isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</h3>
          </div>

          {/* COMANDOS */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#718096', marginBottom: '20px' }}>Simular Señal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <button onClick={() => simulateEvent('ALERTA DE PÁNICO')} style={btnStyle}><Bell size={18} color="#E11D48"/> Pánico</button>
              <button onClick={() => simulateEvent('APERTURA LOCAL')} style={btnStyle}><Power size={18} color="#38A169"/> Apertura</button>
              <button onClick={() => simulateEvent('CIERRE SISTEMA')} style={btnStyle}><ShieldCheck size={18} color="#3182CE"/> Cierre</button>
              <button onClick={() => simulateEvent('TEST DE RED')} style={btnStyle}><RefreshCw size={18} color="#718096"/> Test</button>
            </div>
          </div>

          {/* ACTIVIDAD RECIENTE (Aquí conectamos la BD) */}
          <div style={{ gridColumn: 'span 2', backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2D3748', marginBottom: '20px' }}>Actividad de la Base de Datos</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {logs.length > 0 ? logs.map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F7FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#F0F4F8' }}>
                      <ShieldCheck size={20} color="#4A5568"/>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{log.nombre_cliente}</div>
                      <div style={{ fontSize: '12px', color: '#A0AEC0' }}>{log.fecha_evento} • {log.ciudad}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '11px', color: '#CBD5E0' }}>Cuenta: {log.cuenta}</div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#A0AEC0' }}>
                  {loading ? "Cargando datos..." : "No se encontraron señales en Supabase"}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const btnStyle = {
  padding: '15px', backgroundColor: '#F8FAFC', border: '1px solid #EDF2F7', borderRadius: '16px', 
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' as const, color: '#4A5568'
};
