"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Shield } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SMonitoringDashboard() {
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
          .limit(50);

        if (error) throw error;
        setLogs(data || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    }
    getLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;
    
    const cliente = String(log.nombre_cliente || "").toLowerCase();
    const n_cuenta = String(log.cuenta || "").toLowerCase();
    const evento = String(log.tipo_evento || "").toLowerCase();

    return cliente.includes(s) || n_cuenta.includes(s) || evento.includes(s);
  });

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Shield size={40} color="#ef4444" />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>G4S SMART MONITORING</h1>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>DASHBOARD V3.0</span>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Buscar cuenta o cliente..." 
            style={{ padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f1
