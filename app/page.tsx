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

export default function G4SPremiumPanel() {
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
    if (logs.length === 0) return alert("No hay datos para exportar");
    const doc = new jsPDF() as any;
    doc.setFillColor(225, 29, 72); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("G4S ARC SECURITY", 15, 25);
    doc.setFontSize(10);
    doc.text("REPORTE DE ACTIVIDAD - PANEL DE CLIENTE", 15, 33);
    
    const tableData = logs.map(log => [log.fecha_evento, log.tipo_evento, "Barranquilla", "GESTIONADO"]);
    doc.autoTable({
      startY: 50,
      head: [['HORA', 'EVENTO', 'CIUDAD', 'ESTADO']],
      body: tableData,
      headStyles: { fillColor: [40, 40, 40] }
    });
    doc.save('Reporte_G4S.pdf');
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '80px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', borderRight: '1px solid #DDD', position: 'fixed', height: '100vh' }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 'bold', marginBottom: '30px' }}>G4S</div>
        <Home size={24} color="#E11D48" />
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ marginLeft: '80px', flex: 1, padding: '40px' }}>
        
        {/* CABECERA CRÍTICA CON BOTÓN PDF */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '25px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '2px solid #E11D48' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1E293B' }}>Centro de Operaciones ARC</h1>
            <p style={{ margin: 0, color: '#64748B' }}>Gestión de Seguridad Residencial</p>
          </div>
          
          <button 
            onClick={generatePDF}
            style={{ 
              backgroundColor: '#E11D48', color: 'white', border: 'none', padding: '15px 25px', 
              borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', 
              alignItems: 'center', gap: '10px', fontSize: '16px' 
            }}
          >
            <Download size={20} /> DESCARGAR PDF
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
          {/* COLUMNA IZQUIERDA: EVENTOS */}
          <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Historial de Señales</h3>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{log.tipo_evento}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{log.fecha_evento}</div>
                </div>
                <div style={{ color: '#10B981', fontWeight: 'bold' }}>ARMADO</div>
              </div>
            ))}
          </section>

          {/* COLUMNA DERECHA: CONTROLES */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
               <div onClick={() => { setIsArmed(!isArmed); simulate(isArmed ? 'DESARMADO' : 'ARMADO'); }} 
                style={{ width: '120px', height: '120px', borderRadius: '50%', border: `8px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', cursor: 'pointer' }}>
                {isArmed ? <CheckCircle2 size={50} color="#10B981" /> : <XCircle size={50} color="#E11D48" />}
              </div>
              <h3 style={{ margin: 0 }}>{isArmed ? 'SISTEMA PROTEGIDO' : 'SISTEMA DESARMADO'}</h3>
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>Simular Emergencia</p>
              <button onClick={() => simulate('PÁNICO')} style={{ width: '100%', padding: '12px', backgroundColor: '#FFF1F2', border: '1px solid #E11D48', borderRadius: '10px', color: '#E11D48', fontWeight: 'bold', cursor: 'pointer' }}>
                ACTIVAR PÁNICO SOS
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
