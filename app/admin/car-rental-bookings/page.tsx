import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCarRentalBookings } from "../actions"
import { BookingStatusSelect } from "../bookings/booking-status-select"
import Link from "next/link"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

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
          <div className="text-center py-8 text-muted-foreground">No car rental bookings found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Car</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Driver License</TableHead>
                <TableHead>Pick-up</TableHead>
                <TableHead>Return</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking: any) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-sm">{booking.bookingId || booking.id}</TableCell>
                  <TableCell className="font-medium">{booking.itemName || "N/A"}</TableCell>
                  <TableCell>
                    {booking.firstName && booking.lastName
                      ? `${booking.firstName} ${booking.lastName}`
                      : booking.customerName || "N/A"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{booking.driverLicense || "N/A"}</TableCell>
                  <TableCell>
                    {booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    {booking.returnDate ? new Date(booking.returnDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>€{booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}</TableCell>
                  <TableCell>
                    <BookingStatusSelect
                      bookingId={booking.documentId || booking.id}
                      currentStatus={booking.bookingStatus || "pending"}
                      type="car-rental"
                    />
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/admin/bookings/${booking.documentId || booking.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
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
  )
}
