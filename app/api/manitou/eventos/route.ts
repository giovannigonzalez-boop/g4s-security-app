import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MANITOU_URL;
  const username = process.env.BOLD_USER;
  const password = process.env.BOLD_PASS;

  try {
    // 1. OBTENER TOKEN
    const authRes = await fetch(`${url}/oauth/token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'G4S-Security-App/1.0'
      },
      body: new URLSearchParams({
        'grant_type': 'manitou_contact',
        'username': username || '',
        'password': password || '',
        'context_serial_number': '1',
        'context_contact_type': '0'
      }),
      cache: 'no-store'
    });

    const authData = await authRes.json();
    if (!authData.access_token) {
      return NextResponse.json({ success: false, error: "Fallo de autenticación", detail: authData });
    }

    // 2. CONSULTA DE ACTIVIDAD (Con Headers de Postman)
    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'G4S-Security-App/1.0'
      },
      body: JSON.stringify({
        CustomerId: "BOGCCC0",
        Top: 20
      }),
      cache: 'no-store'
    });

    // Validamos si la respuesta es HTML antes de intentar leerla como JSON
    const textResponse = await activityRes.text();
    
    if (textResponse.trim().startsWith("<!DOCTYPE") || textResponse.trim().startsWith("<html")) {
      return NextResponse.json({ 
        success: false, 
        error: "El servidor Manitou respondió con HTML. Revisa que la URL en las variables de Vercel no termine en '/'",
        htmlPreview: textResponse.substring(0, 150)
      });
    }

    const eventData = JSON.parse(textResponse);
    return NextResponse.json({
      success: true,
      data: eventData.Results || eventData.Data || eventData
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: "Error de conexión", 
      message: error.message 
    }, { status: 500 });
  }
}
