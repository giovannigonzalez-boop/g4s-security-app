"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Home, Video, Activity, CheckCircle2, Search } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SPro() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLogs() {
      const { data } = await supabase.from('alarm_logs').select('*').limit(10);
      setLogs(data || []);
      setLoading(false);
    }
    getLogs();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F2F5', color: '#1C1E21', fontFamily: 'Arial, sans-serif' }}>
      {/* BARRA LATERAL BLANCA */}
      <nav style={{ width: '250px', backgroundColor: '#FFFFFF', borderRight: '1px solid #DADDE1', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '15px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>G4S MONITORING</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', color: '#E11D48', backgroundColor: '#FEE2E2', borderRadius: '8px' }}><Home size={20}/> Inicio</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', color: '#606770' }}><Video size={20}/> Video</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', color: '#606770' }}><Activity size={20}/> Actividad</div>
      </nav>

      {/* CUERPO PRINCIPAL GRIS CLARO */}
      <main style={{ flex: 1, padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', margin: 0 }}>Estado del Sistema</h1>
          <div style={{ backgroundColor: 'white', padding: '10px 20px', borderRadius: '20px', border: '1px solid #DADDE1', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Search size={18} color="#606770"/> <input placeholder="Buscar..." style={{ border: 'none', outline: 'none' }} />
          </div>
        </header>

        <div style={{ display: 'flex', gap: '30px' }}>
          {/* TARJETA DE ACTIVIDAD */}
          <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #EBEDF0', paddingBottom: '10px' }}>Eventos Recientes</h3>
            {loading ? <p>Conectando...</p> : logs.map(log => (
              <div key={log.id} style={{ padding: '15px', borderBottom: '1px solid #F0F2F5', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{log.nombre_cliente}</div>
                  <div style={{ fontSize: '13px', color: '#606770' }}>{log.tipo_evento}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#90949C' }}>{new Date(log.created_at).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>

          {/* TARJETA DE ESTADO (CÍRCULO) */}
          <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '25px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '5px solid #31A24C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <CheckCircle2 size={50} color="#31A24C" />
            </div>
            <h2 style={{ color: '#31A24C', margin: 0 }}>ARMADO</h2>
            <p style={{ color: '#606770' }}>Partición 1</p>
          </div>
        </div>
      </main>
    </div>
  );
}
