"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  Users,
  Settings,
  Calendar,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { createCarRentalBooking } from "@/app/actions/booking-actions";
import type { SelectedCar } from "@/lib/types";
import type { User } from "@clerk/nextjs/server";
import ImageSlider from "./image-slider";

interface CarRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCar: SelectedCar | null;
  t: any;
  user: User | null | undefined;
}

export default function CarRentalModal({
  isOpen,
  onClose,
  selectedCar,
  t,
  user,
}: CarRentalModalProps) {
  const [state, formAction, isPending] = useActionState(
    createCarRentalBooking,
    null
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [canShowSuccess, setCanShowSuccess] = useState(false);
  const lastBookingIdRef = useRef<string | null>(null);

  // Reset form and success state when modal opens with a new selection
  useEffect(() => {
    if (isOpen && selectedCar) {
      setShowSuccess(false);
      setCanShowSuccess(true); // Allow showing success for new bookings in this session
      // Reset form fields
      setStartDate("");
      setEndDate("");
      setSpecialRequests("");
      setDriverLicense("");
      setTotalPrice(0);

      // Set user data if available
      if (user) {
        setFirstName(user?.firstName || "");
        setLastName(user?.lastName || "");
        setEmail(user.emailAddresses?.[0]?.emailAddress || "");
        setPhone(user.phoneNumbers?.[0]?.phoneNumber || "");
      } else {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
      }
    }
  }, [isOpen, selectedCar, user]);

  // Calculate total price when dates change
  useEffect(() => {
    if (startDate && endDate && selectedCar) {
      const pickup = new Date(startDate);
      const returnDate = new Date(endDate);
      const days = Math.ceil(
        (returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (days > 0) {
        setTotalPrice(days * selectedCar.data.price);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, selectedCar]);

  // Handle successful booking - only show success for new bookings
  useEffect(() => {
    if (state?.success && canShowSuccess && !showSuccess) {
      // Check if this is a new booking (different booking ID)
      if (state.bookingId && state.bookingId !== lastBookingIdRef.current) {
        setShowSuccess(true);
        lastBookingIdRef.current = state.bookingId;
        setCanShowSuccess(false); // Prevent showing success again until modal reopens
      }
    }
  }, [state?.success, state?.bookingId, canShowSuccess, showSuccess]);

  const handleCloseModal = () => {
    setShowSuccess(false);
    setCanShowSuccess(false);
    onClose();
    // Reset form
    setStartDate("");
    setEndDate("");
    setTotalPrice(0);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDriverLicense("");
    setSpecialRequests("");
  };

  if (!selectedCar) return null;

  const car = selectedCar.data;
  const today = new Date().toISOString().split("T")[0];
  const days =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t?.rentCar || "Rent Car"}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              {t?.rentalConfirmed || "Rental Confirmed!"}
            </h3>
            <p className="text-muted-foreground mb-4">{state?.message}</p>
            {state?.bookingId && (
              <p className="text-sm text-muted-foreground mb-6">
                Booking ID:{" "}
                <span className="font-mono font-semibold">
                  {state.bookingId}
                </span>
              </p>
            )}
            <Button onClick={handleCloseModal} className="px-8">
              {t?.done || "Done"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Images and Car Info */}
            <div className="space-y-4">
              {/* Image Slider */}
              {car.images && car.images.length > 0 && (
                <ImageSlider
                  images={car.images}
                  alt={car.title}
                  className="w-full"
                  enableFullscreen={true}
                />
              )}

              {/* Car Details */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-xl mb-2">{car.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {car.description}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {car.seats} {t?.seats || "seats"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span className="text-sm">
                        {t?.automatic || "Automatic"}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      €{car.price}/{t?.day || "day"}
                    </Badge>
                  </div>
                  {car.description && (
                    <p className="text-sm text-muted-foreground">
                      {car.description}
                    </p>
                  )}
                  {/* {car.features && car.features.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">{t?.features || "Features"}:</h5>
                      <div className="flex flex-wrap gap-1">
                        {car.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )} */}
                </CardContent>
              </Card>

              {/* Price Summary */}
              {totalPrice > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t?.rentalSummary || "Rental Summary"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t?.pricePerDay || "Price per day"}:</span>
                        <span>€{car.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t?.numberOfDays || "Number of days"}:</span>
                        <span>{days}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>{t?.total || "Total"}:</span>
                        <span className="text-primary">€{totalPrice}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Rental Form */}
            <div className="space-y-4">
              {/* Error Message */}
              {state?.success === false && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{state.message}</p>
                </div>
              )}

              {/* Rental Form */}
              <form action={formAction} className="space-y-4">
                {/* Hidden fields */}
                <input type="hidden" name="carId" value={car.id || ""} />
                <input type="hidden" name="totalPrice" value={totalPrice} />

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-4">
                      {t?.personalInformation || "Personal Information"}
                    </h4>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="firstName">
                          {t?.firstName || "First Name"}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={isPending}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">
                          {t?.lastName || "Last Name"}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="email">
                          {t?.email || "Email"}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isPending}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">
                          {t?.phone || "Phone"}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    {/* Driver License */}
                    <div>
                      <Label htmlFor="driverLicense">
                        {t?.driverLicense || "Driver License"}
                      </Label>
                      <Input
                        id="driverLicense"
                        name="driverLicense"
                        placeholder={
                          t?.driverLicensePlaceholder ||
                          "Enter your driver license number (optional)"
                        }
                        value={driverLicense}
                        onChange={(e) => setDriverLicense(e.target.value)}
                        disabled={isPending}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-4">
                      {t?.rentalDetails || "Rental Details"}
                    </h4>

                    {/* Rental Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="startDate">
                          {t?.pickupDate || "Pickup Date"}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          required
                          min={today}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          disabled={isPending}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">
                          {t?.returnDate || "Return Date"}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          required
                          min={startDate || today}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <Label htmlFor="specialRequests">
                        {t?.specialRequests || "Special Requests"}
                      </Label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        placeholder={
                          t?.specialRequestsPlaceholder ||
                          "Any special requests or requirements..."
                        }
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        disabled={isPending}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    disabled={isPending}
                    className="flex-1 bg-transparent"
                  >
                    {t?.cancel || "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || totalPrice <= 0}
                    className="flex-1"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t?.processing || "Processing..."}
                      </>
                    ) : (
                      `${t?.confirmRental || "Confirm Rental"} - €${totalPrice}`
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
