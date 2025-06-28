
"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import ProductCard from '@/components/marketplace/product-card'
import QuoteForm from '@/components/marketplace/quote-form'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { InsuranceProduct, Quote, Country, InsuranceType, QuoteFormData } from '@/lib/types'
import { Search, Filter, ArrowLeft, ShoppingCart } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const QuotationPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [products, setProducts] = useState<InsuranceProduct[]>([])
  const [quote, setQuote] = useState<Quote | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    countryId: '',
    insuranceTypeId: '',
    minPrice: '',
    maxPrice: '',
    company: ''
  })
  const [showQuoteForm, setShowQuoteForm] = useState(false)

  useEffect(() => {
    fetchInitialData()
    
    // Check if there's a quote ID in the URL
    const quoteId = searchParams.get('quote')
    if (quoteId) {
      fetchQuoteDetails(quoteId)
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchInitialData = async () => {
    try {
      const [countriesRes, typesRes] = await Promise.all([
        fetch('/api/countries'),
        fetch('/api/insurance-types')
      ])

      if (countriesRes.ok) {
        const countriesResult = await countriesRes.json()
        if (countriesResult.success) {
          setCountries(countriesResult.data || [])
        }
      }

      if (typesRes.ok) {
        const typesResult = await typesRes.json()
        if (typesResult.success) {
          setInsuranceTypes(typesResult.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching initial data:', error)
    }
  }

  const fetchQuoteDetails = async (quoteId: string) => {
    try {
      // This would be a new API endpoint to get quote details
      // For now, we'll simulate it
      setLoading(false)
    } catch (error) {
      console.error('Error fetching quote:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.countryId) queryParams.append('countryId', filters.countryId)
      if (filters.insuranceTypeId) queryParams.append('insuranceTypeId', filters.insuranceTypeId)
      
      const response = await fetch(`/api/products?${queryParams.toString()}&limit=20`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          let filteredProducts = result.data || []
          
          // Apply additional filters
          if (filters.minPrice) {
            filteredProducts = filteredProducts.filter((p: InsuranceProduct) => 
              Number(p.basePrice) >= Number(filters.minPrice)
            )
          }
          
          if (filters.maxPrice) {
            filteredProducts = filteredProducts.filter((p: InsuranceProduct) => 
              Number(p.basePrice) <= Number(filters.maxPrice)
            )
          }
          
          if (filters.company) {
            filteredProducts = filteredProducts.filter((p: InsuranceProduct) => 
              p.company.toLowerCase().includes(filters.company.toLowerCase())
            )
          }

          setProducts(filteredProducts)
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleQuoteSubmit = async (data: QuoteFormData) => {
    try {
      // Find a product that matches the criteria
      const matchingProduct = products.find(p => 
        p.insuranceType?.slug === data.insuranceType && 
        p.countryId === data.countryId
      )

      if (!matchingProduct) {
        toast.error('No se encontró un producto que coincida con tus criterios')
        return
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: matchingProduct.id,
          personalData: data.personalData,
          vehicleData: data.vehicleData,
          travelData: data.travelData,
          healthData: data.healthData,
          beneficiaryData: data.beneficiaryData,
          countryId: data.countryId
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setQuote(result.data)
          setShowQuoteForm(false)
          toast.success('¡Cotización generada exitosamente!')
        }
      }
    } catch (error) {
      console.error('Error creating quote:', error)
      toast.error('Error al generar cotización')
    }
  }

  const addToCart = async (product: InsuranceProduct) => {
    if (!session?.user) {
      toast.error('Debes iniciar sesión para agregar al carrito')
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          price: product.basePrice,
          quoteId: quote?.id || null
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast.success('Producto agregado al carrito')
        } else {
          toast.error(result.error || 'Error al agregar al carrito')
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Error al agregar al carrito')
    }
  }

  const clearFilters = () => {
    setFilters({
      countryId: '',
      insuranceTypeId: '',
      minPrice: '',
      maxPrice: '',
      company: ''
    })
  }

  const companies = [...new Set(products.map(p => p.company))].sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded"></div>
                ))}
              </div>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cotización de Seguros</h1>
              <p className="text-gray-600">
                Encuentra el seguro perfecto para ti
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowQuoteForm(true)}>
              <Search className="h-4 w-4 mr-2" />
              Nueva Cotización
            </Button>
            {session?.user && (
              <Link href="/carrito">
                <Button variant="cta">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Ver Carrito
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Quote Result */}
        {quote && (
          <Card className="mb-8 border-l-4 border-l-[#005A9C]">
            <CardHeader>
              <CardTitle className="text-[#005A9C]">Tu Cotización Personalizada</CardTitle>
              <CardDescription>
                Válida hasta: {new Date(quote.validUntil).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{quote.product?.name}</h3>
                  <p className="text-gray-600">{quote.product?.company}</p>
                  <Badge variant="outline" className="mt-1">
                    {quote.product?.insuranceType?.name}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#005A9C]">
                    {quote.product?.country?.currencySymbol}{Number(quote.calculatedPrice).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">por año</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filtros</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">País</label>
                  <Select value={filters.countryId} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, countryId: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los países" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los países</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo de Seguro</label>
                  <Select value={filters.insuranceTypeId} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, insuranceTypeId: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {insuranceTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Compañía</label>
                  <Select value={filters.company} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, company: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las compañías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las compañías</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Precio mín.</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Precio máx.</label>
                    <input
                      type="number"
                      placeholder="999999"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    />
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  Limpiar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {products.length} productos encontrados
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500 mb-4">
                  Intenta ajustar tus filtros para ver más resultados
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuote={() => setShowQuoteForm(true)}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">Nueva Cotización</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowQuoteForm(false)}
              >
                ×
              </Button>
            </div>
            <div className="p-6">
              <QuoteForm onSubmit={handleQuoteSubmit} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default QuotationPage
