import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MANITOU_URL?.replace(/\/$/, '');
  const username = process.env.BOLD_USER?.trim();
  const password = process.env.BOLD_PASS?.trim();

  // Lista de posibles rutas de autenticación en Manitou Cloud
  const paths = [
    '/manitounext/oauth/token',
    '/manitou/oauth/token',
    '/oauth/token'
  ];

  try {
    let token = null;
    let lastError = null;

    // Probar cada ruta hasta que una funcione
    for (const path of paths) {
      try {
        const res = await fetch(`${url}${path}`, {
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
        const data = await res.json();
        if (data.access_token) {
          token = data.access_token;
          break;
        } else {
          lastError = data;
        }
      } catch (e) {
        continue;
      }
    }

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: "Bloqueo de Gateway", 
        detail: lastError,
        mensaje: "El servidor de Bold rechaza la conexión externa."
      });
    }

    // Si logramos entrar, pedimos la actividad
    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ CustomerId: "BOGCCC0", Top: 20 })
    });

    const events = await activityRes.json();
    return NextResponse.json({ success: true, data: events.Results || events });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
