"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Plus } from "lucide-react"
import { getGuestHouseBookings } from "../actions"
import BookingStatusSelect from "../bookings/booking-status-select"
import type { Booking } from "@/lib/types"

export default function GuestHouseBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getGuestHouseBookings()
        setBookings(data)
      } catch (error) {
        console.error("Error fetching guest house bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guest House Bookings</h1>
          <p className="text-muted-foreground">Manage guest house reservations</p>
        </div>
        <Button asChild>
          <Link href="/admin/guest-houses/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Guest House
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guest House Reservations</CardTitle>
          <CardDescription>{bookings.length} total guest house bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No guest house bookings found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Guest House</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">{booking.bookingId || booking.id}</TableCell>
                    <TableCell>{booking.itemName || "N/A"}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {booking.firstName} {booking.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{booking.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.guests || "N/A"}</TableCell>
                    <TableCell>
                      {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>${booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}</TableCell>
                    <TableCell>
                      <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status || "pending"} />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <Eye className="h-4 w-4" />
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
