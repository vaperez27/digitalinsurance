
"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardStats } from '@/lib/types'
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const AdminDashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user || session.user.role !== 'admin') {
      toast.error('Acceso denegado')
      router.push('/')
      return
    }

    fetchDashboardStats()
  }, [session, status, router])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStats(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      toast.error('Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Pagado</Badge>
      case 'pending':
        return <Badge variant="warning">Pendiente</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80 bg-gray-200 rounded"></div>
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
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
            <p className="text-gray-600">Gestiona tu marketplace de seguros</p>
          </div>
          
          <div className="flex space-x-2">
            <Link href="/admin/products">
              <Button variant="outline">Gestionar Productos</Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline">Gestionar Usuarios</Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="cta">Ver Órdenes</Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-[#005A9C]" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                  <p className="text-sm text-gray-600">Órdenes Totales</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{stats?.todayOrders || 0} hoy</span>
                  </div>
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
                    {formatPrice(stats?.totalRevenue || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Ingresos Totales</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>En crecimiento</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-[#FF7A00]" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.newUsers || 0}</p>
                  <p className="text-sm text-gray-600">Nuevos Usuarios Hoy</p>
                  <div className="flex items-center text-xs text-blue-600 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Este día</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.activePolicies || 0}</p>
                  <p className="text-sm text-gray-600">Pólizas Activas</p>
                  <div className="flex items-center text-xs text-purple-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>Vigentes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Órdenes Recientes</span>
              </CardTitle>
              <CardDescription>Las últimas 5 órdenes del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">#{order.orderNumber}</p>
                        <p className="text-xs text-gray-600">{order.buyerName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(Number(order.total))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay órdenes recientes
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Productos Más Vendidos</span>
              </CardTitle>
              <CardDescription>Los productos con más ventas</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.topProducts && stats.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {stats.topProducts.map((item, index) => (
                    <div key={item.product?.id || index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#005A9C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.product?.name}</p>
                          <p className="text-xs text-gray-600">{item.product?.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{item.sales} ventas</p>
                        <p className="text-xs text-gray-600">
                          {formatPrice(item.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay datos de productos
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sales by Country */}
        {stats?.salesByCountry && stats.salesByCountry.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Ventas por País</span>
              </CardTitle>
              <CardDescription>Distribución de ventas por región</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.salesByCountry.map((item) => (
                  <div key={item.country?.id} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl mb-1">
                      {item.country?.code === 'MX' ? '🇲🇽' :
                       item.country?.code === 'AR' ? '🇦🇷' :
                       item.country?.code === 'CL' ? '🇨🇱' :
                       item.country?.code === 'PE' ? '🇵🇪' : '🌍'}
                    </p>
                    <h3 className="font-semibold text-gray-900">{item.country?.name}</h3>
                    <p className="text-sm text-gray-600">{item.sales} ventas</p>
                    <p className="text-sm font-semibold text-[#005A9C]">
                      {formatPrice(item.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/admin/products">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-[#005A9C] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Gestionar Productos</h3>
                <p className="text-sm text-gray-600">Agregar, editar y gestionar productos de seguros</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-[#FF7A00] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Gestionar Usuarios</h3>
                <p className="text-sm text-gray-600">Ver y administrar usuarios registrados</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Ver Órdenes</h3>
                <p className="text-sm text-gray-600">Revisar y gestionar todas las órdenes</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminDashboard
