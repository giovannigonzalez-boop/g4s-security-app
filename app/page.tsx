"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Shield, Search, Bell, Activity, Users, Settings, 
  Video, Home, Menu, AlertCircle, CheckCircle2 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SProfessionalDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function getLogs() {
      try {
        const { data, error } = await supabase
          .from('alarm_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        setLogs(data || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    getLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    String(log.nombre_cliente || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(log.cuenta || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f7', fontFamily: 'sans-serif', color: '#333' }}>
      
      {/* SIDEBAR IZQUIERDO (Como en la imagen) */}
      <aside style={{ width: '240px', backgroundColor: '#fff', borderRight: '1px solid #e1e1e6', display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#e11d48', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '20px' }}>G4S</div>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>Smart Security</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <NavItem icon={<Home size={20} />} label="Inicio" active />
          <NavItem icon={<Video size={20} />} label="Video" />
          <NavItem icon={<Bell size={20} />} label="Notificaciones" />
          <NavItem icon={<Activity size={20} />} label="Actividad" />
          <NavItem icon={<Users size={20} />} label="Usuarios" />
          <NavItem icon={<Settings size={20} />} label="Configuración" />
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        
        {/* HEADER SUPERIOR */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Panel de Control</h2>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar cuenta..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 15px 10px 40px', borderRadius: '20px', border: '1px solid #e1e1e6', width: '300px', outline: 'none' }}
            />
          </div>
        </header>

        {/* DASHBOARD GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
          
          {/* COLUMNA IZQUIERDA (Actividad) */}
          <section>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e1e1e6', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #f4f4f7', paddingBottom: '10px' }}>Actividad Reciente</h3>
              
              {loading ? <p>Cargando eventos...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {filteredLogs.map((log) => (
                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ color: log.tipo_evento?.toLowerCase().includes('alarma') ? '#ef4444' : '#22c55e' }}>
                          <AlertCircle size={24} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.nombre_cliente}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{log.tipo_evento} - Cuenta: {log.cuenta}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {new Date(log.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* COLUMNA DERECHA (Estado del Sistema) */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e1e1e6', padding: '25px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                <CheckCircle2 size={40} color="#22c55e" />
              </div>
              <h4 style={{ margin: '0 0 5px 0' }}>Partición 1</h4>
              <p style={{ color: '#22c55e', fontWeight: 'bold', margin: 0 }}>SISTEMA ARMADO</p>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e1e1e6', padding: '20px' }}>
              <h4 style={{ marginTop: 0 }}>Estado de Zonas</h4>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>Zona 1 - Puerta</span> <span style={{ color: '#22c55e' }}>Cerrado</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>Zona 2 - Ventana</span> <span style={{ color: '#22c55e' }}>Cerrado</span></div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer',
      backgroundColor: active ? '#fef2f2' : 'transparent',
      color: active ? '#e11d48' : '#64748b',
      fontWeight: active ? '600' : '400'
    }}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
