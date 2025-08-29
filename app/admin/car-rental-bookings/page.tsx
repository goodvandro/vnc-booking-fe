import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getCarRentalBookings } from "../actions"
import BookingStatusSelect from "../bookings/booking-status-select"
import { Eye, Car } from "lucide-react"
import Link from "next/link"

export default async function CarRentalBookingsPage() {
  const bookings = await getCarRentalBookings()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Car Rental Bookings
        </CardTitle>
        <CardDescription>Manage all car rental bookings and reservations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Pick-up / Return</TableHead>
              <TableHead>Driver License</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No car rental bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">#{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.itemName}</div>
                    <div className="text-xs text-muted-foreground">Vehicle</div>
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
                  <TableCell>
                    <div className="text-sm">{booking.pickupLocation || "N/A"}</div>
                  </TableCell>
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
