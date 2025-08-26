import { notFound } from "next/navigation"
import { strapiAPI } from "@/lib/strapi-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import BookingStatusSelect from "../booking-status-select"

interface BookingDetailsPageProps {
  params: {
    id: string
  }
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const booking = await strapiAPI.getBookingById(params.id)

  if (!booking) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/bookings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Booking Details</CardTitle>
              <Badge className={getStatusColor(booking.bookingStatus)}>{booking.bookingStatus}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Booking Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Booking ID: {booking.bookingId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {booking.checkIn
                          ? `Check-in: ${new Date(booking.checkIn).toLocaleDateString()}`
                          : booking.startDate
                            ? `Pickup: ${new Date(booking.startDate).toLocaleDateString()}`
                            : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {booking.checkOut
                          ? `Check-out: ${new Date(booking.checkOut).toLocaleDateString()}`
                          : booking.endDate
                            ? `Return: ${new Date(booking.endDate).toLocaleDateString()}`
                            : ""}
                      </span>
                    </div>
                    {booking.guests && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Guests: {booking.guests}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">Total: ${booking.totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {booking.firstName} {booking.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{booking.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{booking.phone}</span>
                    </div>
                    {booking.driverLicense && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Driver License: {booking.driverLicense}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {booking.guest_house && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Guest House</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{booking.guest_house.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{booking.guest_house.location}</span>
                      </div>
                    </div>
                  </div>
                )}

                {booking.car && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Car</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{booking.car.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {booking.car.make} {booking.car.model}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {booking.specialRequests && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Special Requests</h3>
                    <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-2">Update Status</h3>
                  <BookingStatusSelect bookingId={booking.id} currentStatus={booking.bookingStatus} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
