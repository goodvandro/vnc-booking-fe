import { NextResponse } from "next/server"
import { strapiAPI } from "@/lib/strapi-api"

export async function GET() {
  try {
    const cars = await strapiAPI.getCars()
    return NextResponse.json(cars)
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
