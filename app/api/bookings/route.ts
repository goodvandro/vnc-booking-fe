import { NextResponse } from "next/server"
// import { getBookingsData, createBookingData } from "@/lib/strapi-data"
import type { Booking } from "@/lib/types"

// export async function GET() {
//   try {
//     const bookings = await getBookingsData()
//     return NextResponse.json(bookings)
//   } catch (error) {
//     console.error("API Error - Bookings:", error)
//     return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()

//     // Validate required fields
//     const requiredFields = [
//       "type",
//       "itemId",
//       "itemName",
//       "firstName",
//       "lastName",
//       "email",
//       "phone",
//       "startDate",
//       "endDate",
//       "totalPrice",
//     ]
//     for (const field of requiredFields) {
//       if (!body[field]) {
//         return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
//       }
//     }

//     const newBooking: Omit<Booking, "id" | "createdAt" | "status"> = {
//       type: body.type,
//       itemId: body.itemId,
//       itemName: body.itemName,
//       firstName: body.firstName,
//       lastName: body.lastName,
//       email: body.email,
//       phone: body.phone,
//       startDate: body.startDate,
//       endDate: body.endDate,
//       guestsOrSeats: body.guestsOrSeats,
//       pickupLocation: body.pickupLocation,
//       specialRequests: body.specialRequests,
//       totalPrice: body.totalPrice,
//     }

//     const booking = await createBookingData(newBooking)
//     return NextResponse.json(booking, { status: 201 })
//   } catch (error) {
//     console.error("API Error - Create Booking:", error)
//     return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
//   }
// }
