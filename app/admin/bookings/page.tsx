import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getBookings } from "../actions"
import BookingStatusSelect from "./booking-status-select"
import { Eye, Home, Car } from "lucide-react"
import Link from "next/link"

export default async function BookingsPage() {
  const bookings = await getBookings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
        <CardDescription>Manage all bookings across guest houses and car rentals.</CardDescription>
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
              <TableHead>Details</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">#{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={booking.type === "guestHouse" ? "default" : "secondary"}
                      className="flex items-center gap-1 w-fit"
                    >
                      {booking.type === "guestHouse" ? <Home className="h-3 w-3" /> : <Car className="h-3 w-3" />}
                      {booking.type === "guestHouse" ? "Guest House" : "Car Rental"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.itemName || "N/A"}</div>
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
                    {booking.type === "guestHouse"
                      ? booking.guestsOrSeats
                        ? `${booking.guestsOrSeats} guests`
                        : "N/A"
                      : booking.pickupLocation || "N/A"}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}
                  </TableCell>
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
