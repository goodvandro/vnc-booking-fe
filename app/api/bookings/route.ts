import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { strapiAPI } from "@/lib/strapi-api"

export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookings = await strapiAPI.getAllBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { type, ...bookingData } = data

    let result
    if (type === "guest-house") {
      result = await strapiAPI.createGuestHouseBooking(bookingData)
    } else if (type === "car-rental") {
      result = await strapiAPI.createCarRentalBooking(bookingData)
    } else {
      return NextResponse.json({ error: "Invalid booking type" }, { status: 400 })
    }

    if (result.success) {
      return NextResponse.json(result.data, { status: 201 })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
