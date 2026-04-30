import { NextResponse } from 'next/server';

export async function GET() {
  // Asegúrate de que en Vercel BOLD_URL sea: https://g4s.manitoucloud.com
  // OJO: Sin el "/manitou" al final de la variable de entorno
  const url = process.env.MANITOU_URL?.replace(/\/manitou$/, '').replace(/\/$/, '');
  const username = process.env.BOLD_USER;
  const password = process.env.BOLD_PASS;

  try {
    // 1. LOGIN - En Cloud suele ser /manitounext/oauth/token o /oauth/token
    // Probaremos la ruta estándar de Cloud
    const authRes = await fetch(`${url}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'grant_type': 'manitou_contact',
        'username': username || '',
        'password': password || '',
        'context_serial_number': '1',
        'context_contact_type': '0'
      })
    });

    const authData = await authRes.json();
    
    if (!authData.access_token) {
      return NextResponse.json({ 
        success: false, 
        error: "Error de autenticación", 
        detail: authData,
        attemptedUrl: `${url}/oauth/token`
      });
    }

    // 2. CONSULTA DE ACTIVIDAD
    // En Manitou Cloud la ruta de la API suele ser directa
    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        CustomerId: "BOGCCC0",
        Top: 20
      })
    });

    const textResponse = await activityRes.text();

    // Si recibimos HTML, es que la ruta /api/ no existe en la raíz
    if (textResponse.includes("<!DOCTYPE")) {
      return NextResponse.json({ 
        success: false, 
        error: "Ruta de API no encontrada en la raíz. Intentando ruta alternativa...",
        urlProbada: `${url}/api/Customer/Activity`
      });
    }

    const eventData = JSON.parse(textResponse);
    return NextResponse.json({
      success: true,
      data: eventData.Results || eventData
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
