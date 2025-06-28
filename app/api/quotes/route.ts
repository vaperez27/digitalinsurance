
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();

    const {
      productId,
      personalData,
      vehicleData,
      beneficiaryData,
      travelData,
      healthData,
      countryId
    } = data;

    if (!productId || !personalData || !countryId) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Obtener el producto para calcular el precio
    const product = await prisma.insuranceProduct.findUnique({
      where: { id: productId },
      include: { insuranceType: true, country: true }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Lógica simple de cálculo de precio (aquí se puede hacer más compleja)
    let calculatedPrice = Number(product.basePrice);
    
    // Factores de precio basados en datos personales
    if (personalData.age < 25) calculatedPrice *= 1.2;
    if (personalData.age > 60) calculatedPrice *= 1.1;
    
    // Factores específicos por tipo de seguro
    if (product.insuranceType.slug === 'auto' && vehicleData) {
      const currentYear = new Date().getFullYear();
      const carAge = currentYear - vehicleData.year;
      if (carAge > 10) calculatedPrice *= 1.15;
      if (vehicleData.usage === 'commercial') calculatedPrice *= 1.3;
    }
    
    if (product.insuranceType.slug === 'vida' && healthData) {
      if (healthData.smoker) calculatedPrice *= 1.5;
      if (healthData.preExistingConditions) calculatedPrice *= 1.3;
    }

    // Fecha de validez (30 días)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    const quote = await prisma.quote.create({
      data: {
        userId: session?.user?.id || null,
        email: !session?.user?.id ? personalData.email : null,
        productId,
        personalData,
        vehicleData,
        beneficiaryData,
        travelData,
        healthData,
        calculatedPrice,
        validUntil,
        countryId
      },
      include: {
        product: {
          include: {
            insuranceType: true,
            country: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: quote
    });

  } catch (error) {
    console.error("Error creando cotización:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const quotes = await prisma.quote.findMany({
      where: { 
        userId: session.user.id,
        status: 'active'
      },
      include: {
        product: {
          include: {
            insuranceType: true,
            country: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: quotes
    });

  } catch (error) {
    console.error("Error obteniendo cotizaciones:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
