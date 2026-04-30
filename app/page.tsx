"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Home, Bell, ShieldCheck, RefreshCw, CheckCircle2, XCircle, LogOut, AlertTriangle, MapPin, Lock } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function G4SRescue() {
  const [session, setSession] = useState(false);
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  const fetchData = async () => {
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(5);
    if (data) setLogs(data);
  };

  const simulate = async (tipo: string) => {
    const lat = 10.93 + (Math.random() * 0.08);
    const lng = -74.82 + (Math.random() * 0.08);
    await supabase.from('alarm_logs').insert([{ nombre_cliente: "Residencia G4S", cuenta: "BAQ-3733", tipo_evento: tipo, fecha_evento: new Date().toLocaleTimeString(), latitud: lat, longitud: lng }]);
    setCoords({ lat, lng });
    fetchData();
  };

  if (!session) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1E293B', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', width: '320px' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontWeight: 'bold' }}>G4S</div>
          <h2 style={{ margin: '0 0 20px 0' }}>Panel Cliente</h2>
          <input type="password" placeholder="Clave: G4S2024" onChange={(e)=>setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #DDD', marginBottom: '20px', boxSizing: 'border-box' }} />
          <button onClick={() => password === 'G4S2024' ? setSession(true) : alert('Error')} style={{ width: '100%', padding: '12px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>ENTRAR</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '80px', backgroundColor: 'white', borderRight: '1px solid #DDD', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
        <div style={{ color: '#E11D48', fontWeight: 'bold', marginBottom: '40px' }}>G4S</div>
        <Home size={24} color="#E11D48" onClick={fetchData} style={{cursor:'pointer'}} />
      </aside>
      <main style={{ flex: 1, padding: '40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <section>
          <h1>Mi Seguridad G4S</h1>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px' }}>
            {logs.map(log => (
              <div key={log.id} style={{ padding: '10px 0', borderBottom: '1px solid #EEE' }}>
                <strong>{log.tipo_evento}</strong> - {log.fecha_evento}
              </div>
            ))}
          </div>
        </section>
        <aside>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center', marginBottom: '20px' }}>
            <div onClick={() => {setIsArmed(!isArmed); simulate(isArmed ? 'DESARMADO' : 'ARMADO');}} style={{ width: '100px', height: '100px', borderRadius: '50%', border: `5px solid ${isArmed?'#10B981':'#E11D48'}`, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {isArmed ? <CheckCircle2 color="#10B981" /> : <XCircle color="#E11D48" />}
            </div>
            <strong>{isArmed ? 'ARMADO' : 'DESARMADO'}</strong>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
            <p>Ubicación (Clic para Google Maps)</p>
            <img 
              src={`https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=14&l=map&size=300,200&pt=${coords.lng},${coords.lat},pm2rdl`} 
              onClick={() => window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank')}
              style={{ width: '100%', borderRadius: '10px', cursor: 'pointer' }} 
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
