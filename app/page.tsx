"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Download, RefreshCw, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SRescuePanel() {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchData = async () => {
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(5);
    if (data) setLogs(data);
  };

  useEffect(() => { fetchData(); }, []);

  const downloadPDF = () => {
    const doc = new jsPDF() as any;
    doc.text("REPORTE DE SEGURIDAD G4S", 10, 10);
    const body = logs.map(l => [l.fecha_evento, l.tipo_evento]);
    doc.autoTable({ head: [['Hora', 'Evento']], body: body });
    doc.save('G4S_Reporte.pdf');
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* --- BOTÓN DE PRUEBA EXTREMA --- */}
      <div style={{ backgroundColor: '#10B981', padding: '30px', borderRadius: '20px', textAlign: 'center', marginBottom: '30px', boxShadow: '0 10px 30px rgba(16,185,129,0.4)' }}>
        <h1 style={{ color: 'white', margin: '0 0 20px 0' }}>¿VES ESTE RECUADRO VERDE?</h1>
        <button 
          onClick={downloadPDF}
          style={{ padding: '20px 40px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'white', color: '#10B981', border: 'none', borderRadius: '10px' }}
        >
          SI LO VES, HAZ CLIC AQUÍ PARA EL PDF
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px' }}>
        <h2>Últimas Señales</h2>
        <button onClick={fetchData} style={{ marginBottom: '20px' }}>Actualizar</button>
        {logs.map(log => (
          <div key={log.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>{log.tipo_evento}</strong> - {log.fecha_evento}
          </div>
        ))}
      </div>
    </div>
  );
}
