"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Lock, User, ShieldAlert, Radio
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SFinalMasterPanel() {
  const [session, setSession] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  const panicoActivo = logs.find(log => log.tipo_evento === 'PÁNICO');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'G4S2026*') {
      setSession(true);
    } else {
      alert('Credenciales incorrectas.');
    }
  };

  // --- FUNCIÓN DE ACTUALIZACIÓN CORREGIDA ---
  const fetchData = async () => {
    setLoading(true);
    // Añadimos un pequeño delay para que el usuario perciba la actualización
    await new Promise(resolve => setTimeout(resolve, 600));

    const { data, error } = await supabase
      .from('alarm_logs')
      .select('*')
      .order('id', { ascending: false })
      .limit(7);
    
    if (data && !error) {
      setLogs(data);
      // Si hay un evento nuevo, centrar el mapa en él
      if (data[0]?.latitud) {
        setCoords({ lat: data[0].latitud, lng: data[0].longitud });
      }
    }
    setLoading(false);
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const simularPanico = async () => {
    const cuentas = ["BAQ-3733", "BAQ-4500", "BAQ-1288", "BAQ-9901", "BAQ-7722"];
    const nombres = ["Residencia Premium", "Bodega Central G4S", "Local Comercial 14", "Zona Residencial Norte", "Sede Administrativa"];
    const index = Math.floor(Math.random() * cuentas.length);

    const lat = 10.93 + (Math.random() * 0.08);
    const lng = -74.80 + (Math.random() * 0.08);
    
    const { error } = await supabase.from('alarm_logs').insert([{ 
      nombre_cliente: nombres[index], 
      cuenta: cuentas[index], 
      tipo_evento: 'PÁNICO', 
      fecha_evento: new Date().toLocaleTimeString(),
      latitud: lat,
      longitud: lng
    }]);

    if (!error) fetchData();
  };

  const anularSenal = async () => {
    if (!panicoActivo) return;
    setLoading(true);
    await supabase.from('alarm_logs').update({ tipo_evento: 'FALSA ALARMA ANULADA' }).eq('id', panicoActivo.id);
    await fetchData();
  };

  const G4SLogo = ({ size = "normal" }) => (
    <div style={{ backgroundColor: '#E11D48', color: 'white', padding: size === "large" ? '15px 25px' : '10px 15px', borderRadius: '8px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)', minWidth: size === "large" ? '120px' : '70px' }}>
      <span style={{ fontSize: size === "large" ? '32px' : '20px', fontWeight: '900', lineHeight: 0.9 }}>G4S</span>
      <span style={{ fontSize: size === "large" ? '14px' : '10px', fontWeight: 'bold', letterSpacing: '3px', marginTop: '2px', borderTop: '1px solid rgba(255,255,255,0.3)', width: '100%', textAlign: 'center' }}>ARC</span>
    </div>
  );

  if (!session) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#FFFFFF', padding: '50px 40px', borderRadius: '32px', width: '380px', textAlign: 'center' }}>
          <div style={{ marginBottom: '30px' }}><G4SLogo size="large" /></div>
          <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>INGRESAR</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '110px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ marginBottom: '50px' }}><G4SLogo size="normal" /></div>
        <div style={{ backgroundColor: '#FFF1F2', padding: '12px', borderRadius: '15px', marginBottom: '25px' }}><Home size={28} color="#E11D48" /></div>
        
        <div onClick={simularPanico} style={{ cursor: 'pointer', padding: '12px', borderRadius: '15px', color: '#94A3B8' }} title="Simular Nueva Alerta">
          <Radio size={28} />
        </div>

        <div style={{ flex: 1 }} />
        <LogOut size={26} color="#94A3B8" onClick={() => setSession(false)} style={{ cursor: 'pointer', marginBottom: '30px' }} />
      </aside>

      <main style={{ flex: 1, marginLeft: '110px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <section>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', marginBottom: '32px' }}>Log de Activaciones</h1>
          <div style={{ backgroundColor: 'white', borderRadius: '28px', padding: '35px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Historial en Tiempo Real</h3>
              
              {/* BOTÓN REFRESH CORREGIDO */}
              <button 
                onClick={fetchData} 
                disabled={loading}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <RefreshCw 
                  size={24} 
                  color="#E11D48" 
                  style={{ 
                    transition: 'transform 0.5s ease',
                    transform: loading ? 'rotate(360deg)' : 'rotate(0deg)',
                  }}
                  className={loading ? 'animate-spin' : ''}
                />
              </button>
            </div>
            
            {logs.map((log) => (
              <div key={log.id} onClick={() => log.latitud && setCoords({lat: log.latitud, lng: log.longitud})} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: '18px' }}>
                  <div style={{ backgroundColor: log.tipo_evento?.includes('PÁNICO') ? '#FFF1F2' : '#F0FDF4', padding: '12px', borderRadius: '12px' }}>
                    {log.tipo_evento?.includes('PÁNICO') ? <AlertTriangle size={22} color="#E11D48" /> : <ShieldCheck size={22} color="#10B981" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>{log.fecha_evento} • CTA: {log.cuenta}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: log.tipo_evento?.includes('ANULADA') ? '#94A3B8' : '#10B981', fontWeight: '900' }}>{log.tipo_evento?.includes('ANULADA') ? 'ARCHIVADO' : 'RECIBIDO'}</div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '32px', textAlign: 'center' }}>
            <div onClick={() => setIsArmed(!isArmed)} style={{ width: '120px', height: '120px', borderRadius: '50%', border: `6px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', cursor: 'pointer', backgroundColor: isArmed ? '#F0FDF4' : '#FEF2F2' }}>
              {isArmed ? <CheckCircle2 size={55} color="#10B981" /> : <XCircle size={55} color="#E11D48" />}
            </div>
            <strong style={{ fontSize: '16px', color: isArmed ? '#10B981' : '#E11D48' }}>SISTEMA ARMADO</strong>
          </div>

          {panicoActivo ? (
            <div style={{ backgroundColor: '#FFF1F2', padding: '35px', borderRadius: '32px', textAlign: 'center', border: '2px solid #E11D48', animation: 'pulse 2s infinite' }}>
              <div onClick={anularSenal} style={{ width: '110px', height: '110px', borderRadius: '50%', backgroundColor: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', cursor: 'pointer', boxShadow: '0 12px 24px rgba(225, 29, 72, 0.4)' }}>
                <ShieldAlert size={50} color="white" />
              </div>
              <strong style={{ fontSize: '15px', color: '#E11D48' }}>ANULAR ALERTA PÁNICO</strong>
              <p style={{ fontSize: '11px', color: '#E11D48', marginTop: '5px' }}>Cuenta: {panicoActivo.cuenta}</p>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '32px', textAlign: 'center', opacity: 0.6, border: '2px dashed #E2E8F0' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                <ShieldCheck size={45} color="#94A3B8" />
              </div>
              <strong style={{ fontSize: '14px', color: '#94A3B8' }}>SIN ALERTAS ACTIVAS</strong>
            </div>
          )}

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <MapPin size={20} color="#E11D48" />
              <span style={{ fontWeight: '800', fontSize: '14px' }}>UBICACIÓN DE SEÑAL</span>
            </div>
            <div onClick={() => window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank')} style={{ borderRadius: '20px', overflow: 'hidden', cursor: 'pointer' }}>
              <img src={`https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=14&l=map&size=400,250&pt=${coords.lng},${coords.lat},pm2rdl`} style={{ width: '100%', display: 'block' }} alt="Ubicación señal" />
            </div>
          </div>
        </aside>
      </main>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
          70% { transform: scale(1.04); box-shadow: 0 0 0 20px rgba(225, 29, 72, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
