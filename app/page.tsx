"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Shield, AlertTriangle } from 'lucide-react';

// Configuración de conexión
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function G4SMonitoringDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        // Traemos todo de la tabla alarm_logs
        const { data, error } = await supabase
          .from('alarm_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          setErrorStatus(error.message);
          console.error("Error de Supabase:", error);
        } else {
          setLogs(data || []);
        }
      } catch (err) {
        setErrorStatus("Error de conexión al servidor");
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  // Filtro de búsqueda por cuenta, cliente o evento
  const filteredLogs = logs.filter(log => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;
    
    const cliente = String(log.nombre_cliente || "").toLowerCase();
    const cuenta = String(log.cuenta || "").toLowerCase();
    const evento = String(log.tipo_evento || "").toLowerCase();

    return cliente.includes(s) || cuenta.includes(s) || evento.includes(s);
  });

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Shield size={40} color="#ef4444" />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>G4S SMART MONITORING</h1>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>DASHBOARD PROFESIONAL V3.0</span>
          </div>
        </div>
        
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Buscar por cuenta o cliente..." 
            style={{ padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', width: '350px', outline: 'none' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* MENSAJE DE ERROR SI EXISTE */}
      {errorStatus && (
        <div style={{ backgroundColor: '#451a1a', border: '1px solid #ef4444', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle color="#ef4444" />
          <span><strong>Error detectado:</strong> {errorStatus}</span>
        </div>
      )}

      {/* TABLA DE RESULTADOS */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#334155', color: '#cbd5e1', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>Cuenta</th>
              <th style={{ padding: '15px' }}>Cliente</th>
              <th style={{ padding: '15px' }}>Tipo de Evento</th>
              <th style={{ padding: '15px' }}>Fecha / Hora</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Conectando con la base de datos de G4S...</td></tr>
            ) : filteredLogs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>
                {searchTerm ? `No hay coincidencias para "${searchTerm}"` : "La base de datos está vacía o el acceso está bloqueado."}
              </td></tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #334155', transition: 'background 0.2s' }}>
                  <td style={{ padding: '15px', color: '#f87171', fontWeight: 'bold' }}>#{log.id}</td>
                  <td style={{ padding: '15px', color: '#f1f5f9' }}>{log.cuenta}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#fff' }}>{log.nombre_cliente}</td>
                  <td style={{ padding: '15px', fontSize: '14px' }}>{log.tipo_evento}</td>
                  <td style={{ padding: '15px', color: '#94a3b8', fontSize: '13px' }}>
                    {log.created_at ? new Date(log.created_at).toLocaleString() : '---'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <footer style={{ marginTop: '20px', textAlign: 'center', color: '#475569', fontSize: '12px' }}>
        Conexión segura vía Supabase Realtime Engine
      </footer>
    </div>
  );
}
