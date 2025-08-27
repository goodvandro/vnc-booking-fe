import { NextResponse } from "next/server"
import { strapiAPI } from "@/lib/strapi-api"

export async function GET() {
  try {
    const guestHouses = await strapiAPI.getGuestHouses()
    return NextResponse.json(guestHouses)
  } catch (error) {
    console.error("Error fetching guest houses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
