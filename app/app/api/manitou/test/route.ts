import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Extraemos las credenciales desde las variables de entorno de Vercel
  const url = process.env.MANITOU_URL; // https://g4s.manitoucloud.com/manitou
  const username = process.env.BOLD_USER; // INNOVATION
  const password = process.env.BOLD_PASS; // Colombia.2025

  try {
    // 2. Preparamos los datos en formato x-www-form-urlencoded como pide Bold Group
    const body = new URLSearchParams();
    body.append('grant_type', 'manitou_contact');
    body.append('username', username || '');
    body.append('password', password || '');
    body.append('context_serial_number', '1');
    body.append('context_contact_type', '0');

    // 3. Hacemos la petición POST al endpoint de OAUTH
    const response = await fetch(`${url}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body,
      cache: 'no-store' // Para evitar que el navegador guarde una respuesta vieja
    });

    const data = await response.json();

    // 4. Verificamos si la conexión fue exitosa
    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: "¡Conexión exitosa con Manitou Cloud!",
        access_token_received: !!data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: data.error_description || "Error de autenticación",
        details: data.error || "Revisa las credenciales en Vercel"
      }, { status: response.status });
    }

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "No se pudo alcanzar el servidor. Verifica la URL en Vercel." 
    }, { status: 500 });
  }
}
