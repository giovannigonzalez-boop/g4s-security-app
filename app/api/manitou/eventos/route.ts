import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    // CAMBIO CLAVE: Usamos tu tabla real 'alarm_logs' y ordenamos por 'created_at'
    const response = await fetch(`${supabaseUrl}/rest/v1/alarm_logs?select=*&order=created_at.desc`, {
      headers: {
        'apikey': supabaseKey || '',
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ success: false, error: "Error en Supabase", details: errorText });
    }

    const rawData = await response.json();

    // MAPEAMOS los nombres de Supabase a los que tu App espera para mostrarse bien
    const mappedData = rawData.map((item: any) => ({
      CustomerName: item.nombre_cliente,
      EventDescription: item.tipo_evento,
      CustomerNo: item.cuenta,
      CreationTime: item.created_at,
      lat: item.latitud,
      lng: item.longitud
    }));

    return NextResponse.json({
      success: true,
      data: mappedData || []
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: "Error de conexión", 
      message: error.message 
    }, { status: 500 });
  }
}
