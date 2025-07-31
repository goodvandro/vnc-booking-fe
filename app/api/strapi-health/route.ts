import { NextResponse } from "next/server"
import { strapiAPI } from "@/lib/strapi-api"

export async function GET() {
  try {
    // Test Strapi connection by trying to fetch guest houses
    await strapiAPI.getGuestHouses()

    return NextResponse.json({
      status: "connected",
      message: "Strapi connection successful",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Strapi health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Strapi",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
