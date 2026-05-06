"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, RefreshCw, CheckCircle2, LogOut, MapPin, ShieldAlert } from 'lucide-react';

export default function G4SFinalReady() {
  const [session, setSession] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

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
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const response = await fetch(`${url}/rest/v1/alarm_logs?select=*&order=created_at.desc`, {
        headers: { 'apikey': key || '', 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        cache: 'no-store'
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        const mapped = data.map((item: any) => ({
          ...item,
          EventCode: (item.tipo_evento?.toLowerCase().includes("person") || item.tipo_evento?.toLowerCase().includes("panico")) ? "BURGLARY" : "NORMAL"
        }));
        setLogs(mapped);
        if (mapped.length > 0) setCoords({ lat: mapped[0].latitud || 10.9685, lng: mapped[0].longitud || -74.7813 });
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const G4SLogo = ({ size = "normal" }: { size?: string }) => (
    <div style={{ backgroundColor: '#E11D48', color: 'white', padding: size === "large" ? '15px 25px' : '10px 15px', borderRadius: '8px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ fontSize: size === "large" ? '32px' : '20px', fontWeight: '900' }}>G4S</span>
      <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>ARC</span>
    </div>
  );

  if (!session) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '24px', width: '350px', textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}><G4SLogo size="large" /></div>
          <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #DDD' }} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #DDD' }} />
          <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>INGRESAR</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '100px', backgroundColor: 'white', borderRight: '1px solid #EEE', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
        <G4SLogo />
        <div style={{ marginTop: '40px', color: '#E11D48' }}><Home size={28} /></div>
        <div style={{ flex: 1 }} />
        <LogOut size={24} color="#94A3B8" onClick={() => setSession(false)} style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </aside>

      <main style={{ flex: 1, padding: '40px', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px' }}>
        <section>
          <h2 style={{ fontWeight: '900', marginBottom: '20px' }}>Log de Activaciones</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span>Historial G4S ARC</span>
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} onClick={fetchData} style={{ cursor: 'pointer' }} />
             </div>
             {logs.map(log => (
               <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                 <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ backgroundColor: log.EventCode === 'BURGLARY' ? '#FFF1F2' : '#F0FDF4', padding: '10px', borderRadius: '10px' }}>
                      <ShieldCheck color={log.EventCode === 'BURGLARY' ? '#E11D48' : '#10B981'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{log.tipo_evento}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{log.nombre_cliente}</div>
                    </div>
                 </div>
                 {log.EventCode === 'BURGLARY' && (
                   <button style={{ backgroundColor: '#E11D48', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>ANULAR PÁNICO</button>
                 )}
               </div>
             ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', textAlign: 'center' }}>
             <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: logs[0]?.EventCode === 'BURGLARY' ? '#FFF1F2' : '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', border: `4px solid ${logs[0]?.EventCode === 'BURGLARY' ? '#E11D48' : '#10B981'}` }}>
               {logs[0]?.EventCode === 'BURGLARY' ? <ShieldAlert color="#E11D48" size={40} /> : <CheckCircle2 color="#10B981" size={40} />}
             </div>
             <div style={{ color: logs[0]?.EventCode === 'BURGLARY' ? '#E11D48' : '#10B981', fontWeight: 'bold' }}>{logs[0]?.EventCode === 'BURGLARY' ? 'ALERTA ACTIVA' : 'SISTEMA SEGURO'}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '24px' }}>
             <img src={`https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=14&l=map&size=320,200&pt=${coords.lng},${coords.lat},pm2rdl`} style={{ width: '100%', borderRadius: '15px' }} />
          </div>
        </aside>
      </main>
      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
