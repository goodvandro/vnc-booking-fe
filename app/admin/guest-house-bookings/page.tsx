import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, Users, Eye } from "lucide-react"
import Link from "next/link"
import { getGuestHouseBookings } from "../actions"
import { BookingStatusSelect } from "../bookings/booking-status-select"

export default async function GuestHouseBookingsPage() {
  const bookings = await getGuestHouseBookings()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guest House Bookings</h1>
          <p className="text-muted-foreground">Manage guest house reservations and bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {bookings.length} Total Bookings
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Guest House Reservations
          </CardTitle>
          <CardDescription>View and manage all guest house booking requests</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Guest House Bookings</h3>
              <p className="text-muted-foreground">No guest house bookings have been made yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Guest House</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.itemName || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {booking.guests || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      €{booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}
                    </TableCell>
                    <TableCell>
                      <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status} />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
