"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Shield, Home, Bell, Power, ShieldCheck, RefreshCw, 
  CheckCircle2, XCircle, Search, LogOut, AlertTriangle 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- CONTROLADOR DE ESTADO ---
export default function PageController() {
  const [isAuth, setIsAuth] = useState(true);
  return isAuth ? <Dashboard onLogout={() => setIsAuth(false)} /> : <Login onLogin={() => setIsAuth(true)} />;
}

// --- PANTALLA DE LOGIN ---
function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '380px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', width: '70px', height: '70px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '24px', margin: '0 auto 25px' }}>G4S</div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>ARC SECURITY</h2>
        <button onClick={onLogin} style={{ width: '100%', padding: '14px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Ingresar</button>
      </div>
    </div>
  );
}

// --- DASHBOARD ---
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

  // Lógica de búsqueda
  const filtered = logs.filter(l => 
    String(l.nombre_cliente || "").toLowerCase().includes(search.toLowerCase()) ||
    String(l.cuenta || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <nav style={{ width: '280px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', padding: '30px 20px', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>G4S</div>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#1E293B', lineHeight: '1' }}>ARC<br/><span style={{color:'#E11D48', fontSize:'12px'}}>SECURITY</span></div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#FEE2E2', color: '#E11D48', borderRadius: '10px', fontWeight: 'bold', marginBottom: '30px' }}><Home size={20}/> Panel Central</div>
          
          <button onClick={() => simulate('ALERTA DE PÁNICO')} style={navBtn}><Bell size={18} color="#E11D48"/> Simular Pánico</button>
          <button onClick={() => simulate('TEST')} style={navBtn}><RefreshCw size={18} color="#64748B"/> Enviar Test</button>
        </div>

        <button onClick={onLogout} style={{ border: 'none', background: 'none', borderTop: '1px solid #F1F5F9', padding: '20px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#E11D48', fontWeight: 'bold', cursor: 'pointer' }}>
          <LogOut size={22}/> Salir
        </button>
      </nav>

      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800' }}>Centro de Operaciones</h1>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} size={18} />
            <input type="text" placeholder="Buscar cuenta..." value={search} onChange={(e)=>setSearch(e.target.value)} style={{ padding: '12px 15px 12px 40px', borderRadius: '12px', border: '1px solid #E2E8F0', width: '300px' }} />
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
          
          {/* LISTA DE ACTIVIDAD */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '20px' }}>Señales Entrantes</h3>
            {filtered.map(l => {
              // Lógica de detección de pánico mejorada
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
                    
                    {/* BOTÓN FALSA ALARMA CON LÓGICA CORREGIDA */}
                    {isPanic && (
                      <button 
                        onClick={() => simulate('FALSA ALARMA ANULADA', l.nombre_cliente, l.cuenta)}
                        style={{ padding: '8px 12px', backgroundColor: '#FFF1F2', color: '#E11D48', border: '1px solid #E11D48', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Falsa Alarma
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* WIDGET ARMADO */}
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

const navBtn = { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', border: 'none', background: 'none', cursor: 'pointer', color: '#334155', fontWeight: '500' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #E2E8F0', boxSizing: 'border-box' as const };
