"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Home, Video, Activity, CheckCircle2, XCircle, Search, RefreshCw, AlertTriangle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SFinalDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function fetchG4SData() {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('alarm_logs')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchG4SData(); }, []);

  // Filtrado ultra-flexible
  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      String(log.nombre_cliente || "").toLowerCase().includes(search) ||
      String(log.cuenta || "").toLowerCase().includes(search) ||
      String(log.tipo_evento || "").toLowerCase().includes(search)
    );
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F2F5', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <nav style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #DADDE1', padding: '20px', position: 'fixed', height: '100vh' }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '15px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>G4S MONITORING</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#FEE2E2', color: '#E11D48', borderRadius: '8px', fontWeight: 'bold' }}><Home size={20}/> Inicio</div>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Panel de Monitoreo</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} size={18} />
              <input 
                type="text" 
                placeholder="Buscar cliente, cuenta..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '10px 15px 10px 40px', borderRadius: '20px', border: '1px solid #DADDE1', width: '300px' }}
              />
            </div>
            <button onClick={fetchG4SData} style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer', backgroundColor: 'white', border: '1px solid #DADDE1' }}><RefreshCw size={18} className={loading ? 'animate-spin' : ''}/></button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '30px' }}>
          {/* Tarjeta de Eventos */}
          <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #EEE', paddingBottom: '10px' }}>Últimas Señales</h3>
            
            {errorMsg && (
              <div style={{ backgroundColor: '#FFF5F5', color: '#C53030', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <AlertTriangle size={20}/> <strong>Error:</strong> {errorMsg}
              </div>
            )}

            {loading ? <p>Conectando con Supabase...</p> : 
             filteredLogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredLogs.map((log) => (
                  <div key={log.id} style={{ padding: '15px', borderRadius: '8px', backgroundColor: '#F8F9FA', border: '1px solid #EEE', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#E11D48' }}>{log.tipo_evento || 'SIN TIPO'}</div>
                      <div style={{ fontSize: '15px', fontWeight: '600' }}>{log.nombre_cliente || 'SIN NOMBRE'}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Cuenta: {log.cuenta} | Ciudad: {log.ciudad}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#999' }}>{log.fecha_evento}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                No hay datos para mostrar. {searchTerm && `Filtro actual: "${searchTerm}"`}
              </div>
            )}
          </div>

          {/* Estado Alarma */}
          <div onClick={() => setIsArmed(!isArmed)} style={{ flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '30px', textAlign: 'center', cursor: 'pointer', height: 'fit-content', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: `6px solid ${isArmed ? '#31A24C' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', backgroundColor: isArmed ? '#F0FFF4' : '#FFF5F5' }}>
              {isArmed ? <CheckCircle2 size={50} color="#31A24C" /> : <XCircle size={50} color="#E11D48" />}
            </div>
            <h2 style={{ color: isArmed ? '#31A24C' : '#E11D48', margin: 0 }}>{isArmed ? 'ARMADO' : 'DESARMADO'}</h2>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>Click para cambiar estado</p>
          </div>
        </div>
      </main>
    </div>
  );
}
