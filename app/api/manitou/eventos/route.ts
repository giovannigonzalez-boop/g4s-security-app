import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/alarm_logs?select=*&order=created_at.desc`, {
      headers: {
        'apikey': supabaseKey || '',
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const rawData = await response.json();

    const mappedData = rawData.map((item: any) => {
      const evento = item.tipo_evento || "";
      let eventCode = "LOGGED"; // Estado neutro

      // 1. ACTIVACIÓN DE ICONOS VERDES (ARMADO/DESARMADO)
      if (evento.includes("Activacion") || evento.includes("Cierre") || evento.includes("Armado")) {
        eventCode = "CLOSING"; 
      } else if (evento.includes("Anulacion") || evento.includes("Apertura") || evento.includes("Desarmado")) {
        eventCode = "OPENING";
      }

      // 2. ACTIVACIÓN DE BOTÓN ROJO (ANULAR ALERTA PÁNICO)
      // Usamos los términos detectados en tu tabla alarm_logs
      if (evento.includes("Person detected") || evento.toLowerCase().includes("panico")) {
        eventCode = "BURGLARY";
      }

      // 3. ESTADO ARCHIVADO (FALSA ALARMA ANULADA)
      if (evento.includes("Falsa Alarma Anulada")) {
        eventCode = "ALARM_CANCEL";
      }

      return {
        id: item.id,
        CustomerName: item.nombre_cliente || "Cliente G4S",
        CustomerNo: item.cuenta || "N/A",
        EventDescription: evento,
        CreationTime: item.created_at,
        EventCode: eventCode, // Este campo controla TODA la visualización
        lat: item.latitud,
        lng: item.longitud,
        Status: "Pending"
      };
    });

    return NextResponse.json({
      success: true,
      data: mappedData || []
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
