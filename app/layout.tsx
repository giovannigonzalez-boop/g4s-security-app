export const metadata = {
  title: 'G4S Smart Monitoring',
  description: 'Dashboard de Seguridad Profesional',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
