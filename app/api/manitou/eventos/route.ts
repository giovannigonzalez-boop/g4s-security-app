import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    // Consultamos a Supabase usando Fetch directamente (más rápido y sin errores de librerías)
    const response = await fetch(`${supabaseUrl}/rest/v1/eventos?select=*&order=CreationTime.desc`, {
      headers: {
        'apikey': supabaseKey || '',
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Para que los datos siempre sean frescos al dar "Refresh"
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ success: false, error: "Error de Supabase", details: errorText });
    }

    const data = await response.json();

    // Devolvemos los datos en el formato que tu App ya conoce
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
