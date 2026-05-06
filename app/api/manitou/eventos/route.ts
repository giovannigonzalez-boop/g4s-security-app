import { NextResponse } from 'next/server';

export async function GET() {
  // Usamos las variables de Supabase que ya configuraste en Vercel
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    // Petición directa a la base de datos de Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/eventos?select=*&order=CreationTime.desc`, {
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

    const data = await response.json();

    // Importante: Mapeamos los datos para que la App los entienda
    // Si tus columnas en Supabase tienen nombres distintos, me avisas.
    return NextResponse.json({
      success: true,
      data: data || []
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: "Error de conexión", 
      message: error.message 
    }, { status: 500 });
  }
}
