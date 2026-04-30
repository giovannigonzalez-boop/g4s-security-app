import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MANITOU_URL;
  const username = process.env.BOLD_USER;
  const password = process.env.BOLD_PASS;

  try {
    // 1. Obtener Token
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

    // 2. Rango de tiempo (Últimos 30 días para asegurar datos)
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    // 3. Consulta específica para la cuenta BOGCCC0
    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        CustomerId: "BOGCCC0", // <--- Filtro específico
        Top: 50,
        StartTime: hace30Dias.toISOString().split('.')[0],
        EndTime: hoy.toISOString().split('.')[0],
        IncludeAudits: true,
        IncludeEvents: true
      })
    });

    const eventData = await activityRes.json();
    
    // Extraemos los resultados
    const finalData = eventData.Results || eventData.Data || (Array.isArray(eventData) ? eventData : []);

    return NextResponse.json({
      success: true,
      account: "BOGCCC0",
      data: finalData
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
