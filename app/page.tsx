"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, RefreshCw, LogOut, ShieldAlert, Radio, Lock, Unlock, MapPin } from 'lucide-react';

export default function G4S_Console_ARC_Final() {
  const [session, setSession] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<any>(null);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const res = await fetch(`${url}/rest/v1/alarm_logs?select=*&order=created_at.desc&limit=12`, {
        headers: { 'apikey': key || '', 'Authorization': `Bearer ${key}`, 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
      
      if (data[0] && !currentAccount) {
        setCurrentAccount({ nombre: data[0].nombre_cliente, cuenta: data[0].cuenta });
        setCoords({ lat: parseFloat(data[0].latitud) || 10.9685, lng: parseFloat(data[0].longitud) || -74.7813 });
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const createEvent = async (tipo: string, nuevoCiclo: boolean = false) => {
    let clientName, accountNumber, lat, lng;
    if (nuevoCiclo || !currentAccount) {
      const id = Math.floor(1000 + Math.random() * 9000);
      clientName = `CLIENTE VIP - ${id}`;
      accountNumber = `ARC-${id}`;
      lat = 10.963 + (Math.random() * 0.02);
      lng = -74.785 - (Math.random() * 0.02);
      setCurrentAccount({ nombre: clientName, cuenta: accountNumber });
      setCoords({ lat, lng });
    } else {
      clientName = currentAccount.nombre;
      accountNumber = currentAccount.cuenta;
      lat = coords.lat;
      lng = coords.lng;
    }
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/alarm_logs`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipo_evento: tipo,
          nombre_cliente: clientName,
          cuenta: accountNumber,
          latitud: lat,
          longitud: lng,
          created_at: new Date().toISOString()
        })
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const latest = logs[0] || {};
  const isPanic = latest.tipo_evento === "PÁNICO";
  const isArmed = latest.tipo_evento === "Sistema Armado";

  // GPS REPARADO CON URL DINÁMICA
  const mapUrl = `https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=14&l=map&size=400,250&pt=${coords.lng},${coords.lat},pm2rdl`;

  if (!session) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', padding: '50px 40px', borderRadius: '32px', width: '380px', textAlign: 'center' }}>
        <div style={{ background: '#E11D48', color: 'white', padding: '15px', borderRadius: '12px', fontWeight: '900', fontSize: '24px', marginBottom: '30px' }}>G4S ARC</div>
        <button onClick={() => setSession(true)} style={{ width: '100%', padding: '16px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>INGRESAR A CONSOLA</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '90px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ background: '#E11D48', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: '900', fontSize: '18px', marginBottom: '40px' }}>G4S</div>
        <div style={{ backgroundColor: '#FFF1F2', padding: '12px', borderRadius: '15px' }}><Home size={28} color="#E11D48" /></div>
        <div style={{ flex: 1 }} />
        <LogOut onClick={() => setSession(false)} size={28} color="#94A3B8" style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </aside>

      <main style={{ flex: 1, marginLeft: '90px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A' }}>Log de Activaciones</h1>
            <RefreshCw onClick={fetchData} size={24} color="#E11D48" className={loading ? 'animate-spin' : ''} style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ background: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ background: log.tipo_evento?.includes('PÁNICO') ? '#FFF1F2' : '#F0FDF4', padding: '12px', borderRadius: '12px' }}>
                    {log.tipo_evento?.includes('PÁNICO') ? <ShieldAlert color="#E11D48" /> : <ShieldCheck color="#10B981" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: log.tipo_evento?.includes('PÁNICO') ? '#E11D48' : '#0F172A' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>{log.nombre_cliente} • <b>{log.cuenta}</b> • {new Date(log.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '30px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
             <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `4px solid ${isPanic ? '#E11D48' : '#10B981'}`, margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isPanic ? '#FFF1F2' : '#F0FDF4' }}>
                {isPanic ? <ShieldAlert size={40} color="#E11D48" /> : <ShieldCheck size={40} color="#10B981" />}
             </div>
             <h3 style={{ margin: 0, fontWeight: '900', color: isPanic ? '#E11D48' : '#10B981' }}>{isPanic ? 'ALERTA DETECTADA' : 'SISTEMA SEGURO'}</h3>
          </div>

          {isPanic && (
            <button onClick={() => createEvent("FALSA ALARMA ANULADA", false)} style={{ width: '100%', padding: '25px', background: '#FFF1F2', color: '#E11D48', border: '2px solid #E11D48', borderRadius: '25px', fontWeight: '900', cursor: 'pointer' }}>ANULAR PÁNICO</button>
          )}

          <div style={{ background: 'white', padding: '25px', borderRadius: '25px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
             <button onClick={() => createEvent(isArmed ? "Sistema Desarmado" : "Sistema Armado", !isArmed && !isPanic)} style={{ width: '100%', padding: '18px', background: isArmed ? '#0F172A' : '#10B981', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
               {isArmed ? <Unlock size={20} /> : <Lock size={20} />} {isArmed ? 'DESARMAR' : 'ARMAR'}
             </button>
          </div>

          <div style={{ background: 'white', padding: '15px', borderRadius: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: '900', marginBottom: '10px', fontSize: '14px', display: 'flex', gap: '5px' }}><MapPin size={18} color="#E11D48" /> UBICACIÓN</div>
            <img src={mapUrl} style={{ width: '100%', borderRadius: '15px' }} alt="GPS" key={coords.lat} />
          </div>

          <div style={{ background: '#0F172A', padding: '25px', borderRadius: '25px' }}>
            <button onClick={() => createEvent("PÁNICO", true)} style={{ width: '100%', padding: '16px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>SIMULAR PÁNICO REAL</button>
          </div>
        </aside>
      </main>
      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
