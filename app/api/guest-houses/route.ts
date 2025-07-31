import { NextResponse } from "next/server"
import { getGuestHousesData } from "@/lib/data"

export async function GET() {
  try {
    const guestHouses = await getGuestHousesData()
    return NextResponse.json(guestHouses)
  } catch (error) {
    console.error("Failed to fetch guest houses:", error)
    return NextResponse.json({ error: "Failed to fetch guest houses" }, { status: 500 })
  }
}
