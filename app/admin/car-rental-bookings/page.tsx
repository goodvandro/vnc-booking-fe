import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCarRentalBookingsData } from "@/lib/strapi-data";
import { Calendar, Car, Eye, MapPin } from "lucide-react";
import Link from "next/link";
import BookingStatusSelect from "../bookings/booking-status-select";

export default async function CarRentalBookingsPage() {
  const bookings = await getCarRentalBookingsData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Car Rental Bookings
        </CardTitle>
        <CardDescription>
          Manage all vehicle rentals and pick-ups.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Pick-up / Return</TableHead>
              <TableHead>Pick-up Location</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No car rental bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.bookingId}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {booking?.car?.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.firstName} {booking.lastName}
                    <div className="text-xs text-muted-foreground">
                      {booking.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {booking.startDate} to {booking.endDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {booking?.pickupLocation || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    $
                    {booking.totalPrice
                      ? booking.totalPrice.toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell>
                    <BookingStatusSelect
                      bookingId={booking.id}
                      currentStatus={booking.bookingStatus}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/car-rental-bookings/${booking.documentId}`}>
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
  );
}
