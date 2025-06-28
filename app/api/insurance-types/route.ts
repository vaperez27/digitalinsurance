
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const insuranceTypes = await prisma.insuranceType.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: insuranceTypes
    });

  } catch (error) {
    console.error("Error obteniendo tipos de seguro:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
