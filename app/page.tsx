"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Shield, Bell, Activity, Database, AlertTriangle } from 'lucide-react';

// CONFIGURACIÓN DE CONEXIÓN
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function G4SMonitoringDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alarm_logs')
        .select('*')
        .order('id', { ascending: false })
        .limit(100);
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error cargando datos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.account_number?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="bg-red-600 p-3 rounded-lg shadow-lg shadow-red-900/20">
            <Shield size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">G4S SMART MONITORING</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Security Dashboard v3.0</p>
          </div>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Buscar por cliente o cuenta..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">ID Evento</th>
                <th className="p-4 font-bold">Cuenta</th>
                <th className="p-4 font-bold">Cliente</th>
                <th className="p-4 font-bold">Evento</th>
                <th className="p-4 font-bold">Fecha/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-slate-500">Cargando registros...</td></tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-750 transition-colors">
                  <td className="p-4 font-mono text-red-400">#{log.id}</td>
                  <td className="p-4 text-slate-300">{log.account_number}</td>
                  <td className="p-4 font-semibold">{log.customer_name}</td>
                  <td className="p-4 text-sm">{log.event_description}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(log.event_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
