import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getGuestHouseBookings } from "../actions"
import { BookingStatusSelect } from "../bookings/booking-status-select"
import type { Booking } from "@/lib/types"

export default async function GuestHouseBookingsPage() {
  const bookings = await getGuestHouseBookings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest House Bookings</CardTitle>
        <CardDescription>Manage guest house reservations and bookings.</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No guest house bookings found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest House</TableHead>
                <TableHead>Guest Name</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking: Booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.itemName || "N/A"}</TableCell>
                  <TableCell>
                    {booking.firstName} {booking.lastName}
                  </TableCell>
                  <TableCell>{booking.startDate ? new Date(booking.startDate).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>{booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>{booking.guestsOrSeats || "N/A"}</TableCell>
                  <TableCell>${booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}</TableCell>
                  <TableCell>
                    <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
