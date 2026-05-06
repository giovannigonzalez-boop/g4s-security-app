"use client";
import React, { useState, useEffect } from 'react';
import { 
  Home, ShieldCheck, RefreshCw, CheckCircle2, 
  LogOut, MapPin, ShieldAlert, Radio, Lock 
} from 'lucide-react';

export default function G4SARC_FinalConsole() {
  const [session, setSession] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'G4S2026*') setSession(true);
    else alert('Credenciales incorrectas.');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/alarm_logs?select=*&order=created_at.desc`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map((item: any) => {
          const ev = (item.tipo_evento || "").toLowerCase();
          let type = "NORMAL";
          if (ev.includes("panico") || ev.includes("person") || ev.includes("alarma")) type = "ALARM";
          if (ev.includes("armado") || ev.includes("cierre") || ev.includes("desarmado") || ev.includes("apertura")) type = "SYSTEM";
          return { ...item, category: type };
        });
        setLogs(mapped);
        if (mapped.length > 0) setCoords({ lat: mapped[0].latitud || 10.9685, lng: mapped[0].longitud || -74.7813 });
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const G4SLogo = ({ size = "normal" }: { size?: string }) => (
    <div style={{ backgroundColor: '#E11D48', color: 'white', padding: size === "large" ? '15px' : '10px', borderRadius: '8px', textAlign: 'center', display: 'inline-block' }}>
      <div style={{ fontSize: size === "large" ? '24px' : '18px', fontWeight: '900' }}>G4S</div>
      <div style={{ fontSize: '10px', letterSpacing: '2px', borderTop: '1px solid white' }}>ARC</div>
    </div>
  );

  if (!session) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '320px', textAlign: 'center' }}>
          <G4SLogo size="large" /><br/><br/>
          <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <button style={{ width: '100%', padding: '12px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>ENTRAR</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '110px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', borderRight: '1px solid #E2E8F0', position: 'fixed', height: '100vh' }}>
        <G4SLogo />
        <div style={{ marginTop: '50px', backgroundColor: '#FFF1F2', padding: '12px', borderRadius: '15px' }}><Home size={28} color="#E11D48" /></div>
        <div style={{ flex: 1 }} />
        <LogOut onClick={() => setSession(false)} style={{ cursor: 'pointer', color: '#94A3B8', marginBottom: '30px' }} size={26} />
      </aside>

      <main style={{ flex: 1, marginLeft: '110px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A' }}>Consola de Monitoreo G4S</h1>
            <div onClick={fetchData} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '15px', cursor: 'pointer' }}>
              <RefreshCw size={22} color="#E11D48" className={loading ? 'animate-spin' : ''} />
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '24px', padding: '35px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '18px' }}>
                  <div style={{ background: log.category === 'ALARM' ? '#FFF1F2' : '#F0FDF4', padding: '12px
