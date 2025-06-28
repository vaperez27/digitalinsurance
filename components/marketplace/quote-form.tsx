
"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteFormData, Country, InsuranceType } from '@/lib/types'
import { Loader2 } from 'lucide-react'

interface QuoteFormProps {
  onSubmit: (data: QuoteFormData) => void
  loading?: boolean
  selectedType?: string
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onSubmit, loading = false, selectedType }) => {
  const [countries, setCountries] = useState<Country[]>([])
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([])
  const [formData, setFormData] = useState<QuoteFormData>({
    insuranceType: selectedType || '',
    countryId: '',
    personalData: {
      name: '',
      email: '',
      phone: '',
      document: '',
      age: 0
    }
  })

  useEffect(() => {
    fetchCountries()
    fetchInsuranceTypes()
  }, [])

  useEffect(() => {
    if (selectedType) {
      setFormData(prev => ({ ...prev, insuranceType: selectedType }))
    }
  }, [selectedType])

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/countries')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCountries(result.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }

  const fetchInsuranceTypes = async () => {
    try {
      const response = await fetch('/api/insurance-types')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setInsuranceTypes(result.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching insurance types:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updatePersonalData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      personalData: {
        ...prev.personalData,
        [field]: value
      }
    }))
  }

  const updateVehicleData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      vehicleData: {
        ...prev.vehicleData,
        [field]: value
      }
    }))
  }

  const updateTravelData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      travelData: {
        ...prev.travelData,
        [field]: value
      }
    }))
  }

  const updateHealthData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      healthData: {
        ...prev.healthData,
        [field]: value
      }
    }))
  }

  const renderSpecificFields = () => {
    switch (formData.insuranceType) {
      case 'auto':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos del Vehículo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  placeholder="Ej: Toyota"
                  value={formData.vehicleData?.brand || ''}
                  onChange={(e) => updateVehicleData('brand', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  placeholder="Ej: Corolla"
                  value={formData.vehicleData?.model || ''}
                  onChange={(e) => updateVehicleData('model', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  placeholder="2020"
                  value={formData.vehicleData?.year || ''}
                  onChange={(e) => updateVehicleData('year', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="usage">Uso del Vehículo</Label>
                <Select onValueChange={(value) => updateVehicleData('usage', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el uso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                    <SelectItem value="uber">Uber/Taxi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 'viaje':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos del Viaje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  placeholder="País de destino"
                  value={formData.travelData?.destination || ''}
                  onChange={(e) => updateTravelData('destination', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="travelers">Número de Viajeros</Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1"
                  value={formData.travelData?.travelers || ''}
                  onChange={(e) => updateTravelData('travelers', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startDate">Fecha de Salida</Label>
                <Input
                  id="startDate"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.travelData?.startDate || ''}
                  onChange={(e) => updateTravelData('startDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha de Regreso</Label>
                <Input
                  id="endDate"
                  type="date"
                  min={formData.travelData?.startDate || new Date().toISOString().split('T')[0]}
                  value={formData.travelData?.endDate || ''}
                  onChange={(e) => updateTravelData('endDate', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )

      case 'salud':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos de Salud</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coverage">Tipo de Cobertura</Label>
                <Select onValueChange={(value) => updateHealthData('coverage', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona cobertura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="familiar">Familiar</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="smoker">¿Fumador?</Label>
                <Select onValueChange={(value) => updateHealthData('smoker', value === 'true')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="preExisting">¿Tienes condiciones médicas preexistentes?</Label>
                <Select onValueChange={(value) => updateHealthData('preExistingConditions', value === 'true')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Solicitar Cotización</CardTitle>
        <CardDescription>
          Completa tus datos para recibir una cotización personalizada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="insuranceType">Tipo de Seguro</Label>
              <Select 
                value={formData.insuranceType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, insuranceType: value }))}
                disabled={!!selectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo de seguro" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceTypes.map((type) => (
                    <SelectItem key={type.id} value={type.slug}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              <Select 
                value={formData.countryId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, countryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Personal Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre completo"
                  value={formData.personalData.name}
                  onChange={(e) => updatePersonalData('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.personalData.email}
                  onChange={(e) => updatePersonalData('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+52 55 1234 5678"
                  value={formData.personalData.phone}
                  onChange={(e) => updatePersonalData('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  placeholder="30"
                  value={formData.personalData.age || ''}
                  onChange={(e) => updatePersonalData('age', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Specific Fields based on insurance type */}
          {formData.insuranceType && renderSpecificFields()}

          <Button 
            type="submit" 
            className="w-full" 
            variant="cta" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando Cotización...
              </>
            ) : (
              'Obtener Cotización'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default QuoteForm
