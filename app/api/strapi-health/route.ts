import { NextResponse } from "next/server"
import { strapiAPI } from "@/lib/strapi-api"

export async function GET() {
  try {
    const health = await strapiAPI.healthCheck()
    return NextResponse.json(health)
  } catch (error) {
    console.error("Strapi health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
