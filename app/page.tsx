"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Power, Download, Lock
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SUnifiedPanel() {
  const [session, setSession] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  // --- LÓGICA DE ACCESO ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'G4S2024') { // Cambia tu clave aquí
      setSession(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(8);
    if (data) setLogs(data);
    setLoading(false);
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const simulate = async (tipo: string) => {
    const lat = 10.93 + (Math.random() * 0.08);
    const lng = -74.82 + (Math.random() * 0.08);
    await supabase.from('alarm_logs').insert([{ 
      nombre_cliente: "Residencia Premium", cuenta: "BAQ-3733", tipo_evento: tipo, 
      ciudad: "Barranquilla", fecha_evento: new Date().toLocaleTimeString(), latitud: lat, longitud: lng
    }]);
    setCoords({ lat, lng });
    fetchData();
  };

  // Función para abrir Google Maps
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    window.open(url, '_blank');
  };

  const getMapUrl = (lat: number, lng: number) => {
    return `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=14&l=map&size=450,300&pt=${lng},${lat},pm2rdl`;
  };

  // --- VISTA DE LOGIN (Punto 1: Entorno Bonito) ---
  if (!session) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', width: '350px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px' }}>G4S</div>
          <h2 style={{ color: '#1E293B', marginBottom: '10px' }}>Mi Seguridad ARC</h2>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '30px' }}>Ingrese su clave de abonado</p>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '12px', color: '#94A3B8' }} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar al Panel</button>
        </form>
      </div>
    );
  }

  // --- VISTA PRINCIPAL PANEL ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '80px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '25px 0', position: 'fixed', height: '100vh' }}>
        <div style={{ color: '#E11D48', fontWeight: 'bold', marginBottom: '30px' }}>G4S</div>
        <Home size={24} color="#E11D48" />
        <div style={{ flex: 1 }} />
        <LogOut size={24} color="#94A3B8" onClick={() => setSession(false)} style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </aside>

      <main style={{ flex: 1, marginLeft: '80px', padding: '35px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <section>
          <header style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', margin: 0 }}>Panel de Control G4S</h1>
            <p style={{ color: '#64748B', fontSize: '14px' }}>Bienvenido de nuevo, Giovanni</p>
          </header>

          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Historial de Eventos</h3>
              <RefreshCw size={20} onClick={fetchData} className={loading ? 'animate-spin' : ''} style={{ cursor: 'pointer', color: '#94A3B8' }} />
            </div>
            {logs.map((log) => (
              <div key={log.id} 
                onClick={() => log.latitud && setCoords({lat: log.latitud, lng: log.longitud})}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {log.tipo_evento?.includes('PÁNICO') ? <AlertTriangle color="#E11D48" /> : <ShieldCheck color="#10B981" />}
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{log.fecha_evento}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>RECIBIDO</div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '24px', textAlign: 'center' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulate(isArmed ? 'DESARMADO' : 'ARMADO'); }} 
              style={{ width: '140px', height: '140px', borderRadius: '50%', border: `8px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', cursor: 'pointer', backgroundColor: isArmed ? '#F0FDF4' : '#FEF2F2' }}>
              {isArmed ? <CheckCircle2 size={60} color="#10B981" /> : <XCircle size={60} color="#E11D48" />}
            </div>
            <h3 style={{ margin: 0, color: isArmed ? '#10B981' : '#E11D48' }}>{isArmed ? 'SISTEMA PROTEGIDO' : 'SISTEMA DESARMADO'}</h3>
          </div>

          {/* MAPA INTERACTIVO (Punto 2: Clic para abrir Google Maps) */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <MapPin size={18} color="#E11D48" />
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Ubicación de Alarma</span>
            </div>
            <div 
              onClick={openGoogleMaps}
              style={{ position: 'relative', cursor: 'pointer', borderRadius: '15px', overflow: 'hidden' }}
              title="Clic para ver en Google Maps"
            >
              <img src={getMapUrl(coords.lat, coords.lng)} alt="Mapa" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(225, 29, 72, 0.9)', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}>
                VER EN GOOGLE MAPS
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
