import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Shield, Bell, Activity } from 'lucide-react';

// Configuración de Supabase (Asegúrate de que tus variables de entorno estén en Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function G4SMonitoringDashboard() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('DESARMADO');

  // 1. Cargar datos iniciales (Los 326,854 registros)
  useEffect(() => {
    fetchLogs();
    
    // Suscripción en tiempo real para nuevas alarmas
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alarm_logs' }, 
      (payload) => {
        setLogs((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('alarm_logs')
      .select('*')
      .order('id', { ascending: false })
      .limit(100); // Mostramos los últimos 100 para velocidad

    if (!error) setLogs(data);
    setLoading(false);
  };

  // 2. Función de búsqueda
  const filteredLogs = logs.filter(log => 
    log.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.cuenta?.includes(searchTerm) ||
    log.tipo_evento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      {/* Cabecera Profesional */}
      <header className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-lg border-b-4 border-red-600 shadow-xl">
        <div className="flex items-center gap-3">
          <Shield className="text-red-600 w-10 h-10" />
          <h1 className="text-2xl font-bold tracking-tighter">G4S SMART MONITORING <span className="text-red-600 text-sm">v3.0</span></h1>
        </div>
        <div className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 ${status === 'ARMADO' ? 'bg-red-600 animate-pulse' : 'bg-green-600'}`}>
          <Activity size={18} /> ESTADO: {status}
        </div>
      </header>

      <main className="grid grid-cols-1 gap-6">
        {/* Panel de Control de Simulación */}
        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 italic text-slate-400">CONTROL DE OPERACIÓN</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setStatus('ARMADO')}
              className="flex-1 bg-red-600 hover:bg-red-700 py-4 rounded-lg font-black transition-all active:scale-95"
            >ARMAR SISTEMA</button>
            <button 
              onClick={() => setStatus('DESARMADO')}
              className="flex-1 bg-slate-600 hover:bg-slate-500 py-4 rounded-lg font-black transition-all active:scale-95"
            >DESARMAR</button>
          </div>
        </section>

        {/* Buscador de Historial G4S */}
        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bell className="text-yellow-500" /> HISTORIAL DE EVENTOS REALES
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Buscar cuenta o cliente..."
                className="bg-slate-900 border border-slate-600 rounded-md py-2 pl-10 pr-4 w-80 focus:outline-none focus:border-red-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla estilo Master Monitoring */}
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-red-500 text-xs uppercase tracking-widest">
                  <th className="p-3 border-b border-slate-700">Cuenta</th>
                  <th className="p-3 border-b border-slate-700">Nombre Cliente</th>
                  <th className="p-3 border-b border-slate-700">Evento</th>
                  <th className="p-3 border-b border-slate-700">Fecha/Hora</th>
                  <th className="p-3 border-b border-slate-700">Usuario/Zona</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan="5" className="p-10 text-center animate-pulse">Consultando base de datos Master Monitoring...</td></tr>
                ) : filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700 border-b border-slate-800 transition-colors">
                    <td className="p-3 font-mono text-yellow-500">{log.cuenta}</td>
                    <td className="p-3 font-bold uppercase">{log.nombre_cliente}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-black ${
                        log.tipo_evento?.includes('ALARMA') ? 'bg-red-900 text-red-200' : 'bg-slate-900 text-slate-300'
                      }`}>
                        {log.tipo_evento}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{log.fecha_evento} {log.hora_evento}</td>
                    <td className="p-3 italic text-slate-500">{log.usuario_zona || 'SISTEMA'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
