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
          
          // LÓGICA DE NEGOCIO G4S ARC: Traducción de textos a códigos visuales
          let eventCode = "LOGGED"; 
          
          // Detectar Pánico / Alerta (Botón Rojo)
          if (evento.toLowerCase().includes("person") || evento.toLowerCase().includes("panico")) {
            eventCode = "BURGLARY";
          } 
          // Detectar Armado/Desarmado (Iconos Verdes)
          else if (evento.includes("Activacion") || evento.includes("Armado") || evento.includes("Cierre")) {
            eventCode = "CLOSING";
          } else if (evento.includes("Anulacion") || evento.includes("Desarmado") || evento.includes("Apertura")) {
            eventCode = "OPENING";
          }

          return {
            id: item.id,
            nombre_cliente: item.nombre_cliente || "Cliente G4S",
            cuenta: item.cuenta || "N/A",
            tipo_evento: evento,
            fecha_evento: new Date(item.created_at).toLocaleTimeString(),
            EventCode: eventCode, // Este campo activa los colores y el botón
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
      console.error("Error cargando datos:", err);
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '110px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ marginBottom: '50px' }}><G4SLogo size="normal" /></div>
        <div style={{ backgroundColor: '#FFF1F2', padding: '12px', borderRadius: '15px', marginBottom: '25px' }}><Home size={28} color="#E11D48" /></div>
        <div style={{ flex: 1 }} />
        <LogOut size={26} color="#94A3B8" onClick={() => setSession(false)} style={{ cursor: 'pointer', marginBottom: '30px' }} />
      </aside>

      <main style={{ flex: 1, marginLeft: '110px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <section>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', marginBottom: '32px' }}>Log de Activaciones</h1>
          
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '35px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Historial Real G4S ARC</h3>
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

                {/* BOTÓN DINÁMICO DE ANULACIÓN */}
                {log.EventCode === 'BURGLARY' && (
                  <button style={{ backgroundColor: '#E1
