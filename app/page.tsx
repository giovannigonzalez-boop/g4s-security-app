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
      const res = await fetch(`${url}/rest/v1/alarm_logs?select=*&order=created_at.desc`, {
        headers: { 'apikey': key || '', 'Authorization': `Bearer ${key}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map((item: any) => {
          const ev = (item.tipo_evento || "").toLowerCase();
          let type = "NORMAL";
          if (ev.includes("panico") || ev.includes("person") || ev.includes("alarma")) type = "ALARM";
          if (ev.includes("armado") || ev.includes("cierre") || ev.includes("desarmado")) type = "SYSTEM";
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
                  <div style={{ background: log.category === 'ALARM' ? '#FFF1F2' : '#F0FDF4', padding: '12px', borderRadius: '12px' }}>
                    {log.category === 'ALARM' ? <ShieldAlert color="#E11D48" size={22} /> : <ShieldCheck color="#10B981" size={22} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>{log.nombre_cliente} • CTA: {log.cuenta}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {log.category === 'ALARM' ? (
                    <button style={{ background: '#E11D48', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      ANULAR FALSA ALARMA
                    </button>
                  ) : (
                    <button style={{ background: '#0F172A', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Lock size={14} /> ARMAR / DESARMAR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ background: 'white', padding: '35px', borderRadius: '32px', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: logs[0]?.category === 'ALARM' ? '#FFF1F2' : '#F0FDF4', border: `6px solid ${logs[0]?.category === 'ALARM' ? '#E11D48' : '#10B981'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              {logs[0]?.category === 'ALARM' ? <ShieldAlert size={55} color="#E11D48" /> : <CheckCircle2 size={55} color="#10B981" />}
            </div>
            <strong style={{ fontSize: '16px', color: logs[0]?.category === 'ALARM' ? '#E11D48' : '#10B981' }}>
              {logs[0]?.category === 'ALARM' ? 'ALERTA DETECTADA' : 'SISTEMA MONITOREADO'}
            </strong>
          </div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '32px' }}>
            <img src={`https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=15&l=map&size=350,220&pt=${coords.lng},${coords.lat},pm2rdl`} style={{ width: '100%', borderRadius: '20px' }} alt="Mapa" />
          </div>
          <div style={{ background: '#0F172A', color: 'white', padding: '25px', borderRadius: '32px', textAlign: 'center' }}>
            <Radio size={28} color="#E11D48" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>MODO SIMULACIÓN</div>
            <button onClick={() => alert('Demo G4S: Insertar "Panico" en Base de Datos')} style={{ background: '#E11D48', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>SIMULAR PÁNICO</button>
          </div>
        </aside>
      </main>
      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
