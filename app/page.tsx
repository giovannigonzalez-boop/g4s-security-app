"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Lock, User, ShieldAlert
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SUnifiedPremium() {
  const [session, setSession] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  // Identificar si hay algún pánico activo en la lista actual
  const panicoActivo = logs.find(log => log.tipo_evento === 'PÁNICO');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'G4S2026*') {
      setSession(true);
    } else {
      alert('Credenciales incorrectas.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(7);
    if (data) setLogs(data);
    setLoading(false);
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const anularSenal = async () => {
    if (!panicoActivo) return;
    const { error } = await supabase
      .from('alarm_logs')
      .update({ tipo_evento: 'FALSA ALARMA ANULADA' })
      .eq('id', panicoActivo.id);
    
    if (!error) fetchData();
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`, '_blank');
  };

  if (!session) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '28px', width: '360px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 24px' }}>G4S</div>
          <h2 style={{ color: '#1E293B', marginBottom: '8px' }}>Security Console</h2>
          <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '80px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ color: '#E11D48', fontWeight: 'bold', fontSize: '20px', marginBottom: '40px' }}>G4S</div>
        <Home size={24} color="#E11D48" />
        <div style={{ flex: 1 }} />
        <LogOut size={24} color="#94A3B8" onClick={() => setSession(false)} style={{ cursor: 'pointer', marginBottom: '30px' }} />
      </aside>

      <main style={{ flex: 1, marginLeft: '80px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
        <section>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '32px' }}>Centro de Operaciones ARC</h1>
          
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Señales Entrantes</h3>
              <RefreshCw size={18} color="#94A3B8" onClick={fetchData} className={loading ? 'animate-spin' : ''} style={{ cursor: 'pointer' }} />
            </div>
            {logs.map((log) => (
              <div key={log.id} onClick={() => log.latitud && setCoords({lat: log.latitud, lng: log.longitud})} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {log.tipo_evento?.includes('PÁNICO') ? <AlertTriangle color="#E11D48" /> : <ShieldCheck color="#10B981" />}
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{log.fecha_evento} • CTA: {log.cuenta}</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: log.tipo_evento?.includes('ANULADA') ? '#94A3B8' : '#10B981', fontWeight: 'bold' }}>
                  {log.tipo_evento?.includes('ANULADA') ? 'ARCHIVADO' : 'RECIBIDO'}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* BOTÓN 1: ESTADO ARMADO */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '28px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div onClick={() => setIsArmed(!isArmed)} style={{ width: '100px', height: '100px', borderRadius: '50%', border: `4px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', cursor: 'pointer', backgroundColor: isArmed ? '#F0FDF4' : '#FEF2F2' }}>
              {isArmed ? <CheckCircle2 size={45} color="#10B981" /> : <XCircle size={45} color="#E11D48" />}
            </div>
            <strong style={{ fontSize: '14px', color: isArmed ? '#10B981' : '#E11D48' }}>{isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</strong>
          </div>

          {/* BOTÓN 2: CONTROL DE PÁNICO DINÁMICO */}
          {panicoActivo ? (
            <div style={{ backgroundColor: '#FFF1F2', padding: '30px', borderRadius: '28px', textAlign: 'center', border: '2px solid #E11D48', animation: 'pulse 2s infinite' }}>
              <div onClick={anularSenal} style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', cursor: 'pointer', boxShadow: '0 0 20px rgba(225, 29, 72, 0.4)' }}>
                <ShieldAlert size={45} color="white" />
              </div>
              <strong style={{ fontSize: '14px', color: '#E11D48' }}>ANULAR PÁNICO ACTUAL</strong>
              <p style={{ fontSize: '11px', color: '#E11D48', margin: '5px 0 0' }}>Señal detectada: {panicoActivo.fecha_evento}</p>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '28px', textAlign: 'center', opacity: 0.5, border: '1px dashed #E2E8F0' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                <ShieldCheck size={45} color="#94A3B8" />
              </div>
              <strong style={{ fontSize: '14px', color: '#94A3B8' }}>SIN ALERTAS ACTIVAS</strong>
            </div>
          )}

          {/* MAPA */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <MapPin size={18} color="#E11D48" />
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Ubicación Google Maps</span>
            </div>
            <div onClick={openGoogleMaps} style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
              <img src={`https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=14&l=map&size=350,200&pt=${coords.lng},${coords.lat},pm2rdl`} style={{ width: '100%' }} alt="Mapa" />
            </div>
          </div>
        </aside>
      </main>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
