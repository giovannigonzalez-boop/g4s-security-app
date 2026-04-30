"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, Bell, ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  LogOut, AlertTriangle, MapPin, Power, FileText, Download 
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function G4SClientPremiumPanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ lat: 10.9685, lng: -74.7813 });

  // 1. CARGA DE DATOS
  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('alarm_logs').select('*').order('id', { ascending: false }).limit(10);
    if (data) setLogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // 2. GENERACIÓN DE REPORTE PDF
  const generatePDF = () => {
    if (logs.length === 0) return alert("No hay señales para reportar.");
    
    const doc = new jsPDF() as any;
    
    // Encabezado corporativo
    doc.setFillColor(225, 29, 72); // Rojo G4S
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("G4S ARC SECURITY", 15, 25);
    doc.setFontSize(10);
    doc.text("REPORTE OFICIAL DE MONITOREO - CLIENTE FINAL", 15, 33);

    // Info del Cliente
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.text(`Cliente: ${logs[0]?.nombre_cliente || 'Abonado G4S'}`, 15, 55);
    doc.text(`Número de Cuenta: ${logs[0]?.cuenta || 'BAQ-3733'}`, 15, 62);
    doc.text(`Fecha del Reporte: ${new Date().toLocaleString()}`, 15, 69);

    // Tabla
    const tableData = logs.map(log => [
      log.fecha_evento,
      log.tipo_evento,
      log.ciudad || "Barranquilla",
      "VERIFICADO"
    ]);

    doc.autoTable({
      startY: 75,
      head: [['HORA', 'EVENTO', 'UBICACIÓN', 'ESTADO']],
      body: tableData,
      headStyles: { fillColor: [40, 40, 40] },
      styles: { fontSize: 9 },
    });

    doc.save(`Reporte_Seguridad_G4S.pdf`);
  };

  // 3. SIMULACIÓN Y ACTUALIZACIÓN DE MAPA
  const simulate = async (tipo: string) => {
    const lat = 10.93 + (Math.random() * 0.08);
    const lng = -74.82 + (Math.random() * 0.08);
    
    await supabase.from('alarm_logs').insert([{ 
      nombre_cliente: "G4S User", cuenta: "BAQ-3733", tipo_evento: tipo, 
      ciudad: "Barranquilla", fecha_evento: new Date().toLocaleTimeString(), 
      latitud: lat, longitud: lng
    }]);
    
    setCoords({ lat, lng });
    fetchData();
  };

  const getMapUrl = (lat: number, lng: number) => {
    return `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=14&l=map&size=450,300&pt=${lng},${lat},pm2rdl`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <nav style={{ width: '90px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ backgroundColor: '#E11D48', color: 'white', width: '55px', height: '55px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', marginBottom: '40px' }}>G4S</div>
        <Home size={28} color="#E11D48" />
        <div style={{ flex: 1 }} />
        <LogOut size={28} color="#94A3B8" onClick={() => window.location.reload()} style={{ cursor: 'pointer', marginBottom: '20px' }} />
      </nav>

      {/* CONTENIDO */}
      <main style={{ flex: 1, marginLeft: '90px', padding: '35px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '30px' }}>
        
        <section>
          {/* CABECERA CON BOTÓN PDF */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1E293B', margin: 0 }}>Panel de Seguridad</h1>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Control para Cliente Final</p>
            </div>
            
            <button 
              onClick={generatePDF}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(225, 29, 72, 0.2)' }}
            >
              <Download size={18} /> DESCARGAR REPORTE PDF
            </button>
          </header>

          {/* LISTA DE EVENTOS */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#1E293B', margin: 0 }}>Historial de Actividad</h3>
              <RefreshCw size={20} onClick={fetchData} className={loading ? 'animate-spin' : ''} style={{cursor:'pointer', color:'#94A3B8'}} />
            </div>
            {logs.map((log) => (
              <div key={log.id} 
                onClick={() => log.latitud && setCoords({lat: log.latitud, lng: log.longitud})}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderRadius: '15px', backgroundColor: '#F8FAFC', marginBottom: '10px', cursor:'pointer' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  {log.tipo_evento?.includes('PÁNICO') ? <AlertTriangle size={20} color="#E11D48"/> : <ShieldCheck size={20} color="#10B981"/>}
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.tipo_evento}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{log.fecha_evento}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10B981' }}>OK</div>
              </div>
            ))}
          </div>
        </section>

        {/* COLUMNA DERECHA */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* CONTROL DE ARMADO */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div onClick={() => { setIsArmed(!isArmed); simulate(isArmed ? 'DESARMADO' : 'ARMADO'); }} 
              style={{ width: '150px', height: '150px', borderRadius: '50%', border: `10px solid ${isArmed ? '#10B981' : '#E11D48'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', backgroundColor: isArmed ? '#ECFDF5' : '#FFF5F5', cursor: 'pointer' }}>
              {isArmed ? <CheckCircle2 size={70} color="#10B981" /> : <XCircle size={70} color="#E11D48" />}
            </div>
            <h2 style={{ color: isArmed ? '#10B981' : '#E11D48', margin: 0, fontSize: '20px', fontWeight: '800' }}>{isArmed ? 'SISTEMA ARMADO' : 'SISTEMA DESARMADO'}</h2>
          </div>

          {/* COMANDOS RÁPIDOS */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '14px', color: '#64748B', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Simulación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <button onClick={() => simulate('PÁNICO')} style={simBtnS}><Bell size={18} color="#E11D48"/><br/>Pánico</button>
              <button onClick={() => simulate('APERTURA')} style={simBtnS}><Power size={18} color="#10B981"/><br/>Apertura</button>
              <button onClick={() => simulate('CIERRE')} style={simBtnS}><ShieldCheck size={18} color="#3B82F6"/><br/>Cierre</button>
            </div>
          </div>

          {/* MAPA */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <MapPin size={18} color="#E11D48" />
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Ubicación Actual</span>
            </div>
            <img src={getMapUrl(coords.lat, coords.lng)} alt="Mapa" style={{ width: '100%', height: '220px', borderRadius: '15px', objectFit: 'cover' }} />
          </div>

        </aside>
      </main>
    </div>
  );
}

const simBtnS = { padding: '15px 5px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer', textAlign: 'center' as const, fontSize: '10px', fontWeight: 'bold' as const };
