"use client";
import React, { useState, useEffect } from 'react';
import { 
  Home, ShieldCheck, RefreshCw, CheckCircle2, 
  LogOut, MapPin, ShieldAlert, Radio, Lock, Unlock 
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
        const mapped = data.map(item => {
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

  const G4SLogo = ({ size = "normal" }) => (
    <div style={{ backgroundColor: '#E11D48', color: 'white', padding: size === "large" ? '15px' : '10px', borderRadius: '8px', textAlign: 'center', display: 'inline-block' }}>
      <div style={{ fontSize: size === "large" ? '24px' : '18px', fontWeight: '900' }}>G4S</div>
      <div style={{ fontSize: '10px', letterSpacing: '2px', borderTop: '1px solid white' }}>ARC</div>
    </div>
  );

  if (!session) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '320px', textAlign: 'center' }}>
        <G4SLogo size="large" /><br/><br/>
        <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <button style={{ width: '100%', padding: '12px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>ENTRAR</button>
      </form>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '100px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', borderRight: '1px solid #e2e8f0' }}>
        <G4SLogo />
        <div style={{ marginTop: '40px', color: '#E11D48' }}><Home size={30} /></div>
        <div style={{ flex: 1 }} />
        <LogOut onClick={() => setSession(false)} style={{ cursor: 'pointer', color: '#94A3B8', marginBottom: '20px' }} />
      </aside>

      <main style={{ flex: 1, padding: '40px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Consola de Monitoreo G4S</h1>
            <button onClick={fetchData} style={{ background: 'white', border: '1px solid #ddd', padding: '10px', borderRadius: '12px' }}>
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ background: log.category === 'ALARM' ? '#FFF1F2' : '#F0FDF4', padding: '12px', borderRadius: '12px' }}>
                    {log.category === 'ALARM' ? <ShieldAlert color="#E11D48" /> : <ShieldCheck color="#10B981" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{log.nombre_cliente} • CTA: {log.cuenta}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {log.category === 'ALARM' ? (
                    <button style={{ background: '#E11D48', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>
                      ANULAR FALSA ALARMA
                    </button>
                  ) : (
                    <button style={{ background: '#0F172A', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <Lock size={12} /> ARMAR / DESARMAR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* Status Card */}
          <div style={{ background: 'white', padding: '30px', borderRadius: '32px', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: logs[0]?.category === 'ALARM' ? '#FFF1F2' : '#F0FDF4', border: `5px solid ${logs[0]?.category === 'ALARM' ? '#E11D48' : '#10B981'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              {logs[0]?.category === 'ALARM' ? <ShieldAlert size={50} color="#E11D48" /> : <CheckCircle2 size={50} color="#10B981" />}
            </div>
            <h3 style={{ margin: 0, color: logs[0]?.category === 'ALARM' ? '#E11D48' : '#10B981' }}>
              {logs[0]?.category === 'ALARM' ? 'ALERTA DETECTADA' : 'SISTEMA PROTEGIDO'}
            </h3>
          </div>

          {/* Map Card */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', fontWeight: 'bold' }}>
              <MapPin color="#E11D48" size={20} /> UBICACIÓN ARC
            </div>
            <img 
              src={`https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=15&l=map&size=340,200&pt=${coords.lng},${coords.lat},pm2rdl`} 
              style={{ width: '100%', borderRadius: '20px' }} 
              alt="Mapa"
            />
          </div>

          {/* SIMULADOR DE PÁNICO (Para tu demo) */}
          <div style={{ background: '#0F172A', color: 'white', padding: '20px', borderRadius: '24px', textAlign: 'center' }}>
            <Radio size={24} color="#E11D48" style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '13px', marginBottom: '15px' }}>MODO SIMULACIÓN</div>
            <button 
              onClick={() => alert('Simulando señal de pánico... (Inserta un registro con "Panico" en tu Supabase)')}
              style={{ background: '#E11D48', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}
            >
              SIMULAR SEÑAL DE PÁNICO
            </button>
          </div>
        </aside>
      </main>

      <style jsx>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
