import { NextResponse } from 'next/server';

export async function GET() {
  // Estas variables las lee de lo que configuraste en Vercel
  const url = process.env.MANITOU_URL;
  const username = process.env.BOLD_USER;
  const password = process.env.BOLD_PASS;

  try {
    // Configuramos el cuerpo de la petición según el estándar de Bold Group (Manitou)
    const body = new URLSearchParams();
    body.append('grant_type', 'manitou_contact');
    body.append('username', username || '');
    body.append('password', password || '');
    body.append('context_serial_number', '1');
    body.append('context_contact_type', '0');

    // Hacemos la llamada al servidor de Manitou Cloud
    const response = await fetch(`${url}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body
    });

    const data = await response.json();

    if (response.ok) {
      // Si Manitou nos acepta, nos devuelve un token
      return NextResponse.json({ 
        success: true, 
        message: "¡Conexión exitosa con Manitou Cloud!",
        token_type: data.token_type,
        expires_in: data.expires_in
      });
    } else {
      // Si Manitou nos rechaza (por usuario o clave mal puestos en Vercel)
      return NextResponse.json({ 
        success: false, 
        error: data.error_description || "Error de credenciales en Manitou" 
      }, { status: response.status });
    }

  } catch (error) {
    // Si el servidor g4s.manitoucloud.com no responde o la URL está mal
    return NextResponse.json({ 
      success: false, 
      error: "No se pudo alcanzar el servidor de Manitou Cloud. Revisa la URL." 
    }, { status: 500 });
  }
}
