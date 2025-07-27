import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBookings } from "../actions"
import BookingStatusSelect from "./booking-status-select"

export default async function BookingsPage() {
  const bookings = await getBookings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>Manage all guest house and car rental bookings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.type === "guestHouse" ? "Guest House" : "Car Rental"}</TableCell>
                <TableCell>{booking.itemName}</TableCell>
                <TableCell>
                  {booking.firstName} {booking.lastName} ({booking.email})
                </TableCell>
                <TableCell>
                  {booking.startDate} to {booking.endDate}
                </TableCell>
                <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
