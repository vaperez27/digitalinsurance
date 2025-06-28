
import React from 'react'
import Link from 'next/link'
import { Shield, Phone, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-[#FF7A00]" />
              <span className="font-bold text-xl">Seguros Marketplace</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Tu seguro, simple y en un solo lugar. Cotiza, compara y contrata seguros 
              de las mejores compañías en minutos.
            </p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>+52 55 1234 5678</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>contacto@segurosmarketplace.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Seguros</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/seguros/auto" className="text-gray-300 hover:text-[#FF7A00] transition-colors">
                  Seguro de Auto
                </Link>
              </li>
              <li>
                <Link href="/seguros/vida" className="text-gray-300 hover:text-[#FF7A00] transition-colors">
                  Seguro de Vida
                </Link>
              </li>
              <li>
                <Link href="/seguros/salud" className="text-gray-300 hover:text-[#FF7A00] transition-colors">
                  Seguro de Salud
                </Link>
              </li>
              <li>
                <Link href="/seguros/viaje" className="text-gray-300 hover:text-[#FF7A00] transition-colors">
                  Seguro de Viaje
                </Link>
              </li>
            </ul>
          </div>

          {/* Countries */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Países</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300 flex items-center space-x-2">
                <span>🇲🇽</span>
                <span>México</span>
              </li>
              <li className="text-gray-300 flex items-center space-x-2">
                <span>🇦🇷</span>
                <span>Argentina</span>
              </li>
              <li className="text-gray-300 flex items-center space-x-2">
                <span>🇨🇱</span>
                <span>Chile</span>
              </li>
              <li className="text-gray-300 flex items-center space-x-2">
                <span>🇵🇪</span>
                <span>Perú</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Seguros Marketplace. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
