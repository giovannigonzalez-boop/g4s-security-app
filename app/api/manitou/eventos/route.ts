import { NextResponse } from 'next/server';

export async function GET() {
  // Quitamos cualquier rastro de /manitou o barras finales
  const url = process.env.MANITOU_URL?.replace(/\/manitou$/, '').replace(/\/$/, '');
  const username = process.env.BOLD_USER?.trim();
  const password = process.env.BOLD_PASS?.trim();

  try {
    // 1. INTENTO DE LOGIN CON RUTA "NEXT" (Más moderna)
    // Probamos /manitounext/oauth/token que suele ser la ruta del Web Gateway
    const authRes = await fetch(`${url}/manitounext/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'grant_type': 'manitou_contact',
        'username': username || '',
        'password': password || '',
        'context_serial_number': '1',
        'context_contact_type': '0'
      }),
      cache: 'no-store'
    });

    let authData = await authRes.json();

    // Si la ruta /manitounext/ falla, intentamos la ruta raíz como respaldo
    if (!authData.access_token) {
       const retryRes = await fetch(`${url}/oauth/token`, {
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
       authData = await retryRes.json();
    }
    
    if (!authData.access_token) {
      return NextResponse.json({ 
        success: false, 
        error: "Manitou Gateway sigue bloqueado", 
        detail: authData,
        tip: "Verifica con el soporte de Bold si el usuario APIAPPIA tiene habilitado el acceso Web API."
      });
    }

    // 2. CONSULTA DE ACTIVIDAD
    const activityRes = await fetch(`${url}/manitounext/api/Customer/Activity`, {
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

    const eventData = await activityRes.json();
    return NextResponse.json({
      success: true,
      data: eventData.Results || eventData.Data || eventData
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
