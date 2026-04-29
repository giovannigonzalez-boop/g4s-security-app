"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, Power, ShieldCheck, RefreshCw, Search, 
  MapPin, Hash, AlertTriangle, CheckCircle2, XCircle, ChevronRight
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Page() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  async function fetchG4SData() {
    setLoading(true);
    const { data, error } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(6);
    if (data) setLogs(data);
    if (error) console.error(error);
    setLoading(false);
  }

  async function simulateEvent(tipo: string, cliente: string = "Simulación G4S", cuenta: string = "SIM-999") {
    const nuevo = {
      nombre_cliente: cliente, cuenta: cuenta, tipo_evento: tipo,
      ciudad: "Central G4S", fecha_evento: new Date().toLocaleTimeString(),
    };
    const { error } = await supabase.from('alarm_logs').insert([nuevo]);
    if (!error) fetchG4SData();
  }

  useEffect(() => { fetchG4SData(); }, []);

  const filteredLogs = logs.filter(log => 
    String(log.nombre_cliente || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(log.cuenta || "").toLowerCase().includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F3F6', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR COMPACTO */}
      <nav style={{ width: '100px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E0E6ED', padding: '20px 10px', position: 'fixed', height: '100vh', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', marginBottom: '40px' }}>G4S</div>
        <div style={{ color: '#E11D48', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 'bold' }}><Home size={24}/><br/>Inicio</div>
      </nav>

      {/* CONTENIDO PRINCIPAL (ZONA DE WIDGETS) */}
      <main style={{ flex: 1, marginLeft: '100px', padding: '30px' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1A1C21', margin: 0 }}>Panel de Control</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#A0AEC0' }} size={18} />
              <input type="text" placeholder="Buscar cuenta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 15px 10px 40px', borderRadius: '20px', border: '1px solid #E0E6ED', width: '200px', outline: 'none', backgroundColor: 'white' }} />
            </div>
            <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '50%', border: '1px solid #E0E6ED', backgroundColor: 'white', cursor: 'pointer', color: '#718096' }}><RefreshCw size={18} className={loading ? 'animate-spin' : ''}/></button>
          </div>
        </header>

        {/* GRILLA DE WIDGETS (COMO LAS IMÁGENES) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* WIDGET 1: ESTADO DE ALARMA (Estilo image_36.png) */}
          <div style={{ gridColumn: 'span 2', backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: `10px solid ${isArmed ? '#31A24C' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', backgroundColor: isArmed ? '#F0FFF4' : '#FFF5F5', cursor: 'pointer' }}
              onClick={() => { setIsArmed(!isArmed); simulateEvent(isArmed ? 'DESARMADO DESDE APP' : 'ARMADO DESDE APP'); }}>
              {isArmed ? <CheckCircle2 size={70} color="#31A24C" /> : <XCircle size={70} color="#E11D48" />}
            </div>
            <h2 style={{ color: isArmed ? '#31A24C' : '#E11D48', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{isArmed ? 'ARMADO' : 'DESARMADO'}</h2>
            <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>Partición 1</p>
            <p style={{ color: '#A0AEC0', fontSize: '11px', marginTop: '15px' }}>Haz clic en el círculo para cambiar estado</p>
          </div>

          {/* WIDGET 2: SIMULADOR RÁPIDO */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', color: '#4A5568', marginBottom: '15px', borderBottom: '1px solid #F0F3F6', paddingBottom: '10px' }}>Simulador de Central</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <SimPill icon={<Bell size={16}/>} label="Pánico" color="#E11D48" onClick={() => simulateEvent('PÁNICO LOCAL')} />
              <SimPill icon={<Power size={16}/>} label="Apertura" color="#31A24C" onClick={() => simulateEvent('APERTURA')} />
              <SimPill icon={<ShieldCheck size={16}/>} label="Cierre" color="#1877F2" onClick={() => simulateEvent('CIERRE')} />
            </div>
          </div>

          {/* WIDGET 3: ACTIVIDAD RECIENTE (Estilo image_38.png) */}
          <div style={{ gridColumn: 'span 2', backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', color: '#4A5568', margin: 0 }}>Actividad reciente</h3>
              <ChevronRight size={20} color="#A0AEC0" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F0F3F6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getEventIcon(log.tipo_evento)}
                    <div>
                      <div style={{ fontSize: '14px', color: '#1A1C21' }}>{log.nombre_cliente} - {log.ciudad}</div>
                      <div style={{ fontSize: '11px', color: '#718096' }}>{log.fecha_evento}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#4A5568', fontWeight: 'bold' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '10px', color: '#A0AEC0' }}>Cuenta: {log.cuenta}</div>
                  </div>
                </div>
              )) : <p style={{textAlign:'center', color:'#A0AEC0', padding:'20px'}}>No hay actividad</p>}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// COMPONENTES DE ESTILO AUXILIARES
const SimPill = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '15px 10px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer', color: color, fontWeight: 'bold', fontSize: '12px' }}>
    {icon} {label}
  </button>
);

function getEventIcon(tipo: string) {
  if (tipo?.includes('Alarma') || tipo?.includes('PÁNICO')) return <AlertTriangle size={20} color="#E11D48" style={{backgroundColor: '#FFF5F5', padding: '8px', borderRadius: '50%'}} />;
  if (tipo?.includes('Apertura')) return <Power size={20} color="#31A24C" style={{backgroundColor: '#F0FFF4', padding: '8px', borderRadius: '50%'}} />;
  if (tipo?.includes('Cierre') || tipo?.includes('APP')) return <ShieldCheck size={20} color="#1877F2" style={{backgroundColor: '#E6F0FF', padding: '8px', borderRadius: '50%'}} />;
  return <Bell size={20} color="#718096" style={{backgroundColor: '#F7FAFC', padding: '8px', borderRadius: '50%'}} />;
}
