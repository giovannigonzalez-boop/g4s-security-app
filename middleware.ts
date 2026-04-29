import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  // Estas son las variables que pusiste en Vercel
  const USER = process.env.DASHBOARD_USER;
  const PASS = process.env.DASHBOARD_PASSWORD;

  if (authHeader) {
    const auth = authHeader.split(' ')[1];
    const [user, pass] = Buffer.from(auth, 'base64').toString().split(':');

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

// Esto protege todas las rutas de la aplicación
export const config = {
  matcher: '/:path*',
};
