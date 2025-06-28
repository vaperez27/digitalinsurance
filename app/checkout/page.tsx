
"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Cart } from '@/lib/types'
import { ArrowLeft, CreditCard, Shield, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const CheckoutPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    buyerDocument: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user) {
      router.push('/login')
      return
    }

    fetchCart()
  }, [session, status, router])

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        buyerName: session.user.name || '',
        buyerEmail: session.user.email || ''
      }))
    }
  }, [session])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCart(result.data)
          
          // Redirect if cart is empty
          if (!result.data?.items || result.data.items.length === 0) {
            toast.error('Tu carrito está vacío')
            router.push('/carrito')
            return
          }
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.error('Error al cargar el carrito')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => total + Number(item.price), 0)
  }

  const calculateTaxes = () => {
    return calculateTotal() * 0.16 // 16% IVA
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.buyerName || !formData.buyerEmail) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    setProcessing(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('¡Compra procesada exitosamente!')
        router.push(`/confirmacion/${result.data.order.id}`)
      } else {
        toast.error(result.error || 'Error al procesar la compra')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Error al procesar la compra')
    } finally {
      setProcessing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/carrito">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Información de Facturación</span>
                </CardTitle>
                <CardDescription>
                  Completa tus datos para procesar la compra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buyerName">Nombre Completo *</Label>
                      <Input
                        id="buyerName"
                        name="buyerName"
                        placeholder="Tu nombre completo"
                        value={formData.buyerName}
                        onChange={handleChange}
                        required
                        disabled={processing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="buyerEmail">Email *</Label>
                      <Input
                        id="buyerEmail"
                        name="buyerEmail"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.buyerEmail}
                        onChange={handleChange}
                        required
                        disabled={processing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buyerPhone">Teléfono</Label>
                      <Input
                        id="buyerPhone"
                        name="buyerPhone"
                        placeholder="+52 55 1234 5678"
                        value={formData.buyerPhone}
                        onChange={handleChange}
                        disabled={processing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="buyerDocument">Documento de Identidad</Label>
                      <Input
                        id="buyerDocument"
                        name="buyerDocument"
                        placeholder="CURP/DNI/RUT/Cédula"
                        value={formData.buyerDocument}
                        onChange={handleChange}
                        disabled={processing}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <Label>Método de Pago</Label>
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">Tarjeta de Crédito/Débito</p>
                          <p className="text-sm text-blue-700">Procesado de forma segura con Stripe</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900 mb-1">Compra 100% Segura</p>
                        <p className="text-sm text-green-700">
                          Tus datos están protegidos con encriptación SSL de grado bancario.
                          No almacenamos información de tarjetas de crédito.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="cta" 
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando Compra...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pagar y Contratar
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart?.items?.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3">
                      {item.product?.companyLogo && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.product.companyLogo}
                            alt={`${item.product.company} logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.product?.name}
                        </h4>
                        <p className="text-sm text-gray-500">{item.product?.company}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.product?.insuranceType?.name}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(Number(item.price))}
                        </p>
                        <p className="text-xs text-gray-500">por año</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA (16%)</span>
                    <span>{formatPrice(calculateTaxes())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-[#005A9C]">
                      {formatPrice(calculateTotal() + calculateTaxes())}
                    </span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">¿Qué incluye tu compra?</h4>
                  <div className="space-y-2">
                    {[
                      'Póliza digital inmediata',
                      'Certificado de cobertura',
                      'Soporte 24/7',
                      'Renovación automática opcional'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutPage
