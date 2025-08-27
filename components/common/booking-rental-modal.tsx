"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Star, Users, Fuel, Settings } from "lucide-react"
import type { SelectedItem } from "@/lib/types"
import type { User } from "@clerk/nextjs/server"

interface BookingRentalModalProps {
  t: any
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItem: SelectedItem | null
  firstName: string
  setFirstName: (value: string) => void
  lastName: string
  setLastName: (value: string) => void
  phone: string
  setPhone: (value: string) => void
  email: string
  setEmail: (value: string) => void
  specialRequests: string
  setSpecialRequests: (value: string) => void
  checkInDate: string
  setCheckInDate: (value: string) => void
  checkOutDate: string
  setCheckOutDate: (value: string) => void
  numGuests: number
  setNumGuests: (value: number) => void
  pickupDate: string
  setPickupDate: (value: string) => void
  returnDate: string
  setReturnDate: (value: string) => void
  pickupLocation: string
  setPickupLocation: (value: string) => void
  totalPrice: number
  user: User | null | undefined
}

export default function BookingRentalModal({
  t,
  open,
  onOpenChange,
  selectedItem,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  email,
  setEmail,
  specialRequests,
  setSpecialRequests,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  numGuests,
  setNumGuests,
  pickupDate,
  setPickupDate,
  returnDate,
  setReturnDate,
  pickupLocation,
  setPickupLocation,
  totalPrice,
  user,
}: BookingRentalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!selectedItem) return null

  const isGuestHouse = selectedItem.type === "guestHouse"
  const item = selectedItem.data

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would submit the booking data to your API
      console.log("Submitting booking:", {
        type: selectedItem.type,
        item,
        firstName,
        lastName,
        phone,
        email,
        specialRequests,
        ...(isGuestHouse
          ? {
              checkInDate,
              checkOutDate,
              numGuests,
            }
          : {
              pickupDate,
              returnDate,
              pickupLocation,
            }),
        totalPrice,
        userId: user?.id,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Close modal and reset form
      onOpenChange(false)

      // Show success message (you might want to use a toast library)
      alert(t.bookingConfirmed || "Booking confirmed!")
    } catch (error) {
      console.error("Booking error:", error)
      alert(t.bookingError || "Booking failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isGuestHouse
              ? t.bookGuestHouseTitle?.replace("{title}", item.title) || `Book ${item.title}`
              : t.rentCarTitle?.replace("{title}", item.title) || `Rent ${item.title}`}
          </DialogTitle>
        </DialogHeader>

        {/* Item Info */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={item.image || "/placeholder.svg?height=80&width=80"}
              alt={item.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              {isGuestHouse ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Up to {item.maxGuests} guests</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">${item.price}</span>
                    <span className="text-muted-foreground">{t.perNight || "/night"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {item.seats} {t.seats || "seats"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span>{item.transmission || t.automatic || "Automatic"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4" />
                      <span>{item.fuelType || t.petrol || "Petrol"}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">${item.price}</span>
                    <span className="text-muted-foreground">{t.perDay || "/day"}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t.firstName || "First Name"} *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t.lastName || "Last Name"} *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">{t.email || "Email"} *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="phone">{t.phone || "Phone"} *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Booking/Rental Specific Fields */}
          <Separator />

          {isGuestHouse ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">{t.checkIn || "Check-in"} *</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">{t.checkOut || "Check-out"} *</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split("T")[0]}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guests">{t.guests || "Number of Guests"} *</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={item.maxGuests}
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number.parseInt(e.target.value))}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupDate">{t.pickupDate || "Pickup Date"} *</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="returnDate">{t.returnDate || "Return Date"} *</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split("T")[0]}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pickupLocation">{t.pickupLocation || "Pickup Location"} *</Label>
                <Input
                  id="pickupLocation"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder={t.cityOrAirport || "City or Airport"}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="requests">{t.requests || "Special Requests"}</Label>
            <Textarea
              id="requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder={t.anySpecialRequests || "Any special requests?"}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <Separator />

          {/* Booking Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">
              {isGuestHouse ? t.bookingSummary || "Booking Summary" : t.rentalSummary || "Rental Summary"}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{isGuestHouse ? t.pricePerNight || "Price per night" : t.pricePerDay || "Price per day"}:</span>
                <span>${item.price}</span>
              </div>
              {isGuestHouse ? (
                <>
                  <div className="flex justify-between">
                    <span>{t.numberOfNights || "Number of nights"}:</span>
                    <span>
                      {checkInDate && checkOutDate
                        ? Math.ceil(
                            (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.numberOfGuests || "Number of guests"}:</span>
                    <span>{numGuests}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>{t.numberOfDays || "Number of days"}:</span>
                    <span>
                      {pickupDate && returnDate
                        ? Math.ceil(
                            (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24),
                          )
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.pickupLocation || "Pickup location"}:</span>
                    <span>{pickupLocation || "Not specified"}</span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>{t.total || "Total"}:</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || totalPrice <= 0}>
            {isSubmitting ? (
              <>
                <Calendar className="mr-2 h-4 w-4 animate-spin" />
                {t.processing || "Processing..."}
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                {isGuestHouse ? t.confirmBooking || "Confirm Booking" : t.confirmRental || "Confirm Rental"}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
