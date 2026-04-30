import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MANITOU_URL;
  const username = process.env.BOLD_USER;
  const password = process.env.BOLD_PASS;

  try {
    // 1. Obtener el Token de acceso
    const authBody = new URLSearchParams();
    authBody.append('grant_type', 'manitou_contact');
    authBody.append('username', username || '');
    authBody.append('password', password || '');
    authBody.append('context_serial_number', '1');
    authBody.append('context_contact_type', '0');

    const authRes = await fetch(`${url}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: authBody,
      cache: 'no-store'
    });

    const authData = await authRes.json();
    const token = authData.access_token;

    if (!token) {
      return NextResponse.json({ success: false, error: "No se pudo obtener el token" }, { status: 401 });
    }

    // 2. Definir rango de tiempo (Últimas 24 horas)
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    // 3. Consultar la actividad real a Manitou
    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Top: 50,
        StartTime: ayer.toISOString(),
        EndTime: hoy.toISOString(),
        IncludeAudits: true,
        IncludeEvents: true
      })
    });

    const eventData = await activityRes.json();
    
    // Manitou suele devolver los datos dentro de una propiedad llamada 'Results'
    const finalData = eventData.Results || eventData.Data || eventData;

    return NextResponse.json({
      success: true,
      data: Array.isArray(finalData) ? finalData : []
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Error de conexión con Manitou" 
    }, { status: 500 });
  }
}
