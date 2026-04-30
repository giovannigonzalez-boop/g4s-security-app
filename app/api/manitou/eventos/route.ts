import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MANITOU_URL?.replace(/\/$/, '');
  const username = process.env.BOLD_USER;
  const password = process.env.BOLD_PASS;

  try {
    // 1. LIMPIEZA DE CREDENCIALES Y LOGIN
    const cleanUser = username?.trim();
    const cleanPass = password?.trim();

    const authRes = await fetch(`${url}/oauth/token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        'grant_type': 'manitou_contact',
        'username': cleanUser || '',
        'password': cleanPass || '',
        'context_serial_number': '1',
        'context_contact_type': '0'
      }),
      cache: 'no-store'
    });

    const authData = await authRes.json();
    
    if (!authData.access_token) {
      return NextResponse.json({ 
        success: false, 
        error: "Credenciales rechazadas por Manitou", 
        detail: authData,
        enviado: { usuario: cleanUser } // Para verificar qué estamos mandando
      });
    }

    // 2. CONSULTA DE ACTIVIDAD (Cuenta BOGCCC0)
    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        CustomerId: "BOGCCC0",
        Top: 50
      }),
      cache: 'no-store'
    });

    const textResponse = await activityRes.text();

    // Verificación de respuesta HTML (Error del servidor)
    if (textResponse.trim().startsWith("<!DOCTYPE") || textResponse.trim().startsWith("<html")) {
      return NextResponse.json({ 
        success: false, 
        error: "El servidor respondió con una página de error (HTML).",
        preview: textResponse.substring(0, 100)
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
