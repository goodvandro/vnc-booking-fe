import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getBookingByIdData } from "@/lib/strapi-data"
import BookingStatusSelect from "../booking-status-select"
import { ArrowLeft, Calendar, User, Phone, Mail, MapPin, Users, Car, Home } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface BookingDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { id } = await params
  const booking = await getBookingByIdData(id)

  if (!booking) {
    notFound()
  }

  const isGuestHouse = booking.type === "guestHouse"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/bookings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <p className="text-muted-foreground">#{booking.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Booking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isGuestHouse ? <Home className="h-5 w-5" /> : <Car className="h-5 w-5" />}
              Booking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Type</span>
              <Badge variant={isGuestHouse ? "default" : "secondary"}>
                {isGuestHouse ? "Guest House" : "Car Rental"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Item</span>
              <span className="text-sm">{booking.itemName || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status} />
            </div>

            <Separator />

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{isGuestHouse ? "Check-in / Check-out" : "Pick-up / Return"}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.startDate} to {booking.endDate}
                </p>
              </div>
            </div>

            {isGuestHouse && booking.guestsOrSeats && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Guests</p>
                  <p className="text-sm text-muted-foreground">{booking.guestsOrSeats} guests</p>
                </div>
              </div>
            )}

            {!isGuestHouse && booking.pickupLocation && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Pickup Location</p>
                  <p className="text-sm text-muted-foreground">{booking.pickupLocation}</p>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total Price</span>
              <span className="text-lg font-bold">${booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">
                  {booking.firstName} {booking.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{booking.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{booking.phone}</p>
              </div>
            </div>

            {booking.specialRequests && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Special Requests</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{booking.specialRequests}</p>
                </div>
              </>
            )}

            <Separator />

            <div>
              <p className="text-sm font-medium">Booking Date</p>
              <p className="text-sm text-muted-foreground">
                {new Date(booking.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
