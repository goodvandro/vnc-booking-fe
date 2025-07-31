import { type NextRequest, NextResponse } from "next/server"
import { getBookingsData, createBookingData } from "@/lib/data"

export async function GET() {
  try {
    const bookings = await getBookingsData()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Failed to fetch bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    const booking = await createBookingData(bookingData)
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("Failed to create booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
