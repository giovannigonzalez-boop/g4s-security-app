"use client";
import React, { useState, useEffect } from 'react';
import { 
  Home, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Radio, ShieldAlert 
} from 'lucide-react';

export default function G4SUnifiedFinalV2() {
  const [session, setSession] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  // Credenciales de acceso
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'G4S2026*') {
      setSession(true);
    } else {
      alert('Credenciales incorrectas.');
    }
  };

  // --- FUNCIÓN DE CONEXIÓN DIRECTA A SUPABASE ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Usamos las variables de entorno de Vercel para conectar a Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/rest/v1/alarm_logs?select=*&order=created_at.desc`, {
        headers: {
          'apikey': supabaseKey || '',
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        const mappedLogs = data.map((item: any) => {
          const evento = item.tipo_evento || "";
          
          // LÓGICA DE NEGOCIO G4S ARC: Identificación de códigos para la interfaz
          let eventCode = "LOGGED"; // Gris por defecto
          
          if (evento.includes("Activacion") || evento.includes("Armado") || evento.includes("Cierre")) {
            eventCode = "CLOSING"; // Activa iconos de sistema armado
          } else if (evento.includes("Anulacion") || evento.includes("Desarmado") || evento.includes("Apertura")) {
            eventCode = "OPENING"; // Activa iconos de sistema desarmado
          } else if (evento.toLowerCase().includes("person") || evento.toLowerCase().includes("panico")) {
            eventCode = "BURGLARY"; // ACTIVA BOTÓN ROJO DE ANULAR PÁNICO
          }

          return {
            id: item.id,
            nombre_cliente: item.nombre_cliente || "Cliente G4S",
            cuenta: item.cuenta || "N/A",
            tipo_evento: evento,
            fecha_evento: new Date(item.created_at).toLocaleTimeString(),
            EventCode: eventCode,
            latitud: item.latitud || 10.9685,
            longitud: item.longitud || -74.7813
          };
        });

        setLogs(mappedLogs);
        if (mappedLogs.length > 0) {
          setCoords({ lat: mappedLogs[0].latitud, lng: mappedLogs[0].longitud });
        }
      }
    } catch (err) {
      console.error("Error cargando datos de Supabase:", err);
    }
    setLoading(false);
  };

  useEffect(() => { 
    if (session) fetchData(); 
  }, [session]);

  const G4SLogo = ({ size = "normal" }) => (
    <div style={{ backgroundColor: '#E11D48', color: 'white', padding: size === "large" ? '15px 25px' : '10px 15px', borderRadius: '8px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)', minWidth: size === "large" ? '120px' : '70px' }}>
      <span style={{ fontSize: size === "large" ? '32px' : '20px', fontWeight: '900', lineHeight: 0.9 }}>G4S</span>
      <span style={{ fontSize: size === "large" ? '14px' : '10px', fontWeight: 'bold', letterSpacing: '3px', marginTop: '2px', borderTop: '1px solid rgba(255,255,255,0.3)', width: '100%', textAlign: 'center' }}>ARC</span>
    </div>
  );

  // Pantalla de Login
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

  // Dashboard Principal
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '110px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ marginBottom: '50px' }}><G4SLogo size="normal" /></div>
        <div style={{ backgroundColor: '#FFF1F2', padding: '12px', borderRadius: '15px', marginBottom: '25px' }}><Home size={28} color="#E11D48" /></div>
        <div style={{ flex: 1 }} />
        <LogOut size={26} color="#94A3B8" onClick={() => setSession(false)} style={{ cursor: 'pointer', marginBottom: '30px' }} />
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '110px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <section>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', marginBottom: '32px' }}>Log de Activaciones</h1>
          
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '35px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Historial de Señales (Supabase)</h3>
              <div onClick={fetchData} style={{ cursor: 'pointer' }}>
                <RefreshCw size={22} color="#E11D48" className={loading ? 'animate-spin' : ''} />
              </div>
            </div>

            {logs.length === 0 && !loading && <p style={{textAlign:'center', color:'#94A3B8'}}>No hay eventos recientes</p>}
            
            {logs.map((log) => (
              <div key={log.id} onClick={() => setCoords({lat: log.latitud, lng: log.longitud})} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '18px' }}>
                  <div style={{ backgroundColor: log.EventCode === 'BURGLARY' ? '#FFF1F2' : '#F0FDF4', padding: '12px', borderRadius: '12px' }}>
                    <ShieldCheck size={22} color={log.EventCode === 'BURGLARY' ? '#E11D48' : '#10B981'} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>{log.nombre_cliente} • CTA: {log.cuenta}</div>
                  </div>
                </div>

                {/* BOTÓN ROJO DE ANULAR (Solo si es Pánico/Burglary) */}
                {log.EventCode === 'BURGLARY' && (
                  <button style={{ backgroundColor: '#E11D48', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    ANULAR FALSA ALARMA
                  </button>
                )}
                
                <div style={{ fontSize: '12px', color: log.EventCode === 'BURGLARY' ? '#E11D48' : '#10B981', fontWeight: '900' }}>{log.fecha_evento}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar Derecha (Widgets) */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '32px', textAlign: 'center' }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', 
              border: `6px solid ${logs[0]?.EventCode === 'BURGLARY' ? '#E11D48' : '#10B981'}`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 20px', 
              backgroundColor: logs[0]?.EventCode === 'BURGLARY' ? '#FFF1F2' : '#F0FDF4' 
            }}>
              {logs[0]?.EventCode === 'BURGLARY' ? <ShieldAlert size={55} color="#E11D48" /> : <CheckCircle2 size={55} color="#10B981" />}
            </div>
            <strong style={{ fontSize: '16px', color: logs[0]?.EventCode === 'BURGLARY' ? '#E11D48' : '#10B981' }}>
              {logs[0]?.EventCode === 'BURGLARY' ? 'ALERTA DETECTADA' : 'SISTEMA MONITOREADO'}
            </strong>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <MapPin size={20} color="#E11D48" />
              <span style={{ fontWeight: '800', fontSize: '14px' }}>UBICACIÓN DE SEÑAL</span>
            </div>
            <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <img src={`https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=14&l=map&size=400,250&pt=${coords.lng},${coords.lat},pm2rdl`} style={{ width: '100%' }} alt="Mapa" />
            </div>
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
