"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Power, ChevronRight
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SFinalPremiumPanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 }); // Barranquilla

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(8);
    if (data) setLogs(data);
    setLoading(false);
  };

  const simulate = async (tipo: string, cli: string = "G4S User", cta: string = "BAQ-3733") => {
    const lat = 10.93 + (Math.random() * 0.08);
    const lng = -74.82 + (Math.random() * 0.08);
    
    const { error } = await supabase.from('alarm_logs').insert([{ 
      nombre_cliente: cli, cuenta: cta, tipo_evento: tipo, ciudad: "Barranquilla", 
      fecha_evento: new Date().toLocaleTimeString(), latitud: lat, longitud: lng
    }]);
    
    if (!error) {
      setCoords({ lat, lng });
      fetchData();
    }
  };

  const getMapUrl = (lat: number, lng: number) => {
    return `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=14&l=map&size=450,300&pt=${lng},${lat},pm2rdl`;
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR CORPORATIVO */}
      <nav style={{ width: '90px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', width: '55px', height: '55px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', marginBottom: '40px' }}>G4S</div>
        <div style={{ color: '#E11D48', textAlign: 'center', cursor: 'pointer' }} onClick={fetchData}>
          <Home size={28} />
          <div style={{fontSize:'10px', fontWeight:'bold', marginTop:'5px'}}>INICIO</div>
        </div>
        <div style={{ flex: 1 }} />
        <div onClick={() => window.location.reload()} style={{ color: '#94A3B8', textAlign: 'center', cursor: 'pointer', marginBottom: '20px' }}>
          <LogOut size={28} />
          <div style={{fontSize:'10px', fontWeight:'bold', marginTop:'5px'}}>SALIR</div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, marginLeft: '90px', padding: '35px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '30px' }}>
        
        {/* COLUMNA IZQUIERDA: EVENTOS */}
        <section>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1E293B', margin: 0 }}>Centro de Operaciones ARC</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
               <button onClick={fetchData} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer' }}>
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} color="#64748B" />
              </button>
            </div>
          </header>

          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ marginBottom: '25px', fontSize: '18px', color: '#334155', borderBottom: '1px solid #F1F5F9', paddingBottom: '15px' }}>Señales Entrantes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {logs.map((log) => {
                const isPanic = log.tipo_evento?.toLowerCase().includes('pánico');
                return (
                  <div key={log.id} 
                    onClick={() => log.latitud && setCoords({ lat: log.latitud, lng: log.longitud })}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '15px', marginBottom: '8px', backgroundColor: isPanic ? '#FFF1F2' : 'transparent', border: isPanic ? '1px solid #FECACA' : '1px solid transparent', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: isPanic ? '#E11D48' : '#F1F5F9' }}>
                        {isPanic ? <AlertTriangle size={20} color="white"/> : <ShieldCheck size={20} color="#64748B"/>}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1E293B' }}>{log.nombre_cliente}</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>CTA: {log.cuenta} • {log.fecha_evento}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: isPanic ? '#E11D48' : '#475569' }}>{log.tipo_evento}</span>
                      {isPanic && (
                        <button onClick={(e) => { e.stopPropagation(); simulate('FALSA ALARMA', log.nombre_cliente, log.cuenta); }} style={{ padding: '8px 12px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Anular</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* COLUMNA DERECHA: COMANDOS Y MAPA */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* CÍRCULO INTERACTIVO */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '35px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulate(isArmed ? 'DESARMADO' : 'ARMADO'); }} 
              style={{ width: '150px', height: '150px', borderRadius: '50%', border: `10px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', backgroundColor: isArmed ? '#ECFDF5' : '#FFF5F5', cursor: 'pointer', transition: '0.3s' }}>
              {isArmed ? <CheckCircle2 size={70} color="#10B981" /> : <XCircle size={70} color="#E11D48" />}
            </div>
            <h2 style={{ color: isArmed ? '#10B981' : '#E11D48', margin: 0, fontSize: '20px', fontWeight: '800' }}>{isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</h2>
          </div>

          {/* SIMULADOR DE SEÑALES */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '15px', color: '#64748B', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Consola de Simulación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <button onClick={() => simulate('PÁNICO')} style={simBtnS}><Bell size={20} color="#E11D48"/><br/>Pánico</button>
              <button onClick={() => simulate('APERTURA')} style={simBtnS}><Power size={20} color="#10B981"/><br/>Apertura</button>
              <button onClick={() => simulate('CIERRE')} style={simBtnS}><ShieldCheck size={20} color="#3B82F6"/><br/>Cierre</button>
            </div>
          </div>

          {/* MAPA DE UBICACIÓN */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <MapPin size={18} color="#E11D48" />
              <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1E293B' }}>Localización de la Señal</span>
            </div>
            <div style={{ height: '230px', backgroundColor: '#F1F5F9', borderRadius: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={getMapUrl(coords.lat, coords.lng)} 
                alt="Mapa SOC" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

        </aside>
      </main>
    </div>
  );
}

const simBtnS = { padding: '18px 10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '15px', cursor: 'pointer', textAlign: 'center' as const, fontSize: '11px', fontWeight: 'bold' as const, color: '#475569' };
