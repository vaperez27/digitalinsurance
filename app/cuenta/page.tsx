
"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Order, Policy } from '@/lib/types'
import { 
  User, 
  FileText, 
  ShoppingBag, 
  Download, 
  Calendar,
  DollarSign,
  Shield,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

const AccountPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user) {
      router.push('/login')
      return
    }

    fetchAccountData()
  }, [session, status, router])

  const fetchAccountData = async () => {
    try {
      const [ordersRes, policiesRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/policies')
      ])

      if (ordersRes.ok) {
        const ordersResult = await ordersRes.json()
        if (ordersResult.success) {
          setOrders(ordersResult.data || [])
        }
      }

      if (policiesRes.ok) {
        const policiesResult = await policiesRes.json()
        if (policiesResult.success) {
          setPolicies(policiesResult.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching account data:', error)
      toast.error('Error al cargar datos de la cuenta')
    } finally {
      setLoading(false)
    }
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

  const formatPrice = (price: number, currency?: string, symbol?: string) => {
    const currencySymbol = symbol || '$'
    return `${currencySymbol}${price.toLocaleString()}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Activa</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>
      case 'expired':
        return <Badge variant="warning">Expirada</Badge>
      case 'paid':
        return <Badge variant="success">Pagada</Badge>
      case 'pending':
        return <Badge variant="warning">Pendiente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Cuenta</h1>
          <p className="text-gray-600">
            Gestiona tus seguros, órdenes y datos personales
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-[#005A9C]" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{policies.length}</p>
                  <p className="text-sm text-gray-600">Pólizas Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-[#FF7A00]" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  <p className="text-sm text-gray-600">Órdenes Totales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${orders.reduce((sum, order) => sum + Number(order.total), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Gastado</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date(session?.user?.createdAt || Date.now()).getFullYear()}
                  </p>
                  <p className="text-sm text-gray-600">Cliente Desde</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Mi Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Mis Pólizas</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Mis Órdenes</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Revisa y actualiza tus datos personales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{session?.user?.name || 'No especificado'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{session?.user?.email}</span>
                      </div>
                    </div>

                    {session?.user?.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Teléfono</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{session.user.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {session?.user?.document && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Documento</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{session.user.document}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-700">Rol</label>
                      <div className="mt-1">
                        <Badge variant={session?.user?.role === 'admin' ? 'default' : 'secondary'}>
                          {session?.user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Miembro desde</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(session?.user?.createdAt || Date.now()).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <CardTitle>Mis Pólizas</CardTitle>
                <CardDescription>
                  Gestiona tus pólizas activas y descarga documentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {policies.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes pólizas activas
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Contrata tu primer seguro para ver tus pólizas aquí
                    </p>
                    <Button variant="cta" onClick={() => router.push('/')}>
                      Explorar Seguros
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {policies.map((policy) => (
                      <div key={policy.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {policy.product?.companyLogo && (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={policy.product.companyLogo}
                                  alt={`${policy.product.company} logo`}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {policy.product?.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {policy.product?.company}
                              </p>
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {policy.product?.insuranceType?.name}
                                </Badge>
                                {getStatusBadge(policy.status)}
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>Póliza: <span className="font-mono">{policy.policyNumber}</span></p>
                                <p>Vigencia: {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}</p>
                                <p>Prima Anual: {formatPrice(Number(policy.premium))}</p>
                              </div>
                            </div>
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Órdenes</CardTitle>
                <CardDescription>
                  Revisa todas tus compras y transacciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes órdenes
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Realiza tu primera compra para ver tu historial aquí
                    </p>
                    <Button variant="cta" onClick={() => router.push('/')}>
                      Explorar Seguros
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Orden #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              {formatPrice(Number(order.total), order.currency, order.country?.currencySymbol)}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.product?.insuranceType?.name}
                                </Badge>
                                <span>{item.product?.name}</span>
                              </div>
                              <span className="font-medium">
                                {formatPrice(Number(item.price), order.currency, order.country?.currencySymbol)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* View Details Button */}
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/confirmacion/${order.id}`)}
                          >
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

export default AccountPage
