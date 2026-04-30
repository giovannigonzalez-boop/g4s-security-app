"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Lock, User 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SPremiumPanel() {
  const [session, setSession] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación de credenciales corporativas
    if (username.toLowerCase() === 'admin' && password === 'G4S2024') {
      setSession(true);
    } else {
      alert('Credenciales incorrectas. Verifique usuario y contraseña.');
    }
  };

  const fetchData = async () => {
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(6);
    if (data) setLogs(data);
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank');
  };

  // --- VISTA DE LOGIN CORPORATIVO (Punto 1: Entorno Bonito) ---
  if (!session) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '28px', width: '360px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 24px' }}>G4S</div>
          <h2 style={{ color: '#1E293B', marginBottom: '8px', fontSize: '22px' }}>Security Console</h2>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '32px' }}>Ingrese las credenciales de operador</p>
          
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <User size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94A3B8' }} />
            <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }} />
          </div>

          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94A3B8' }} />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'background 0.2s' }}>Ingresar al Sistema</button>
          <p style={{ marginTop: '24px', fontSize: '11px', color: '#94A3B8' }}>© 2024 G4S ARC Security. SOC Operations.</p>
        </form>
      </div>
    );
  }

  // --- VISTA PANEL PRINCIPAL ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '80px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ color: '#E11D48', fontWeight: 'bold', fontSize: '20px', marginBottom: '40px' }}>G4S</div>
        <div style={{ backgroundColor: '#FFF1F2', padding: '12px', borderRadius: '12px' }}><Home size={24} color="#E11D48" /></div>
        <div style={{ flex: 1 }} />
        <LogOut size={24} color="#94A3B8" onClick={() => setSession(false)} style={{ cursor: 'pointer', marginBottom: '30px' }} />
      </aside>

      <main style={{ flex: 1, marginLeft: '80px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
        <section>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Centro de Operaciones ARC</h1>
            <p style={{ color: '#64748B', marginTop: '4px' }}>Monitoreo de señales en tiempo real</p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: '#1E293B' }}>Señales Entrantes</h3>
              <RefreshCw size={18} color="#94A3B8" onClick={fetchData} style={{ cursor: 'pointer' }} />
            </div>
            {logs.map((log) => (
              <div key={log.id} onClick={() => log.latitud && setCoords({lat: log.latitud, lng: log.longitud})} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', borderRadius: '12px', transition: 'background 0.2s' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ backgroundColor: log.tipo_evento?.includes('PÁNICO') ? '#FFF1F2' : '#F0FDF4', padding: '10px', borderRadius: '10px' }}>
                    {log.tipo_evento?.includes('PÁNICO') ? <AlertTriangle size={20} color="#E11D48" /> : <ShieldCheck size={20} color="#10B981" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1E293B' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{log.fecha_evento} • CTA: {log.cuenta}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10B981' }}>PROCESADO</div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '28px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div onClick={() => setIsArmed(!isArmed)} style={{ width: '120px', height: '120px', borderRadius: '50%', border: `4px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', cursor: 'pointer', backgroundColor: isArmed ? '#F0FDF4' : '#FEF2F2' }}>
              {isArmed ? <CheckCircle2 size={50} color="#10B981" /> : <XCircle size={50} color="#E11D48" />}
            </div>
            <h3 style={{ margin: 0, color: '#1E293B', fontSize: '18px' }}>{isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</h3>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <MapPin size={18} color="#E11D48" />
              <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1E293B' }}>Localización de la Señal</span>
            </div>
            <div onClick={openGoogleMaps} style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
              <img src={`https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=14&l=map&size=350,240&pt=${coords.lng},${coords.lat},pm2rdl`} style={{ width: '100%', display: 'block' }} alt="Mapa" />
              <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>VER EN GOOGLE MAPS</div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
