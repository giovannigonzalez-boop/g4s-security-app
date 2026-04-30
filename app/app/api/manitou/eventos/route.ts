import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MANITOU_URL;
  const username = process.env.BOLD_USER;
  const password = process.env.BOLD_PASS;

  try {
    // 1. OBTENER TOKEN (Paso ya verificado)
    const authBody = new URLSearchParams();
    authBody.append('grant_type', 'manitou_contact');
    authBody.append('username', username || '');
    authBody.append('password', password || '');
    authBody.append('context_serial_number', '1');
    authBody.append('context_contact_type', '0');

    const authRes = await fetch(`${url}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: authBody
    });

    const authData = await authRes.json();
    const token = authData.access_token;

    if (!token) return NextResponse.json({ error: "No se obtuvo token" }, { status: 401 });

    // 2. CONSULTAR ACTIVIDAD REAL (Solo Lectura)
    // Usamos el endpoint Customer/Activity para ver qué ha pasado
    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      // Pedimos los últimos 10 eventos de la central
      body: JSON.stringify({
         Top: 10,
         IncludeAudits: false // Solo señales, no cambios de sistema
      })
    });

    const eventData = await activityRes.json();

    return NextResponse.json({
      success: true,
      source: "Manitou Real-Time",
      data: eventData
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Error en la consulta de eventos" }, { status: 500 });
  }
}
