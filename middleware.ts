import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // IMPORTANTE: Ambos vienen de 'next/server'

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  const USER = process.env.DASHBOARD_USER;
  const PASS = process.env.DASHBOARD_PASSWORD;

  // Si no hay variables, dejamos pasar para no bloquear
  if (!USER || !PASS) return NextResponse.next();

  if (authHeader) {
    try {
      const auth = authHeader.split(' ')[1];
      const decoded = atob(auth).split(':');
      const user = decoded[0];
      const pass = decoded[1];

      if (user === USER && pass === PASS) {
        return NextResponse.next();
      }
    } catch (e) {
      // Error de decodificación
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
