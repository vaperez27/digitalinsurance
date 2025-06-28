
"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminUser } from '@/lib/types'
import { ArrowLeft, Search, Users, Mail, Phone, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const AdminUsersPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user || session.user.role !== 'admin') {
      toast.error('Acceso denegado')
      router.push('/')
      return
    }

    fetchUsers()
  }, [session, status, router, currentPage, searchTerm])

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('page', currentPage.toString())
      queryParams.append('limit', '10')
      if (searchTerm) queryParams.append('search', searchTerm)

      const response = await fetch(`/api/admin/users?${queryParams.toString()}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setUsers(result.data || [])
          setTotalPages(result.pagination?.totalPages || 1)
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default">Administrador</Badge>
      case 'user':
        return <Badge variant="secondary">Usuario</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600">Administra los usuarios registrados</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Usuarios Registrados</span>
                </CardTitle>
                <CardDescription>
                  {users.length} usuarios encontrados
                </CardDescription>
              </div>
              
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button type="submit" variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron usuarios
                </h3>
                <p className="text-gray-500">
                  No hay usuarios que coincidan con la búsqueda
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>País</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Órdenes</TableHead>
                      <TableHead>Total Gastado</TableHead>
                      <TableHead>Última Orden</TableHead>
                      <TableHead>Registro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#005A9C] text-white rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name || 'Sin nombre'}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {user.phone && (
                              <div className="flex items-center space-x-1 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-32">{user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.country ? (
                            <div className="flex items-center space-x-2">
                              <span>
                                {user.country.code === 'MX' ? '🇲🇽' :
                                 user.country.code === 'AR' ? '🇦🇷' :
                                 user.country.code === 'CL' ? '🇨🇱' :
                                 user.country.code === 'PE' ? '🇵🇪' : '🌍'}
                              </span>
                              <span className="text-sm">{user.country.name}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No especificado</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-medium">{user.totalOrders || 0}</p>
                            <p className="text-sm text-gray-500">órdenes</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-medium">{formatPrice(user.totalSpent || 0)}</p>
                            <p className="text-sm text-gray-500">total</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.lastOrder ? (
                            <div className="text-sm">
                              <p>{new Date(user.lastOrder).toLocaleDateString()}</p>
                              <p className="text-gray-500">
                                {new Date(user.lastOrder).toLocaleTimeString()}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Nunca</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
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

export default AdminUsersPage
