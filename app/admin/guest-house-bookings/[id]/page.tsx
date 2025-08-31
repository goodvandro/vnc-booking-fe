import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getGuestHouseBookingByIdData } from "@/lib/strapi-data";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Home,
  Mail,
  MessageSquare,
  Phone,
  Users
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingStatusSelect from "../../bookings/booking-status-select";

interface GuestHouseBookingDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function GuestHouseBookingDetailsPage({
  params,
}: GuestHouseBookingDetailsPageProps) {
  const { id } = await params;
  const booking = await getGuestHouseBookingByIdData(id);

  if (!booking) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/guest-house-bookings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Link>
          </Button>
          {/* <div>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-muted-foreground">{booking.bookingId}</p>
          </div> */}
        </div>
        <Badge className={getStatusColor(booking.bookingStatus)}>
          {booking.bookingStatus.charAt(0).toUpperCase() +
            booking.bookingStatus.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Booking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" /> Guest House Booking Details
            </CardTitle>
            <CardDescription>Booking information and details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                {booking?.guest_house?.title}
              </h3>
            </div>

            <Separator />

            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                #
                <div>
                  <p className="text-sm font-medium">Booking ID</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.bookingId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Check-in / Check-out</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.checkIn)} -{" "}
                    {formatDate(booking.checkOut)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Guests</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.guests}
                  </p>
                </div>
              </div>

              {/* {booking.pickupLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Pick-up Location</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.pickupLocation}
                    </p>
                  </div>
                </div>
              )} */}

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-lg font-bold text-green-600">
                    ${booking.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Booking Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(booking.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">Status Management</p>
              <BookingStatusSelect
                bookingId={booking.id}
                currentStatus={booking.bookingStatus}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Information
            </CardTitle>
            <CardDescription>
              Contact details and special requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                {booking.firstName} {booking.lastName}
              </h3>
              <p className="text-muted-foreground">Customer</p>
            </div>

            <Separator />

            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href={`mailto:${booking.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {booking.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a
                    href={`tel:${booking.phone}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {booking.phone}
                  </a>
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Special Requests</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">{booking.specialRequests}</p>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                <a href={`mailto:${booking.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                <a href={`tel:${booking.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Timeline</CardTitle>
          <CardDescription>Track the progress of this booking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Booking Created</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(booking.createdAt)}
                </p>
              </div>
            </div>

            {booking.bookingStatus === "confirmed" && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Booking Confirmed</p>
                  <p className="text-xs text-muted-foreground">
                    Status updated to confirmed
                  </p>
                </div>
              </div>
            )}

            {booking.bookingStatus === "cancelled" && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Booking Cancelled</p>
                  <p className="text-xs text-muted-foreground">
                    Status updated to cancelled
                  </p>
                </div>
              </div>
            )}

            {booking.bookingStatus === "completed" && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Booking Completed</p>
                  <p className="text-xs text-muted-foreground">
                    Customer has completed their stay/rental
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 opacity-50">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Check-in Date</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(booking.checkIn)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 opacity-50">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Check-out Date</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(booking.checkOut)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
