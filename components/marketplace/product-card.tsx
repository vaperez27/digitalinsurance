
"use client"

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InsuranceProduct } from '@/lib/types'
import { Star, Shield, Check } from 'lucide-react'

interface ProductCardProps {
  product: InsuranceProduct
  onQuote?: (product: InsuranceProduct) => void
  onAddToCart?: (product: InsuranceProduct) => void
  showActions?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onQuote, 
  onAddToCart, 
  showActions = true 
}) => {
  const formatPrice = (price: number, currency: string, symbol: string) => {
    return `${symbol}${price.toLocaleString()}`
  }

  const currencySymbol = product.country?.currencySymbol || '$'

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {product.companyLogo && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={product.companyLogo}
                    alt={`${product.company} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">{product.company}</p>
                <Badge variant="outline" className="text-xs">
                  {product.insuranceType?.name}
                </Badge>
              </div>
            </div>
            <CardTitle className="text-lg group-hover:text-[#005A9C] transition-colors">
              {product.name}
            </CardTitle>
            {product.description && (
              <CardDescription className="text-sm mt-1">
                {product.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="space-y-4">
          {/* Price */}
          <div className="text-center py-4 bg-gradient-to-r from-[#005A9C]/5 to-[#FF7A00]/5 rounded-lg">
            <p className="text-2xl font-bold text-[#005A9C]">
              {formatPrice(product.basePrice, product.currency, currencySymbol)}
            </p>
            <p className="text-sm text-gray-600">por año</p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Características principales:</p>
              <ul className="space-y-1">
                {product.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              {product.features.length > 4 && (
                <p className="text-xs text-gray-500">
                  +{product.features.length - 4} características más
                </p>
              )}
            </div>
          )}

          {/* Deductible */}
          {product.deductible && (
            <div className="text-sm">
              <span className="text-gray-600">Deducible: </span>
              <span className="font-medium">
                {formatPrice(product.deductible, product.currency, currencySymbol)}
              </span>
            </div>
          )}

          {/* Age restrictions */}
          {(product.minAge || product.maxAge) && (
            <div className="text-sm text-gray-600">
              <span>Edad: </span>
              <span>
                {product.minAge || 0} - {product.maxAge || 100} años
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-0 space-y-2">
          <div className="w-full space-y-2">
            <Button 
              variant="cta" 
              className="w-full"
              onClick={() => onQuote?.(product)}
            >
              Cotizar Ahora
            </Button>
            {onAddToCart && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onAddToCart(product)}
              >
                Agregar al Carrito
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default ProductCard
