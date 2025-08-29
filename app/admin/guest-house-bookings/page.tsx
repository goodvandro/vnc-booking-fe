import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getGuestHouseBookings } from "../actions"
import BookingStatusSelect from "../bookings/booking-status-select"
import { Eye, Home } from "lucide-react"
import Link from "next/link"

export default async function GuestHouseBookingsPage() {
  const bookings = await getGuestHouseBookings()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Guest House Bookings
        </CardTitle>
        <CardDescription>Manage all guest house bookings and reservations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Guest House</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Check-in / Check-out</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No guest house bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">#{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.itemName}</div>
                    <div className="text-xs text-muted-foreground">Guest House</div>
                  </TableCell>
                  <TableCell>
                    {booking.firstName} {booking.lastName}
                    <div className="text-xs text-muted-foreground">{booking.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {booking.startDate} to {booking.endDate}
                    </div>
                  </TableCell>
                  <TableCell>{booking.guestsOrSeats ? `${booking.guestsOrSeats} guests` : "N/A"}</TableCell>
                  <TableCell className="font-medium">${booking.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/bookings/${booking.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
