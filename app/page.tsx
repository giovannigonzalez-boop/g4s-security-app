"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Shield, Home, Bell, Power, ShieldCheck, RefreshCw, 
  CheckCircle2, XCircle, Search, LogOut, ShieldOff, AlertTriangle 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- PANTALLA DE LOGIN ---
function LoginPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '24px', margin: '0 auto 20px' }}>G4S</div>
        <h2 style={{ marginBottom: '20px' }}>Ingreso Seguro</h2>
        <input type="text" placeholder="Usuario" style={inputStyle} />
        <input type="password" placeholder="Contraseña" style={inputStyle} />
        <button onClick={onLogin} style={{ width: '100%', padding: '12px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Entrar</button>
      </div>
    </div>
  );
}

// --- DASHBOARD PRINCIPAL ---
function DashboardPage({ onLogout }: { onLogout: () => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchG4SData = async () => {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(8);
    if (data) setLogs(data);
    setLoading(false);
  };

  const simulateEvent = async (tipo: string, cliente: string = "G4S User", cuenta: string = "BAQ-3733") => {
    const nuevo = { nombre_cliente: cliente, cuenta: cuenta, tipo_evento: tipo, ciudad: "Barranquilla", fecha_evento: new Date().toLocaleTimeString() };
    const { error } = await supabase.from('alarm_logs').insert([nuevo]);
    if (!error) fetchG4SData();
  };

  useEffect(() => { fetchG4SData(); }, []);

  // Lógica de búsqueda corregida
  const filteredLogs = logs.filter(log => 
    log.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.cuenta?.toString().includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <nav style={{ width: '260px', backgroundColor: '#FFFFFF', padding: '30px 20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #E5E7EB', position: 'fixed', height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '10px', borderRadius: '8px' }}><Shield size={24}/></div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>G4S <span style={{fontWeight:'400'}}>SECURITY</span></div>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#FEE2E2', color: '#E11D48', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            <Home size={20}/> Panel de Control
          </div>
          <p style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 'bold', marginTop: '30px', textTransform: 'uppercase' }}>Acciones Rápidas</p>
          <button onClick={() => simulateEvent('ALERTA DE PÁNICO')} style={actionBtn}><Bell size={18} color="#E11D48"/> Simular Pánico</button>
          <button onClick={() => simulateEvent('TEST DE RED')} style={actionBtn}><RefreshCw size={18} color="#6B7280"/> Enviar Test</button>
        </div>

        {/* BOTÓN SALIR REINTEGRADO */}
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: 'none', backgroundColor: 'transparent', color: '#E11D48', fontWeight: 'bold', cursor: 'pointer', borderTop: '1px solid #F3F4F6' }}>
          <LogOut size={20}/> Cerrar Sesión
        </button>
      </nav>

      {/* CONTENIDO */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Cola de Monitoreo</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#9CA3AF' }} size={18} />
              <input 
                type="text" 
                placeholder="Buscar cuenta o cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #D1D5DB', width: '250px' }} 
              />
            </div>
            <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} color="#6B7280" />
            </button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px' }}>
          
          {/* LISTA DE EVENTOS */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Señales en Tiempo Real</h3>
            {filteredLogs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: log.tipo_evento?.includes('PÁNICO') ? '#FFF1F2' : '#F3F4F6' }}>
                    {log.tipo_evento?.includes('PÁNICO') ? <AlertTriangle size={20} color="#E11D48"/> : <ShieldCheck size={20} color="#6B7280"/>}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.nombre_cliente}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{log.fecha_evento} • Cuenta: {log.cuenta}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: log.tipo_evento?.includes('PÁNICO') ? '#E11D48' : '#374151' }}>{log.tipo_evento}</span>
                  {/* BOTÓN FALSA ALARMA REINTEGRADO */}
                  {log.tipo_evento?.includes('PÁNICO') && (
                    <button 
                      onClick={() => simulateEvent('FALSA ALARMA (ANULADA)', log.nombre_cliente, log.cuenta)}
                      style={{ padding: '6px 12px', backgroundColor: '#FFF1F2', border: '1px solid #E11D48', color: '#E11D48', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Falsa Alarma
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* WIDGET ARMADO */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulateEvent(isArmed ? 'DESARMADO' : 'ARMADO'); }}
              style={{ width: '160px', height: '160px', borderRadius: '50%', border: `10px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', backgroundColor: isArmed ? '#ECFDF5' : '#FFF1F2', cursor: 'pointer' }}>
              {isArmed ? <CheckCircle2 size={70} color="#10B981" /> : <XCircle size={70} color="#E11D48" />}
            </div>
            <h2 style={{ color: isArmed ? '#10B981' : '#E11D48', margin: 0 }}>{isArmed ? 'ARMADO' : 'DESARMADO'}</h2>
            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '10px' }}>Partición Principal</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// CONTROLADOR DE ESTADO
export default function Page() {
  const [auth, setAuth] = useState(true);
  return auth ? <DashboardPage onLogout={() => setAuth(false)} /> : <LoginPage onLogin={() => setAuth(true)} />;
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #D1D5DB', boxSizing: 'border-box' as const };
const actionBtn = { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#374151', fontSize: '14px' };
