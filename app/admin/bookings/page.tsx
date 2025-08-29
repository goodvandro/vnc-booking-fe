import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getBookingsData } from "../actions"
import { BookingStatusSelect } from "./booking-status-select"
import Link from "next/link"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function BookingsPage() {
  const bookings = await getBookingsData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
        <CardDescription>Manage all bookings and reservations in one place.</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No bookings found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking: any) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-sm">{booking.bookingId || booking.id}</TableCell>
                  <TableCell>
                    <Badge variant={booking.type === "guest-house" ? "default" : "secondary"}>
                      {booking.type === "guest-house" ? "Guest House" : "Car Rental"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{booking.itemName || "N/A"}</TableCell>
                  <TableCell>
                    {booking.firstName && booking.lastName
                      ? `${booking.firstName} ${booking.lastName}`
                      : booking.customerName || "N/A"}
                  </TableCell>
                  <TableCell>
                    {booking.type === "guest-house" ? (
                      <>
                        {booking.checkInDate && booking.checkOutDate
                          ? `${new Date(booking.checkInDate).toLocaleDateString()} - ${new Date(booking.checkOutDate).toLocaleDateString()}`
                          : "N/A"}
                      </>
                    ) : (
                      <>
                        {booking.pickupDate && booking.returnDate
                          ? `${new Date(booking.pickupDate).toLocaleDateString()} - ${new Date(booking.returnDate).toLocaleDateString()}`
                          : "N/A"}
                      </>
                    )}
                  </TableCell>
                  <TableCell>€{booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}</TableCell>
                  <TableCell>
                    <BookingStatusSelect
                      bookingId={booking.documentId || booking.id}
                      currentStatus={booking.bookingStatus || "pending"}
                      type={booking.type}
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
