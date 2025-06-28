import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Seguros Marketplace - Tu seguro, simple y en un solo lugar",
  description: "Cotiza, compara y contrata seguros de las mejores compañías en minutos. Auto, Vida, Salud, Viajes y Accidentes en México, Argentina, Chile y Perú.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}