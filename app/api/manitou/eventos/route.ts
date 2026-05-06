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
      let finalEventCode = "LOGGED"; 
      const evento = item.tipo_evento || "";

      // 1. Detectar PÁNICO para mostrar el BOTÓN ROJO
      if (evento.includes("Person detected") || evento.toLowerCase().includes("panico")) {
        finalEventCode = "BURGLARY";
      } 
      // 2. Detectar ARMADO para icono VERDE
      else if (evento.includes("Activacion") || evento.includes("Cierre") || evento.includes("Armado")) {
        finalEventCode = "CLOSING";
      } 
      // 3. Detectar DESARMADO/ANULACIÓN para icono VERDE
      else if (evento.includes("Anulacion") || evento.includes("Apertura") || evento.includes("Desarmado")) {
        finalEventCode = "OPENING";
      }

      return {
        CustomerName: item.nombre_cliente || "Cliente G4S",
        EventDescription: evento,
        CustomerNo: item.cuenta || "N/A",
        CreationTime: item.created_at,
        EventCode: finalEventCode, // Este es el que activa los botones
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
