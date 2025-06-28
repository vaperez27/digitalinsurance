
"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  Heart, 
  Shield, 
  Plane, 
  AlertTriangle, 
  ShoppingCart, 
  User, 
  LogOut,
  Globe,
  Menu,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const Header = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [selectedCountry, setSelectedCountry] = useState('MX')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Wait for client-side mount to complete
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch cart items count
  useEffect(() => {
    if (session?.user?.id && isMounted) {
      fetchCartCount()
    }
  }, [session, isMounted])

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCartItemsCount(result.data?.items?.length || 0)
        }
      }
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const insuranceTypes = [
    { name: 'Auto', href: '/seguros/auto', icon: Car },
    { name: 'Vida', href: '/seguros/vida', icon: Heart },
    { name: 'Salud', href: '/seguros/salud', icon: Shield },
    { name: 'Viaje', href: '/seguros/viaje', icon: Plane },
    { name: 'Accidentes', href: '/seguros/accidentes', icon: AlertTriangle },
  ]

  const countries = [
    { code: 'MX', name: 'México', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  ]

  // Prevent hydration mismatch by not rendering auth-dependent content on server
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto max-w-6xl flex h-16 items-center px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-[#005A9C]" />
            <span className="font-bold text-xl text-[#005A9C]">Seguros Marketplace</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-6xl flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-[#005A9C]" />
          <span className="font-bold text-xl text-[#005A9C] hidden sm:block">
            Seguros Marketplace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center ml-8 space-x-6">
          {insuranceTypes.map((type) => {
            const Icon = type.icon
            return (
              <Link
                key={type.name}
                href={type.href}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-[#005A9C] transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{type.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Country Selector */}
          <div className="hidden sm:flex items-center space-x-1 text-sm">
            <Globe className="h-4 w-4 text-gray-500" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border-none bg-transparent text-sm focus:outline-none"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cart */}
          {session?.user && (
            <Link href="/carrito" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {/* Auth Buttons */}
          {status === 'loading' ? (
            <div className="flex space-x-2">
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : session?.user ? (
            <div className="hidden sm:flex items-center space-x-2">
              <Link href="/cuenta">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Mi Cuenta</span>
                </Button>
              </Link>
              {session.user.role === 'admin' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/registro">
                <Button variant="cta" size="sm">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="container mx-auto max-w-6xl px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="grid grid-cols-2 gap-4">
              {insuranceTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Link
                    key={type.name}
                    href={type.href}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 text-[#005A9C]" />
                    <span className="text-sm font-medium">{type.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Auth Actions */}
            <div className="border-t pt-4">
              {session?.user ? (
                <div className="space-y-2">
                  <Link href="/cuenta" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Mi Cuenta
                    </Button>
                  </Link>
                  {session.user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleSignOut()
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/registro" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="cta" className="w-full">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
