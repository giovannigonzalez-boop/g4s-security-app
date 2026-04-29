"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Home, Bell, Power, ShieldCheck, RefreshCw, CheckCircle2, XCircle, Search, ChevronRight, MapPin, Clock } from 'lucide-react';

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
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(6);
    if (data) setLogs(data);
    setLoading(false);
  }

  async function simulateEvent(tipo: string, cliente: string = "Simulación G4S", cuenta: string = "SIM-999") {
    const nuevoEvento = {
      nombre_cliente: cliente,
      cuenta: cuenta,
      tipo_evento: tipo,
      ciudad: "Central de Monitoreo",
      fecha_evento: new Date().toLocaleTimeString(),
    };
    const { error } = await supabase.from('alarm_logs').insert([nuevoEvento]);
    if (!error) fetchG4SData();
  }

  useEffect(() => { fetchG4SData(); }, []);

  const filteredLogs = logs.filter(log => 
    log.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.cuenta?.toString().includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB', color: '#111827', fontFamily: '"Inter", sans-serif' }}>
      
      {/* SIDEBAR LIMPIO (Inspirado en limpieza de Alarm.com) */}
      <nav style={{ width: '260px', backgroundColor: '#FFFFFF', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '15px', borderRight: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '12px', borderRadius: '10px' }}><Shield size={24}/></div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>G4S <span style={{fontWeight:'normal', color:'#6B7280'}}>MONITORING</span></div>
        </div>
        
        <SidebarLink icon={<Home size={20}/>} label="Panel de Control" active />
        
        <p style={{ fontSize: '12px', color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '20px' }}>Simulador</p>
        <SidebarLink icon={<Bell size={20} color="#E11D48"/>} label="Simular Pánico" onClick={() => simulateEvent('PÁNICO LOCAL')} />
        <SidebarLink icon={<Power size={20} color="#10B981"/>} label="Simular Apertura" onClick={() => simulateEvent('APERTURA')} />
        <SidebarLink icon={<ShieldCheck size={20} color="#3B82F6"/>} label="Simular Cierre" onClick={() => simulateEvent('CIERRE')} />
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Monitor de Seguridad</h1>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#9CA3AF' }} size={18} />
              <input type="text" placeholder="Buscar cuenta o cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #D1D5DB', width: '280px', backgroundColor: 'white' }} />
            </div>
            <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#E11D48', color: 'white', cursor: 'pointer' }}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''}/>
            </button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '30px' }}>
          
          {/* TABLA DE EVENTOS (Refinada y legible) */}
          <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom: '20px'}}>
              <h3 style={{ marginTop: 0 }}>Cola de Señales Recientes</h3>
              <a href="#" style={{color:'#E11D48', fontSize:'14px', textDecoration:'none'}}>Ver historial</a>
            </div>
            {filteredLogs.length > 0 ? filteredLogs.map((log) => (
              <div key={log.id} style={{ padding: '15px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                  {getEventIcon(log.tipo_evento)}
                  <div>
                    <div style={{ fontWeight: 'bold', color: log.tipo_evento?.includes('PÁNICO') ? '#E11D48' : '#111827' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '14px', color:'#374151' }}>{log.nombre_cliente}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', color: '#6B7280', fontSize: '12px' }}>
                  <div><MapPin size={12} style={{display:'inline'}}/> {log.ciudad} | <Clock size={12} style={{display:'inline'}}/> {log.fecha_evento}</div>
                  <div style={{marginTop:'2px'}}>Cuenta: {log.cuenta}</div>
                </div>
              </div>
            )) : <p style={{textAlign:'center', color:'#6B7280', padding:'40px'}}>{loading ? 'Cargando...' : 'No hay datos'}</p>}
          </div>

          {/* BOTÓN ARMADO (Grande, visual y central, inspirado en Partición 1) */}
          <div onClick={() => { setIsArmed(!isArmed); simulateEvent(isArmed ? 'DESARMADO' : 'ARMADO'); }}
            style={{ flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: `10px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', backgroundColor: isArmed ? '#ECFDF5' : '#FFF1F2' }}>
              {isArmed ? <CheckCircle2 size={80} color="#10B981" /> : <XCircle size={80} color="#E11D48" />}
            </div>
            <h2 style={{ color: isArmed ? '#10B981' : '#E11D48', margin: 0, fontSize: '22px' }}>{isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</h2>
            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>Presiona para cambiar estado</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// COMPONENTES DE ESTILO AUXILIARES
function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', backgroundColor: active ? '#FEE2E2' : 'transparent', color: active ? '#E11D48' : '#374151', fontWeight: active ? 'bold' : 'normal' }}>
      {icon} {label}
    </div>
  );
}

function getEventIcon(tipo: string) {
  if (tipo?.includes('Alarma') || tipo?.includes('PÁNICO')) return <Bell size={20} color="#E11D48" style={{backgroundColor: '#FFF1F2', padding:'10px', borderRadius:'10px'}} />;
  if (tipo?.includes('Apertura')) return <Power size={20} color="#10B981" style={{backgroundColor: '#ECFDF5', padding:'10px', borderRadius:'10px'}} />;
  if (tipo?.includes('Cierre') || tipo?.includes('APP')) return <ShieldCheck size={20} color="#3B82F6" style={{backgroundColor: '#EFF6FF', padding:'10px', borderRadius:'10px'}} />;
  return <ChevronRight size={20} color="#6B7280" style={{backgroundColor: '#F3F4F6', padding:'10px', borderRadius:'10px'}} />;
}
