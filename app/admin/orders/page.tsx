
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Order } from '@/lib/types'
import { ArrowLeft, Search, Filter, Eye, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const AdminOrdersPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user || session.user.role !== 'admin') {
      toast.error('Acceso denegado')
      router.push('/')
      return
    }

    fetchOrders()
  }, [session, status, router, currentPage, statusFilter])

  const fetchOrders = async () => {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('page', currentPage.toString())
      queryParams.append('limit', '10')
      if (statusFilter) queryParams.append('status', statusFilter)

      const response = await fetch(`/api/admin/orders?${queryParams.toString()}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setOrders(result.data || [])
          setTotalPages(result.pagination?.totalPages || 1)
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error al cargar órdenes')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, currency?: string, symbol?: string) => {
    const currencySymbol = symbol || '$'
    return `${currencySymbol}${price.toLocaleString()}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Pagado</Badge>
      case 'pending':
        return <Badge variant="warning">Pendiente</Badge>
      case 'processing':
        return <Badge className="bg-blue-500">Procesando</Badge>
      case 'completed':
        return <Badge variant="success">Completado</Badge>
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
            <div className="h-96 bg-gray-200 rounded"></div>
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
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Órdenes</h1>
              <p className="text-gray-600">Administra todas las órdenes del marketplace</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Órdenes</span>
                </CardTitle>
                <CardDescription>
                  {orders.length} órdenes encontradas
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="paid">Pagado</SelectItem>
                    <SelectItem value="processing">Procesando</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron órdenes
                </h3>
                <p className="text-gray-500">
                  No hay órdenes que coincidan con los filtros aplicados
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número de Orden</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Estado de Pago</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.buyerName}</p>
                            <p className="text-sm text-gray-500">{order.buyerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</p>
                            {order.items.slice(0, 2).map((item, index) => (
                              <p key={index} className="text-sm text-gray-500 truncate max-w-40">
                                {item.product?.name}
                              </p>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-sm text-gray-400">+{order.items.length - 2} más</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatPrice(Number(order.total), order.currency, order.country?.currencySymbol)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(order.paymentStatus)}
                        </TableCell>
                        <TableCell>
                          <Link href={`/confirmacion/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-500">
                      Página {currentPage} de {totalPages}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

export default AdminOrdersPage
