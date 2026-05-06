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
      // Lógica para que los botones cambien a verde y detecte PÁNICO
      let finalEventCode = "LOGGED"; // Por defecto
      let description = item.tipo_evento;

      // Traducimos tus textos de Supabase a los estados de la App
      if (item.tipo_evento?.includes("Activacion") || item.tipo_evento?.includes("Armado")) {
        finalEventCode = "CLOSING"; // Esto activa el icono verde de ARMADO
      } else if (item.tipo_evento?.includes("Anulacion") || item.tipo_evento?.includes("Desarmado")) {
        finalEventCode = "OPENING"; // Esto activa el icono verde de DESARMADO
      } else if (item.tipo_evento?.includes("Pánico") || item.tipo_evento?.includes("Person detected")) {
        finalEventCode = "BURGLARY"; // Esto activa el BOTÓN ROJO DE ANULAR PÁNICO
      }

      return {
        CustomerName: item.nombre_cliente,
        EventDescription: description,
        CustomerNo: item.cuenta,
        CreationTime: item.created_at,
        EventCode: finalEventCode, // CAMBIO CLAVE para los iconos y botones
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
