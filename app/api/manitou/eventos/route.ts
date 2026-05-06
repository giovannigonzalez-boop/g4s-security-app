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

    if (!response.ok) throw new Error("Fallo en la conexión con Supabase");

    const rawData = await response.json();

    // MAPEADO BASADO EN TU DOCUMENTACIÓN TÉCNICA
    const mappedData = rawData.map((item: any) => {
      const evento = item.tipo_evento || "";
      let eventCode = "LOGGED"; // Estado por defecto (Icono neutro)

      // 1. Lógica para SISTEMA ARMADO / DESARMADO (Iconos Verdes) [cite: 47, 114]
      if (evento.includes("Activacion") || evento.includes("Cierre Tardio") || evento.includes("Armado")) {
        eventCode = "CLOSING"; 
      } else if (evento.includes("Anulacion") || evento.includes("Apertura") || evento.includes("Desarmado")) {
        eventCode = "OPENING";
      }

      // 2. Lógica para PÁNICO y BOTÓN DE ANULACIÓN (Icono Rojo + Botón) [cite: 50, 118]
      if (evento.includes("Person detected") || evento.toLowerCase().includes("panico")) {
        eventCode = "BURGLARY";
      }

      // 3. Lógica para señales ya ANULADAS [cite: 119]
      if (evento.includes("Falsa Alarma Anulada")) {
        eventCode = "ALARM_CANCEL";
      }

      return {
        id: item.id,
        CustomerName: item.nombre_cliente, // [cite: 73]
        CustomerNo: item.cuenta, // [cite: 74]
        EventDescription: item.tipo_evento, // 
        CreationTime: item.created_at, // [cite: 77]
        EventCode: eventCode, // El "cerebro" de la visualización
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
