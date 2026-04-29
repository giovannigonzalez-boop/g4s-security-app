"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Shield, Home, Bell, Power, ShieldCheck, RefreshCw, 
  CheckCircle2, XCircle, Search, LogOut, ShieldOff, AlertTriangle, User, Lock
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- COMPONENTE CONTROLADOR ---
export default function PageController() {
  const [isAuth, setIsAuth] = useState(false); // Inicia en falso para mostrar el Login pro
  return isAuth ? <Dashboard onLogout={() => setIsAuth(false)} /> : <Login onLogin={() => setIsAuth(true)} />;
}

// --- PANTALLA DE ACCESO (LOGIN PRO) ---
function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F3F6', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' }}>
        
        {/* LOGO G4S ARC SECURITY */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '32px', margin: '0 auto 30px auto', letterSpacing: '-1.5px' }}>
          <span style={{color: 'black'}}>G4S</span> 
          <span style={{color: '#E11D48', marginLeft: '2px'}}>ARC</span>
        </div>
        
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1A1C21', marginBottom: '10px' }}>Security Console</h1>
        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '40px' }}>Ingresa tus credenciales de operador</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '15px', top: '15px', color: '#A0AEC0' }} size={20} />
            <input type="text" placeholder="Nombre de usuario" style={inputS} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '15px', top: '15px', color: '#A0AEC0' }} size={20} />
            <input type="password" placeholder="Contraseña" style={inputS} />
          </div>
          <button onClick={onLogin} style={loginBtnS}>
            Ingresar al Sistema
          </button>
        </div>
        <p style={{ color: '#A0AEC0', fontSize: '12px', marginTop: '40px' }}>© 2026 G4S ARC Security. SOC Operations.</p>
      </div>
    </div>
  );
}

// --- DASHBOARD (PANEL DE CONTROL) ---
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(10);
    if (data) setLogs(data);
    setLoading(false);
  };

  const simulate = async (tipo: string, cli: string = "G4S User", cta: string = "BAQ-3733") => {
    const { error } = await supabase.from('alarm_logs').insert([{ 
      nombre_cliente: cli, cuenta: cta, tipo_evento: tipo, ciudad: "Barranquilla", fecha_evento: new Date().toLocaleTimeString() 
    }]);
    if (!error) fetchData();
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = logs.filter(l => 
    String(l.nombre_cliente || "").toLowerCase().includes(search.toLowerCase()) ||
    String(l.cuenta || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <nav style={{ width: '280px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', padding: '30px 20px', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>G4S</div>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#1E293B', lineHeight: '1' }}>ARC<br/><span style={{color:'#E11D48', fontSize:'12px'}}>SECURITY</span></div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#FEE2E2', color: '#E11D48', borderRadius: '10px', fontWeight: 'bold', marginBottom: '30px' }}><Home size={20}/> Consola SOC</div>
          
          <button onClick={() => simulate('ALERTA DE PÁNICO')} style={navBtn}><Bell size={18} color="#E11D48"/> Simular Pánico</button>
          <button onClick={() => simulate('TEST PERIÓDICO')} style={navBtn}><RefreshCw size={18} color="#64748B"/> Enviar Test</button>
        </div>

        <button onClick={onLogout} style={{ border: 'none', background: 'none', borderTop: '1px solid #F1F5F9', padding: '20px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#E11D48', fontWeight: 'bold', cursor: 'pointer' }}>
          <LogOut size={22}/> Salir del Sistema
        </button>
      </nav>

      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800' }}>Centro de Operaciones</h1>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} size={18} />
            <input type="text" placeholder="Buscar por cuenta o cliente..." value={search} onChange={(e)=>setSearch(e.target.value)} style={{ padding: '12px 15px 12px 40px', borderRadius: '12px', border: '1px solid #E2E8F0', width: '300px' }} />
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '20px' }}>Señales Entrantes</h3>
            {filtered.map(l => {
              const isPanic = l.tipo_evento?.toLowerCase().includes('pánico') || l.tipo_evento?.toLowerCase().includes('panico');
              return (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: isPanic ? '#FFF1F2' : '#F1F5F9' }}>
                      {isPanic ? <AlertTriangle size={20} color="#E11D48"/> : <ShieldCheck size={20} color="#64748B"/>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{l.nombre_cliente}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>CTA: {l.cuenta} • {l.fecha_evento}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: isPanic ? '#E11D48' : '#334155' }}>{l.tipo_evento}</span>
                    {isPanic && (
                      <button onClick={() => simulate('FALSA ALARMA ANULADA', l.nombre_cliente, l.cuenta)} style={{ padding: '8px 12px', backgroundColor: '#FFF1F2', color: '#E11D48', border: '1px solid #E11D48', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Falsa Alarma</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulate(isArmed ? 'DESARMADO' : 'ARMADO'); }} style={{ width: '160px', height: '160px', borderRadius: '50%', border: `10px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', backgroundColor: isArmed ? '#ECFDF5' : '#FFF1F2', cursor: 'pointer' }}>
              {isArmed ? <CheckCircle2 size={70} color="#10B981" /> : <XCircle size={70} color="#E11D48" />}
            </div>
            <h2 style={{ color: isArmed ? '#10B981' : '#E11D48', margin: 0 }}>{isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</h2>
          </div>
        </div>
      </main>
    </div>
  );
}

// ESTILOS DE LA PANTALLA BONITA
const inputS = { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#F8FAFC', boxSizing: 'border-box' as const };
const loginBtnS = { width: '100%', padding: '15px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 6px 15px rgba(225,29,72,0.2)' };
const navBtn = { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', border: 'none', background: 'none', cursor: 'pointer', color: '#334155', fontWeight: '500' };
