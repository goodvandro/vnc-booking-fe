import { NextResponse } from "next/server"
import { getCarsData } from "@/lib/data"

export async function GET() {
  try {
    const cars = await getCarsData()
    return NextResponse.json(cars)
  } catch (error) {
    console.error("Failed to fetch cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}
