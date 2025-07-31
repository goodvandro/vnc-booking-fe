import { NextResponse } from "next/server"
import { getCarsData } from "@/lib/strapi-data"

export async function GET() {
  try {
    const cars = await getCarsData()
    return NextResponse.json(cars)
  } catch (error) {
    console.error("API Error - Cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}
