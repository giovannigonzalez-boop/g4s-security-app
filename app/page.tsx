"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Shield, AlertCircle } from 'lucide-react';

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
        const { data, error } = await supabase
          .from('alarm_logs')
          .select('*')
          .order('id', { ascending: false })
          .limit(100);
        if (error) throw error;
        setLogs(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

 const filteredLogs = logs.filter(log => {
    // 1. Limpiamos lo que el usuario escribe (quitamos espacios y pasamos a minúsculas)
    const search = searchTerm.trim().toLowerCase();
    
    if (search === "") return true;

    // 2. Preparamos los datos de la base de datos para comparar
    const cliente = (log.customer_name || "").toString().toLowerCase();
    const cuenta = (log.account_number || "").toString().toLowerCase();
    const desc = (log.event_description || "").toString().toLowerCase();

    // 3. Comparamos (buscamos si el texto está incluido en alguna parte)
    return cliente.includes(search) || cuenta.includes(search) || desc.includes(search);
  });

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100-screen', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Shield size={40} color="#ef4444" />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '-1px' }}>G4S SMART MONITORING</h1>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>SECURITY DASHBOARD V3.0</span>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Buscar cuenta o cliente..." 
            style={{ padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', width: '300px' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
        </div>
      </header>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#334155', color: '#cbd5e1', fontSize: '12px' }}>
              <th style={{ padding: '15px' }}>ID EVENTO</th>
              <th style={{ padding: '15px' }}>CUENTA</th>
              <th style={{ padding: '15px' }}>CLIENTE</th>
              <th style={{ padding: '15px' }}>DESCRIPCIÓN</th>
              <th style={{ padding: '15px' }}>FECHA / HORA</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Cargando datos de base de datos...</td></tr>
            ) : filteredLogs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>No se encontraron resultados para "{searchTerm}"</td></tr>
            ) : filteredLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '15px', color: '#f87171', fontWeight: 'bold' }}>#{log.id}</td>
                <td style={{ padding: '15px', color: '#cbd5e1' }}>{log.account_number}</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{log.customer_name}</td>
                <td style={{ padding: '15px', fontSize: '14px' }}>{log.event_description}</td>
                <td style={{ padding: '15px', color: '#94a3b8', fontSize: '13px' }}>{new Date(log.event_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
