"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { strapiAPI } from "@/lib/strapi-api"

// Generate unique booking ID
function generateBookingId(type: "guest-house" | "car-rental"): string {
  const prefix = type === "guest-house" ? "GH" : "CR"
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// Guest House Booking Action
export async function createGuestHouseBooking(formData: FormData) {
  try {
    const { userId } = auth()

    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const specialRequests = formData.get("specialRequests") as string
    const checkInDate = formData.get("checkInDate") as string
    const checkOutDate = formData.get("checkOutDate") as string
    const numGuests = Number.parseInt(formData.get("numGuests") as string)
    const totalPrice = Number.parseFloat(formData.get("totalPrice") as string)
    const guestHouseId = formData.get("guestHouseId") as string

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      return { success: false, error: "All required fields must be filled" }
    }

    if (!checkInDate || !checkOutDate) {
      return { success: false, error: "Check-in and check-out dates are required" }
    }

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkIn < today) {
      return { success: false, error: "Check-in date cannot be in the past" }
    }

    if (checkOut <= checkIn) {
      return { success: false, error: "Check-out date must be after check-in date" }
    }

    if (numGuests < 1) {
      return { success: false, error: "Number of guests must be at least 1" }
    }

    if (!guestHouseId) {
      return { success: false, error: "Guest house selection is required" }
    }

    // Generate booking ID
    const bookingId = generateBookingId("guest-house")

    // Prepare booking data for Strapi
    const bookingData = {
      bookingId,
      firstName,
      lastName,
      email,
      phone,
      guests: numGuests,
      specialRequests: specialRequests || "",
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      bookingStatus: "pending",
      user: userId ? Number.parseInt(userId) : null,
      guest_house: Number.parseInt(guestHouseId),
    }

    // Create booking in Strapi
    const result = await strapiAPI.createGuestHouseBooking(bookingData)

    if (result.success) {
      // Revalidate admin pages to show new booking
      revalidatePath("/admin/bookings")

      return {
        success: true,
        message: `Booking confirmed! Your booking ID is: ${bookingId}`,
        bookingId,
      }
    } else {
      return { success: false, error: result.error || "Failed to create booking" }
    }
  } catch (error) {
    console.error("Guest house booking error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Car Rental Booking Action
export async function createCarRentalBooking(formData: FormData) {
  try {
    const { userId } = auth()

    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const driverLicense = formData.get("driverLicense") as string
    const specialRequests = formData.get("specialRequests") as string
    const pickupDate = formData.get("pickupDate") as string
    const returnDate = formData.get("returnDate") as string
    const pickupLocation = formData.get("pickupLocation") as string
    const totalPrice = Number.parseFloat(formData.get("totalPrice") as string)
    const carId = formData.get("carId") as string

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      return { success: false, error: "All required fields must be filled" }
    }

    if (!pickupDate || !returnDate) {
      return { success: false, error: "Pickup and return dates are required" }
    }

    if (!pickupLocation) {
      return { success: false, error: "Pickup location is required" }
    }

    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (pickup < today) {
      return { success: false, error: "Pickup date cannot be in the past" }
    }

    if (returnD <= pickup) {
      return { success: false, error: "Return date must be after pickup date" }
    }

    if (!carId) {
      return { success: false, error: "Car selection is required" }
    }

    // Generate booking ID
    const bookingId = generateBookingId("car-rental")

    // Prepare booking data for Strapi
    const bookingData = {
      bookingId,
      firstName,
      lastName,
      email,
      phone,
      driverLicense: driverLicense || "",
      startDate: pickupDate,
      endDate: returnDate,
      totalPrice,
      bookingStatus: "pending",
      user: userId ? Number.parseInt(userId) : null,
      car: Number.parseInt(carId),
    }

    // Create booking in Strapi
    const result = await strapiAPI.createCarRentalBooking(bookingData)

    if (result.success) {
      // Revalidate admin pages to show new booking
      revalidatePath("/admin/bookings")

      return {
        success: true,
        message: `Rental confirmed! Your booking ID is: ${bookingId}`,
        bookingId,
      }
    } else {
      return { success: false, error: result.error || "Failed to create booking" }
    }
  } catch (error) {
    console.error("Car rental booking error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}
