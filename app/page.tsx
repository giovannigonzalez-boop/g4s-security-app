"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, Power, ShieldCheck, RefreshCw, 
  CheckCircle2, XCircle, Search, MapPin, Clock, AlertTriangle 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Page() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  async function fetchG4SData() {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(10);
    if (data) setLogs(data);
    setLoading(false);
  }

  async function simulateEvent(tipo: string, cliente: string = "Simulación G4S", cuenta: string = "SIM-999") {
    const nuevoEvento = {
      nombre_cliente: cliente,
      cuenta: cuenta,
      tipo_evento: tipo,
      ciudad: "Central de Monitoreo",
      fecha_evento: new Date().toLocaleTimeString(),
    };
    const { error } = await supabase.from('alarm_logs').insert([nuevoEvento]);
    if (!error) fetchG4SData();
  }

  useEffect(() => { fetchG4SData(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#1E293B', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* SIDEBAR MODERNO */}
      <nav style={{ width: '280px', backgroundColor: '#0F172A', color: 'white', padding: '24px', position: 'fixed', height: '100vh', zIndex: 100, boxShadow: '4px 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '1px', color: '#F8FAFC' }}>
            <span style={{ color: '#E11D48' }}>G4S</span> MONITORING
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>OPERATIONS CENTER</div>
        </div>
        
        <div style={{ marginBottom: '20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>Simulador de Central</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SimButton icon={<Bell size={18}/>} label="Pánico" color="#E11D48" onClick={() => simulateEvent('ALERTA DE PÁNICO')} />
          <SimButton icon={<Power size={18}/>} label="Apertura" color="#10B981" onClick={() => simulateEvent('APERTURA LOCAL')} />
          <SimButton icon={<ShieldCheck size={18}/>} label="Cierre" color="#3B82F6" onClick={() => simulateEvent('CIERRE SISTEMA')} />
        </div>

        <div style={{ marginTop: 'auto', padding: '20px 0', borderTop: '1px solid #1E293B' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>Status: <span style={{ color: '#10B981' }}>● Online</span></div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '32px' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin:
