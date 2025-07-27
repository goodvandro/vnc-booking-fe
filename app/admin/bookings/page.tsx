import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getBookings } from "../actions"
import BookingStatusSelect from "./booking-status-select"
import { Eye } from "lucide-react"
import Link from "next/link"

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
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">#{booking.id.slice(0, 8)}</TableCell>
                <TableCell>{booking.type === "guestHouse" ? "Guest House" : "Car Rental"}</TableCell>
                <TableCell>{booking.itemName}</TableCell>
                <TableCell>
                  {booking.firstName} {booking.lastName}
                  <div className="text-xs text-muted-foreground">{booking.email}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {booking.startDate} to {booking.endDate}
                  </div>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
