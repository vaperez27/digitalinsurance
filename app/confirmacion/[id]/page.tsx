
"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Order } from '@/lib/types'
import { CheckCircle, Download, FileText, ArrowLeft, Home } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const ConfirmationPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user) {
      router.push('/login')
      return
    }

    if (orderId) {
      fetchOrder()
    }
  }, [session, status, router, orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setOrder(result.data)
        } else {
          toast.error('Orden no encontrada')
          router.push('/cuenta')
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Error al cargar la orden')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, currency?: string, symbol?: string) => {
    const currencySymbol = symbol || '$'
    return `${currencySymbol}${price.toLocaleString()}`
  }

  const downloadPolicy = async (policyNumber: string) => {
    try {
      const response = await fetch(`/api/policies/${policyNumber}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `poliza-${policyNumber}.txt`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success('Póliza descargada exitosamente')
      } else {
        toast.error('Error al descargar la póliza')
      }
    } catch (error) {
      console.error('Error downloading policy:', error)
      toast.error('Error al descargar la póliza')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Orden no encontrada
            </h1>
            <Link href="/cuenta">
              <Button variant="cta">
                Ver Mis Órdenes
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Felicitaciones!
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Tu compra ha sido procesada exitosamente
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-green-800 font-medium">Número de Orden</p>
            <p className="text-2xl font-bold text-green-900">{order.orderNumber}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Compra</CardTitle>
              <CardDescription>
                Fecha: {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Purchased Products */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Productos Contratados</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      {item.product?.companyLogo && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          <Image
                            src={item.product.companyLogo}
                            alt={`${item.product.company} logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">{item.product?.company}</p>
                        <Badge variant="outline" className="text-xs">
                          {item.product?.insuranceType?.name}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(Number(item.price), order.currency, order.country?.currencySymbol)}
                        </p>
                        <p className="text-sm text-gray-500">por año</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Payment Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Resumen de Pago</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(Number(order.subtotal), order.currency, order.country?.currencySymbol)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA (16%)</span>
                    <span>{formatPrice(Number(order.taxes), order.currency, order.country?.currencySymbol)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Pagado</span>
                    <span className="text-[#005A9C]">
                      {formatPrice(Number(order.total), order.currency, order.country?.currencySymbol)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Billing Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Información de Facturación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="font-medium">{order.buyerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{order.buyerEmail}</p>
                  </div>
                  {order.buyerPhone && (
                    <div>
                      <span className="text-gray-600">Teléfono:</span>
                      <p className="font-medium">{order.buyerPhone}</p>
                    </div>
                  )}
                  {order.buyerDocument && (
                    <div>
                      <span className="text-gray-600">Documento:</span>
                      <p className="font-medium">{order.buyerDocument}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policies */}
          {order.policies && order.policies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Tus Pólizas</span>
                </CardTitle>
                <CardDescription>
                  Descarga tus pólizas y certificados de cobertura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.policies.map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Póliza #{policy.policyNumber}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Vigencia: {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPolicy(policy.policyNumber)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>¿Qué sigue?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#005A9C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Recibe confirmación por email</h4>
                    <p className="text-sm text-gray-600">
                      Hemos enviado todos los detalles a {order.buyerEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#005A9C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Guarda tus documentos</h4>
                    <p className="text-sm text-gray-600">
                      Descarga y conserva tus pólizas en un lugar seguro
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#005A9C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">¡Tu cobertura ya está activa!</h4>
                    <p className="text-sm text-gray-600">
                      Puedes usar tus beneficios desde este momento
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cuenta">
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver Mi Cuenta
              </Button>
            </Link>
            <Link href="/">
              <Button variant="cta" size="lg">
                <Home className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ConfirmationPage
