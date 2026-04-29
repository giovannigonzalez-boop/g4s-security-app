"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, Power, ShieldCheck, RefreshCw, 
  CheckCircle2, XCircle, LogOut, AlertTriangle, ShieldOff, User, Lock
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- COMPONENTE DE PANTALLA DE LOGIN (SIMULADA CON LOGO G4S) ---
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(); // Simulación: cualquier credencial funciona
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F3F6', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' }}>
        
        {/* LOGO G4S OFICIAL REINTEGRADO (negro y rojo) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '32px', margin: '0 auto 30px auto', letterSpacing: '-1px' }}>
          <span style={{color: 'black'}}>G4S</span> 
          <span style={{color: '#E11D48', position:'relative', left:'-2px'}}>+</span> 
          <span style={{color: 'black', position:'relative', left:'-4px'}}>SECURITY</span>
        </div>
        
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1A1C21', marginBottom: '10px' }}>ARC Security Console</h1>
        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '40px' }}>Ingrese sus credenciales de operador</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '15px', top: '15px', color: '#A0AEC0' }} size={20} />
            <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} style={inputS} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '15px', top: '15px', color: '#A0AEC0' }} size={20} />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={inputS} />
          </div>
          <button type="submit" style={loginBtnS}>
            Ingresar al Panel
          </button>
        </form>
        <p style={{ color: '#A0AEC0', fontSize: '12px', marginTop: '40px' }}>© 2026 G4S ARC Security. Prototipo SOC.</p>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL (DASHBOARD) ---
function DashboardPage({ onLogout }: { onLogout: () => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchG4SData = async () => {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(8);
    if (data) setLogs(data);
    setLoading(false);
  };

  const simulateEvent = async (tipo: string, cli: string = "G4S ARC User", cta: string = "BAQ-3733") => {
    const { error } = await supabase.from('alarm_logs').insert([{
      nombre_cliente: cli, cuenta: cta, tipo_evento: tipo, ciudad: "Barranquilla", fecha_evento: new Date().toLocaleTimeString(),
    }]);
    if (!error) fetchG4SData();
  };

  useEffect(() => { fetchG4SData(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F7FA', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR CON LOGO OFICIAL */}
      <nav style={{ width: '90px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E8ECEF', padding: '30px 0', position: 'fixed', height: '100vh', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          {/* LOGO G4S OFICIAL EN SIDEBAR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', letterSpacing: '-0.5px' }}>
            <span style={{color: 'black'}}>G4</span> 
            <span style={{color: '#E11D48'}}>S</span>
          </div>
          <div style={{ color: '#E11D48', textAlign: 'center' }}><Home size={28} /><div style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '5px' }}>INICIO</div></div>
        </div>
        <div onClick={onLogout} style={{ color: '#718096', textAlign: 'center', cursor: 'pointer', marginBottom: '20px' }}>
          <LogOut size={28} /><div style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '5px' }}>SALIR</div>
        </div>
      </nav>

      <main style={{ flex: 1, marginLeft: '90px', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2D3748' }}>Dashboard Seguridad ARC</h1>
          <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''}/>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          {/* WIDGET ARMADO */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulateEvent(isArmed ? 'DESARMADO' : 'ARMADO'); }}
              style={{ width: '160px', height: '160px', borderRadius: '50%', border: `8px solid ${isArmed ? '#38A169' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', backgroundColor: isArmed ? '#F0FFF4' : '#FFF5F5', cursor: 'pointer' }}>
              {isArmed ? <CheckCircle2 size={60} color="#38A169" /> : <XCircle size={60} color="#E11D48" />}
            </div>
            <h2 style={{ fontSize: '20px', color: '#4A5568' }}>Partición Principal</h2>
            <p style={{ color: isArmed ? '#38A169' : '#E11D48', fontWeight: 'bold' }}>{isArmed ? 'ARMADO' : 'DESARMADO'}</p>
          </div>

          {/* SIMULADOR EXPRESS */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#718096', marginBottom: '20px' }}>Comandos SOC</h3>
            <div style={{ gridTemplateColumns: '1fr 1fr', gap: '15px', display: 'grid' }}>
              <button onClick={() => simulateEvent('PÁNICO')} style={simBtnS}><Bell color="#E11D48"/> Pánico</button>
              <button onClick={() => simulateEvent('APERTURA')} style={simBtnS}><Power color="#38A169"/> Apertura</button>
              <button onClick={() => simulateEvent('CIERRE')} style={simBtnS}><ShieldCheck color="#3182CE"/> Cierre</button>
              <button onClick={() => simulateEvent('TEST')} style={simBtnS}><RefreshCw color="#718096"/> Test</button>
            </div>
          </div>

          {/* ACTIVIDAD RECIENTE */}
          <div style={{ gridColumn: 'span 2', backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Cola de Eventos ARC</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {logs.map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F7FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: log.tipo_evento?.includes('PÁNICO') ? '#FFF5F5' : '#F0F4F8' }}>
                      {log.tipo_evento?.includes('PÁNICO') ? <AlertTriangle size={20} color="#E11D48"/> : <ShieldCheck size={20} color="#4A5568"/>}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{log.nombre_cliente}</div>
                      <div style={{ fontSize: '12px', color: '#A0AEC0' }}>{log.fecha_evento} • Barranquilla</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: log.tipo_evento?.includes('PÁNICO') ? '#E11D48' : '#4A5568' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '11px', color: '#CBD5E0' }}>Cuenta: {log.cuenta}</div>
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

// --- COMPONENTE CONTROLADOR (MANEJA EL ESTADO GENERAL) ---
export default function PageController() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Inicia sin loguear para mostrar el Login

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (confirm("¿Cerrar sesión de G4S Monitoring ARC?")) {
      setIsAuthenticated(false);
    }
  };

  return isAuthenticated ? (
    <DashboardPage onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}

// ESTILOS REUTILIZABLES
const inputS = { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#F8FAFC', boxSizing: 'border-box' as const };
const loginBtnS = { width: '100%', padding: '15px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 6px 15px rgba(225,29,72,0.2)' };
const simBtnS = { padding: '15px', backgroundColor: '#F8FAFC', border: '1px solid #EDF2F7', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' as const, color: '#4A5568', fontSize: '13px' };
