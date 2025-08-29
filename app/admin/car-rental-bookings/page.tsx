import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCarRentalBookings } from "../actions"
import { BookingStatusSelect } from "../bookings/booking-status-select"
import type { Booking } from "@/lib/types"

export default async function CarRentalBookingsPage() {
  const bookings = await getCarRentalBookings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Car Rental Bookings</CardTitle>
        <CardDescription>Manage car rental reservations and bookings.</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No car rental bookings found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Pick-up Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Pick-up Location</TableHead>
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
                  <TableCell>{booking.pickupLocation || "N/A"}</TableCell>
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
