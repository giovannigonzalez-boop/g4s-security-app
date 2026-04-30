import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MANITOU_URL;
  const username = process.env.BOLD_USER;
  const password = process.env.BOLD_PASS;

  try {
    // 1. LOGIN
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
    if (!authData.access_token) return NextResponse.json({ error: "Error de Login", detail: authData });

    // 2. CONSULTA (Ajustada para máxima compatibilidad)
    // Intentamos con una fecha fija muy simple para descartar errores de formato ISO
    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        CustomerId: "BOGCCC0",
        Top: 20
      })
    });

    // --- EL PARACAÍDAS ---
    const contentType = activityRes.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const htmlError = await activityRes.text();
      return NextResponse.json({ 
        success: false, 
        error: "Manitou respondió con una página HTML en lugar de datos. Posible URL incorrecta.",
        preview: htmlError.substring(0, 200) // Vemos el inicio del error
      });
    }

    const eventData = await activityRes.json();
    return NextResponse.json({
      success: true,
      data: eventData.Results || eventData
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
