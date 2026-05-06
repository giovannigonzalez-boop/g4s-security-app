"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, RefreshCw, LogOut, ShieldAlert, Radio, Lock, Unlock, MapPin } from 'lucide-react';

export default function G4S_ARC_Console_Final() {
  const [session, setSession] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // Estado para mantener el abonado actual del ciclo
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
      
      if (data[0]) {
        setCoords({ lat: parseFloat(data[0].latitud), lng: parseFloat(data[0].longitud) });
        // Si no tenemos un abonado en el ciclo actual, tomamos el último del log
        if (!currentAccount) {
          setCurrentAccount({ nombre: data[0].nombre_cliente, cuenta: data[0].cuenta });
        }
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const createEvent = async (tipo: string, nuevoCiclo: boolean = false) => {
    let clientName, accountNumber, lat, lng;

    if (nuevoCiclo || !currentAccount) {
      // Generar nuevo abonado para un nuevo ciclo
      const id = Math.floor(1000 + Math.random() * 9000);
      clientName = `CLIENTE G4S - ${id}`;
      accountNumber = `ARC-${id}`;
      lat = 10.963 + (Math.random() * 0.02);
      lng = -74.785 - (Math.random() * 0.02);
      setCurrentAccount({ nombre: clientName, cuenta: accountNumber, lat, lng });
    } else {
      // Mantener el abonado actual del ciclo
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
      
      // Si cerramos un pánico o cambiamos estado drásticamente, el próximo será nuevo ciclo
      if (tipo.includes("ANULADA") || tipo.includes("Desarmado")) {
        // Opcional: podrías resetear para que el siguiente click genere otro cliente
        // setCurrentAccount(null); 
      }
      
      fetchData();
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const latest = logs[0] || {};
  const isPanic = latest.tipo_evento === "PÁNICO";
  const isArmed = latest.tipo_evento === "Sistema Armado";

  // URL de Mapa Estático de Google (Más confiable para GPS)
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=15&size=400x250&markers=color:red%7C${coords.lat},${coords.lng}&key=TU_API_KEY_OPCIONAL`;
  // Alternativa Yandex corregida:
  const yandexUrl = `https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=14&l=map&pt=${coords.lng},${coords.lat},pm2rdl`;

  if (!session) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
      <button onClick={() => setSession(true)} style={{ padding: '20px 40px', background: '#E11D48', color: 'white', borderRadius: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>INGRESAR CONSOLA G4S</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '90px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ background: '#E11D48', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '40px' }}>G4S</div>
        <Home size={28} color="#E11D48" />
        <div style={{ flex: 1 }} />
        <LogOut onClick={() => setSession(false)} size={28} color="#94A3B8" style={{ cursor: 'pointer' }} />
      </aside>

      <main style={{ flex: 1, marginLeft: '90px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A' }}>Monitor de Alarmas ARC</h1>
            <RefreshCw onClick={fetchData} size={24} color="#E11D48" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '25px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ background: log.tipo_evento === 'PÁNICO' ? '#FFF1F2' : '#F0FDF4', padding: '10px', borderRadius: '12px' }}>
                    {log.tipo_evento === 'PÁNICO' ? <ShieldAlert color="#E11D48" /> : <ShieldCheck color="#10B981" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: log.tipo_evento === 'PÁNICO' ? '#E11D48' : '#0F172A' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{log.nombre_cliente} • {log.cuenta}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#94A3B8' }}>{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* BOTÓN ARMADO/DESARMADO (MISMA CUENTA) */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
             <button 
                onClick={() => createEvent(isArmed ? "Sistema Desarmado" : "Sistema Armado", !isArmed && !isPanic)}
                style={{ width: '100%', padding: '20px', background: isArmed ? '#0F172A' : '#10B981', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
             >
               {isArmed ? <Unlock size={20} /> : <Lock size={20} />}
               {isArmed ? 'DESARMAR SISTEMA' : 'ARMAR SISTEMA'}
             </button>
          </div>

          {/* ANULAR PÁNICO (MISMA CUENTA) */}
          {isPanic && (
            <button 
              onClick={() => createEvent("FALSA ALARMA ANULADA", false)}
              style={{ width: '100%', padding: '20px', background: '#FFF1F2', border: '2px solid #E11D48', borderRadius: '20px', color: '#E11D48', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ANULAR ALERTA PÁNICO
            </button>
          )}

          {/* GPS DINÁMICO REPARADO */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px', display: 'flex', gap: '8px', fontSize: '14px' }}><MapPin size={18} color="#E11D48" /> UBICACIÓN EN TIEMPO REAL</div>
            <div style={{ height: '220px', background: '#F1F5F9', borderRadius: '15px', overflow: 'hidden' }}>
              <img 
                src={yandexUrl} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="GPS G4S"
                key={coords.lat} // Fuerza el refresco de la imagen al cambiar coords
              />
            </div>
          </div>

          {/* SIMULADOR PÁNICO (NUEVO ABONADO) */}
          <div style={{ background: '#0F172A', padding: '25px', borderRadius: '30px' }}>
            <button 
              onClick={() => createEvent("PÁNICO", true)} 
              style={{ width: '100%', padding: '15px', background: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              SIMULAR SEÑAL DE PÁNICO
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
