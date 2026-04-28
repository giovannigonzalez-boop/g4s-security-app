import React, { useState, useEffect } from 'react'; // Actualización final
import { createClient } from '@supabase/supabase-js';
import { Search, Shield, Bell, Activity, Database, AlertTriangle } from 'lucide-react';

// 1. CONFIGURACIÓN DE CONEXIÓN
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function G4SMonitoringDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 2. FUNCIÓN PARA TRAER DATOS DE SUPABASE
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alarm_logs') // Tu tabla de 326k registros
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
    
    // Suscripción en tiempo real
    const channel = supabase
      .channel('realtime_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alarm_logs' }, 
        (payload) => {
          setLogs((prev) => [payload.new, ...prev].slice(0, 100));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 3. FILTRO DE BÚSQUEDA
  const filteredLogs = logs.filter(log => 
    log.cuenta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4">
      {/* HEADER PROFESIONAL */}
      <header className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900 border-b border-slate-800 p-6 rounded-t-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <Shield size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">G4S SMART MONITORING</h1>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              SISTEMA EN VIVO v3.0
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Buscar cuenta o cliente..."
            className="bg-slate-950 border border-slate-700 rounded-md py-2 pl-10 pr-4 w-full md:w-80 focus:outline-none focus:border-red-500 transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="bg-slate-900/50 border-x border-b border-slate-800 rounded-b-xl p-6">
        <div className="mb-6 flex gap-4">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex-1">
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Registros Totales</p>
                <p className="text-2xl font-mono text-red-500">+326,000</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex-1">
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Estado Servidor</p>
                <p className="text-2xl font-mono text-green-500">OPTIMAL</p>
            </div>
        </div>

        {/* TABLA ESTILO MASTER MONITORING */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 border-b border-slate-800">Cuenta</th>
                <th className="p-4 border-b border-slate-800">Nombre Cliente</th>
                <th className="p-4 border-b border-slate-800">Evento Detectado</th>
                <th className="p-4 border-b border-slate-800">Fecha / Hora</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center animate-pulse text-slate-500">
                    Conectando con base de datos Master Monitoring...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-500">
                    No se encontraron registros para la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-red-400">{log.cuenta}</td>
                    <td className="p-4 font-semibold">{log.nombre_cliente}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        log.tipo_evento?.includes('Alarma') ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {log.tipo_evento}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {log.fecha_evento} {log.hora_evento}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

