
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("countryId");
    const insuranceTypeId = searchParams.get("insuranceTypeId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = { active: true };
    
    if (countryId) {
      where.countryId = countryId;
    }
    
    if (insuranceTypeId) {
      where.insuranceTypeId = insuranceTypeId;
    }

    const [products, total] = await Promise.all([
      prisma.insuranceProduct.findMany({
        where,
        include: {
          insuranceType: true,
          country: true
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.insuranceProduct.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
