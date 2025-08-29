import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getBookings } from "../actions"
import { Eye } from "lucide-react"

export default async function BookingsPage() {
  const bookings = await getBookings()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Manage all guest house and car rental bookings.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/guest-house-bookings">Guest House Bookings</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/car-rental-bookings">Car Rental Bookings</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Booking ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Badge variant="outline">{booking.type === "guestHouse" ? "Guest House" : "Car Rental"}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                  <TableCell className="font-medium">{booking.itemName || "N/A"}</TableCell>
                  <TableCell>
                    {booking.firstName} {booking.lastName}
                  </TableCell>
                  <TableCell>
                    {booking.startDate && booking.endDate
                      ? `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>€{booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "pending"
                            ? "secondary"
                            : booking.status === "cancelled"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/admin/bookings/${booking.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
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
