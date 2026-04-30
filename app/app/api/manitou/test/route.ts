import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Extraemos las credenciales ACTUALIZADAS desde Vercel
  const url = process.env.MANITOU_URL; 
  const username = process.env.BOLD_USER; // Ahora será APPIA
  const password = process.env.BOLD_PASS; // Ahora será G4s.2026*

  try {
    // 2. Preparamos los datos para el formato OAUTH de Manitou
    const body = new URLSearchParams();
    body.append('grant_type', 'manitou_contact');
    body.append('username', username || '');
    body.append('password', password || '');
    body.append('context_serial_number', '1');
    body.append('context_contact_type', '0');

    // 3. Llamada al endpoint de token
    const response = await fetch(`${url}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body,
      cache: 'no-store'
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: "¡Conexión exitosa con Manitou Cloud usando credenciales APPIA!",
        access_token_received: !!data.access_token,
        expires_in: data.expires_in
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: data.error_description || "Error de autenticación",
        error_code: data.error,
        tip: "Verifica que en Vercel las variables BOLD_USER y BOLD_PASS coincidan exactamente."
      }, { status: response.status });
    }

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Error de red: No se pudo alcanzar el servidor de Manitou." 
    }, { status: 500 });
  }
}
