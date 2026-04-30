"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Power, Download, FileText 
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SFinalMasterPanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(10);
    if (data) setLogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const generatePDF = () => {
    if (logs.length === 0) return alert("No hay datos");
    const doc = new jsPDF() as any;
    doc.setFillColor(225, 29, 72); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("G4S ARC SECURITY", 15, 25);
    doc.setFontSize(10);
    doc.text("REPORTE DE ACTIVIDAD - CONTROL DE CLIENTE", 15, 33);
    const tableData = logs.map(l => [l.fecha_evento, l.tipo_evento, "VERIFICADO"]);
    doc.autoTable({ startY: 50, head: [['HORA', 'EVENTO', 'ESTADO']], body: tableData, headStyles: { fillColor: [40, 40, 40] } });
    doc.save('Reporte_G4S_Cliente.pdf');
  };

  const simulate = async (tipo: string) => {
    const lat = 10.93 + (Math.random() * 0.08);
    const lng = -74.82 + (Math.random() * 0.08);
    await supabase.from('alarm_logs').insert([{ 
      nombre_cliente: "G4S User", cuenta: "BAQ-3733", tipo_evento: tipo, 
      ciudad: "Barranquilla", fecha_evento: new Date().toLocaleTimeString(), latitud: lat, longitud: lng
    }]);
    setCoords({ lat, lng });
    fetchData();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '80px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', borderRight: '1px solid #DDD', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 'bold', marginBottom: '30px' }}>G4S</div>
        <Home size={24} color="#E11D48" />
      </aside>

      {/* CUERPO PRINCIPAL */}
      <main style={{ marginLeft: '80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* BARRA SUPERIOR FIJA PARA EL BOTÓN */}
        <header style={{ height: '80px', backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 50 }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#1E293B' }}>Consola de Seguridad ARC</h2>
          
          <button 
            onClick={generatePDF}
            style={{ 
              backgroundColor: '#E11D48', color: 'white', border: 'none', padding: '12px 25px', 
              borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', 
              alignItems: 'center', gap: '10px', fontSize: '14px', boxShadow: '0 4px 12px rgba(225,29,72,0.3)' 
            }}
          >
            <Download size={18} /> DESCARGAR REPORTE PDF
          </button>
        </header>

        <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
          {/* COLUMNA IZQUIERDA */}
          <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Señales Recientes</h3>
              <RefreshCw size={20} onClick={fetchData} className={loading ? 'animate-spin' : ''} style={{ cursor: 'pointer', color: '#94A3B8' }} />
            </div>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.tipo_evento}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{log.fecha_evento}</div>
              </div>
            ))}
          </section>

          {/* COLUMNA DERECHA */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
               <div onClick={() => { setIsArmed(!isArmed); simulate(isArmed ? 'DESARMADO' : 'ARMADO'); }} 
                style={{ width: '130px', height: '130px', borderRadius: '50%', border: `8px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', cursor: 'pointer', backgroundColor: isArmed ? '#ECFDF5' : '#FFF5F5' }}>
                {isArmed ? <CheckCircle2 size={60} color="#10B981" /> : <XCircle size={60} color="#E11D48" />}
              </div>
              <h3 style={{ margin: 0, color: isArmed ? '#10B981' : '#E11D48' }}>{isArmed ? 'SISTEMA PROTEGIDO' : 'SISTEMA DESARMADO'}</h3>
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px' }}>
              <button onClick={() => simulate('ALERTA DE PÁNICO')} style={{ width: '100%', padding: '15px', backgroundColor: '#FFF1F2', border: '2px solid #E11D48', borderRadius: '12px', color: '#E11D48', fontWeight: 'bold', cursor: 'pointer' }}>
                ACTIVAR PÁNICO SOS
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
