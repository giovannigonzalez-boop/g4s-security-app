"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, Power, ShieldCheck, RefreshCw, 
  CheckCircle2, XCircle, ChevronRight, LogOut, AlertCircle 
} from 'lucide-react';

// Inicialización segura de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Page() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errorConn, setErrorConn] = useState(false);

  // CARGA DE DATOS DESDE SUPABASE
  const fetchG4SData = async () => {
    try {
      setLoading(true);
      if (!supabaseUrl || !supabaseAnonKey) {
        setErrorConn(true);
        return;
      }

      const { data, error } = await supabase
        .from('alarm_logs')
        .select('*')
        .order('id', { ascending: false })
        .limit(6);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Error capturado:", err);
      setErrorConn(true);
    } finally {
      setLoading(false);
    }
  };

  // SIMULACIÓN DE EVENTO
  const simulateEvent = async (tipo: string) => {
    try {
      const nuevo = {
        nombre_cliente: "G4S User",
        cuenta: "BAQ-3733",
        tipo_evento: tipo,
        ciudad: "Barranquilla",
        fecha_evento: new Date().toLocaleTimeString(),
      };
      
      const { error } = await supabase.from('alarm_logs').insert([nuevo]);
      if (error) throw error;
      fetchG4SData();
    } catch (err) {
      alert("Error al conectar con la base de datos");
    }
  };

  useEffect(() => {
    fetchG4SData();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR CON LOGOUT */}
      <nav style={{ width: '100px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '30px 10px', position: 'fixed', height: '100vh', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', width: '55px', height: '55px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)' }}>G4S</div>
          <div style={{ color: '#E11D48', textAlign: 'center' }}>
            <Home size={30} />
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '4px' }}>INICIO</div>
          </div>
        </div>

        <button onClick={() => window.location.reload()} style={{ border: 'none', backgroundColor: 'transparent', color: '#64748B', cursor: 'pointer', textAlign: 'center', marginBottom: '20px' }}>
          <LogOut size={30} color="#E11D48" />
          <div style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '4px', color: '#E11D48' }}>SALIR</div>
        </button>
      </nav>

      {/* CONTENIDO */}
      <main style={{ flex: 1, marginLeft: '100px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>Centro de Operaciones</h1>
          <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '50%', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer' }}>
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} color="#64748B" />
          </button>
        </header>

        {errorConn && (
          <div style={{ backgroundColor: '#FFF1F2', color: '#E11D48', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
            <AlertCircle size={20} /> Error de conexión con Supabase. Revisa las variables en Vercel.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px' }}>
          
          {/* WIDGET DE CONTROL */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulateEvent(isArmed ? 'DESARMADO' : 'ARMADO'); }}
              style={{ width: '180px', height: '180px', borderRadius: '50%', border: `10px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', backgroundColor: isArmed ? '#F0FFF4' : '#FFF5F5', cursor: 'pointer', transition: '0.3s' }}>
              {isArmed ? <CheckCircle2 size={80} color="#10B981" /> : <XCircle size={80} color="#E11D48" />}
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>Partición Principal</h2>
            <p style={{ color: isArmed ? '#10B981' : '#E11D48', fontWeight: 'bold', marginTop: '8px', fontSize: '18px' }}>{isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</p>
          </div>

          {/* SIMULADOR RÁPIDO */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#64748B', marginBottom: '20px' }}>Simulador de Central</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <button onClick={() => simulateEvent('ALERTA DE PÁNICO')} style={btnS}><Bell size={18} color="#E11D48"/> Generar Pánico</button>
              <button onClick={() => simulateEvent('APERTURA LOCAL')} style={btnS}><Power size={18} color="#10B981"/> Reportar Apertura</button>
              <button onClick={() => simulateEvent('CIERRE SISTEMA')} style={btnS}><ShieldCheck size={18} color="#3B82F6"/> Reportar Cierre</button>
            </div>
          </div>

          {/* LISTA DE ACTIVIDAD */}
          <div style={{ gridColumn: 'span 2', backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', marginBottom: '20px' }}>Actividad Reciente (Base de Datos)</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {!loading && logs.length > 0 ? logs.map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: log.tipo_evento?.includes('PÁNICO') ? '#FFF1F2' : '#F1F5F9' }}>
                      <ShieldCheck size={20} color="#64748B"/>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E293B' }}>{log.nombre_cliente}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>{log.fecha_evento} • {log.ciudad}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: log.tipo_evento?.includes('PÁNICO') ? '#E11D48' : '#475569' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>Cuenta: {log.cuenta}</div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                  {loading ? "Sincronizando con Supabase..." : "No se encontraron registros."}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const btnS = {
  padding: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '15px', 
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold' as const, color: '#334155', textAlign: 'left' as const
};
