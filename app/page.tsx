"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Power, FileText, Download 
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SClientPanel() {
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

  // --- FUNCIÓN PARA GENERAR EL PDF PARA EL CLIENTE ---
  const generatePDF = () => {
    const doc = new jsPDF() as any;
    
    // Encabezado Corporativo
    doc.setFillColor(225, 29, 72); // Rojo G4S
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("G4S ARC SECURITY", 15, 25);
    doc.setFontSize(10);
    doc.text("REPORTE DE ACTIVIDAD DEL SISTEMA", 15, 33);

    // Información del Cliente
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.text(`Cliente: ${logs[0]?.nombre_cliente || 'Usuario G4S'}`, 15, 55);
    doc.text(`Cuenta: ${logs[0]?.cuenta || 'N/A'}`, 15, 62);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 15, 69);

    // Tabla de Eventos
    const tableData = logs.map(log => [
      log.fecha_evento,
      log.tipo_evento,
      log.ciudad,
      "GESTIONADO POR G4S"
    ]);

    doc.autoTable({
      startY: 80,
      head: [['Hora', 'Evento', 'Ubicación', 'Estado']],
      body: tableData,
      headStyles: { fillColor: [40, 40, 40] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Este documento es un soporte oficial de la gestión de monitoreo de G4S ARC.", 15, doc.internal.pageSize.height - 15);

    doc.save(`Reporte_G4S_${logs[0]?.cuenta || 'Seguridad'}.pdf`);
  };

  const simulate = async (tipo: string) => {
    const lat = 10.93 + (Math.random() * 0.08);
    const lng = -74.82 + (Math.random() * 0.08);
    await supabase.from('alarm_logs').insert([{ 
      nombre_cliente: "Residencia Premium", cuenta: "BAQ-3733", tipo_evento: tipo, 
      ciudad: "Barranquilla", fecha_evento: new Date().toLocaleTimeString(), latitud: lat, longitud: lng
    }]);
    setCoords({ lat, lng });
    fetchData();
  };

  const getMapUrl = (lat: number, lng: number) => {
    return `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=14&l=map&size=450,300&pt=${lng},${lat},pm2rdl`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR CLIENTE */}
      <nav style={{ width: '90px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', width: '55px', height: '55px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', marginBottom: '40px' }}>G4S</div>
        <Home size={28} color="#E11D48" />
        <div style={{ flex: 1 }} />
        <LogOut size={28} color="#94A3B8" onClick={() => window.location.reload()} style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, marginLeft: '90px', padding: '35px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '30px' }}>
        
        <section>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', margin: 0 }}>Mi Seguridad G4S</h1>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Estado de su protección en tiempo real</p>
            </div>
            {/* BOTÓN DESCARGAR REPORTE PDF */}
            <button 
              onClick={generatePDF}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', backgroundColor: '#1E293B', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              <Download size={18} /> Descargar Historial
            </button>
          </header>

          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#334155', margin: 0 }}>Eventos Recientes</h3>
              <button onClick={fetchData} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} color="#94A3B8" />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {logs.map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderRadius: '15px', backgroundColor: '#F8FAFC' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {log.tipo_evento?.includes('PÁNICO') ? <AlertTriangle size={20} color="#E11D48"/> : <ShieldCheck size={20} color="#10B981"/>}
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.tipo_evento}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>{log.fecha_evento}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Estado</div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10B981' }}>PROTEGIDO</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PANEL DERECHO: CONTROL DEL CLIENTE */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulate(isArmed ? 'DESARMADO' : 'ARMADO'); }} 
              style={{ width: '160px', height: '160px', borderRadius: '50%', border: `10px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', backgroundColor: isArmed ? '#ECFDF5' : '#FFF5F5', cursor: 'pointer' }}>
              {isArmed ? <CheckCircle2 size={70} color="#10B981" /> : <XCircle size={70} color="#E11D48" />}
            </div>
            <h2 style={{ color: isArmed ? '#10B981' : '#E11D48', margin: 0, fontSize: '22px', fontWeight: '800' }}>{isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</h2>
            <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '10px' }}>Toca el icono para cambiar estado</p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '15px', color: '#64748B', fontWeight: 'bold', marginBottom: '20px' }}>Botón de Emergencia</h3>
            <button onClick={() => simulate('ALERTA DE PÁNICO')} style={{ width: '100%', padding: '18px', backgroundColor: '#FFF1F2', border: '2px solid #E11D48', borderRadius: '15px', color: '#E11D48', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Bell size={20} /> SOS - PEDIR AYUDA
            </button>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <MapPin size={18} color="#E11D48" />
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Ubicación de mi Sistema</span>
            </div>
            <img src={getMapUrl(coords.lat, coords.lng)} alt="Mapa" style={{ width: '100%', height: '200px', borderRadius: '15px', objectFit: 'cover' }} />
          </div>

        </aside>
      </main>
    </div>
  );
}
