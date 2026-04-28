"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Shield } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function G4SMonitoringDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

 useEffect(() => {
    const fetchLogs = async () => {
      try {
        console.log("Intentando conectar...");
        const { data, error } = await supabase
          .from('alarm_logs')
          .select('*')
          .limit(10); // Probamos con solo 10 registros
        
        if (error) {
          alert("Error de Supabase: " + error.message);
          throw error;
        }
        
        console.log("Datos recibidos:", data);
        setLogs(data || []);
      } catch (err) {
        console.error("Fallo total:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // FILTRO CORREGIDO CON TUS COLUMNAS REALES
  const filteredLogs = logs.filter(log => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;
    
    return (
      log.cuenta?.toLowerCase().includes(s) ||
      log.nombre_cliente?.toLowerCase().includes(s) ||
      log.tipo_evento?.toLowerCase().includes(s)
    );
  });

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Shield size={40} color="#ef4444" />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>G4S SMART MONITORING</h1>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>SECURITY DASHBOARD V3.0</span>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Buscar cuenta (ej: BOG779B)..." 
            style={{ padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', width: '300px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#334155', color: '#cbd5e1', fontSize: '12px' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>CUENTA</th>
              <th style={{ padding: '15px' }}>CLIENTE</th>
              <th style={{ padding: '15px' }}>EVENTO</th>
              <th style={{ padding: '15px' }}>FECHA</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>Conectando a base de datos...</td></tr>
            ) : filteredLogs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>No se encontró la cuenta "{searchTerm}"</td></tr>
            ) : filteredLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '15px', color: '#f87171' }}>#{log.id}</td>
                <td style={{ padding: '15px' }}>{log.cuenta}</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{log.nombre_cliente}</td>
                <td style={{ padding: '15px' }}>{log.tipo_evento}</td>
                <td style={{ padding: '15px', color: '#94a3b8', fontSize: '13px' }}>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
