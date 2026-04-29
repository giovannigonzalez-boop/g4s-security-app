import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  const USER = process.env.DASHBOARD_USER;
  const PASS = process.env.DASHBOARD_PASSWORD;

  // Si no hay variables, dejamos pasar para no bloquear la app por error
  if (!USER || !PASS) return NextResponse.next();

  if (authHeader) {
    const auth = authHeader.split(' ')[1];
    // Usamos atob (estándar moderno) en lugar de Buffer
    const decoded = atob(auth).split(':');
    const user = decoded[0];
    const pass = decoded[1];

    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Autenticación requerida', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="G4S Secure Dashboard"',
    },
  });
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto las que empiezan por:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono de la pestaña)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
