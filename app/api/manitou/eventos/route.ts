import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MANITOU_URL;
  const username = process.env.BOLD_USER;
  const password = process.env.BOLD_PASS;

  try {
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

    if (!token) return NextResponse.json({ success: false, error: "Sin Token" }, { status: 401 });

    // --- CAMBIO AQUÍ: Rango de 7 días para asegurar que traiga datos ---
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);

    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Top: 100,
        // Usamos un formato de fecha más simple que Manitou entiende mejor
        StartTime: hace7Dias.toISOString().split('.')[0], 
        EndTime: hoy.toISOString().split('.')[0],
        IncludeAudits: true,
        IncludeEvents: true
      })
    });

    const eventData = await activityRes.json();
    
    // Verificamos todas las posibles carpetas donde Manitou guarda los eventos
    const finalData = eventData.Results || eventData.Data || (Array.isArray(eventData) ? eventData : []);

    return NextResponse.json({
      success: true,
      data: finalData
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
