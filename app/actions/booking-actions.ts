"use server"

import { revalidatePath } from "next/cache"
import { strapiAPI } from "@/lib/strapi-api"
import { auth } from "@clerk/nextjs/server"

// Generate unique booking ID
function generateBookingId(type: "guest-house" | "car-rental"): string {
  const prefix = type === "guest-house" ? "GH" : "CR"
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}-${random}`.toUpperCase()
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
    const guests = Number.parseInt(formData.get("guests") as string)
    const specialRequests = formData.get("specialRequests") as string
    const checkIn = formData.get("checkIn") as string
    const checkOut = formData.get("checkOut") as string
    const totalPrice = Number.parseFloat(formData.get("totalPrice") as string)
    const guestHouseId = formData.get("guestHouseId") as string

    // Validation
    if (!firstName || !lastName || !email || !phone || !checkIn || !checkOut || !guestHouseId) {
      return { success: false, error: "Missing required fields" }
    }

    if (guests < 1) {
      return { success: false, error: "Number of guests must be at least 1" }
    }

    if (totalPrice <= 0) {
      return { success: false, error: "Invalid total price" }
    }

    // Date validation
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      return { success: false, error: "Check-in date cannot be in the past" }
    }

    if (checkOutDate <= checkInDate) {
      return { success: false, error: "Check-out date must be after check-in date" }
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
      guests,
      specialRequests: specialRequests || "",
      checkIn,
      checkOut,
      totalPrice,
      bookingStatus: "pending",
      ...(userId && { user: userId }),
      guest_house: Number.parseInt(guestHouseId),
    }

    // Create booking in Strapi
    const result = await strapiAPI.createGuestHouseBooking(bookingData)

    if (!result) {
      return { success: false, error: "Failed to create booking" }
    }

    // Revalidate admin pages
    revalidatePath("/admin/bookings")

    return {
      success: true,
      bookingId,
      message: "Guest house booking created successfully!",
    }
  } catch (error) {
    console.error("Guest house booking error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create booking",
    }
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
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string
    const totalPrice = Number.parseFloat(formData.get("totalPrice") as string)
    const carId = formData.get("carId") as string

    // Validation
    if (!firstName || !lastName || !email || !phone || !startDate || !endDate || !carId) {
      return { success: false, error: "Missing required fields" }
    }

    if (totalPrice <= 0) {
      return { success: false, error: "Invalid total price" }
    }

    // Date validation
    const startDateTime = new Date(startDate)
    const endDateTime = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDateTime < today) {
      return { success: false, error: "Start date cannot be in the past" }
    }

    if (endDateTime <= startDateTime) {
      return { success: false, error: "End date must be after start date" }
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
      startDate,
      endDate,
      totalPrice,
      bookingStatus: "pending",
      ...(userId && { user: userId }),
      car: Number.parseInt(carId),
    }

    // Create booking in Strapi
    const result = await strapiAPI.createCarRentalBooking(bookingData)

    if (!result) {
      return { success: false, error: "Failed to create booking" }
    }

    // Revalidate admin pages
    revalidatePath("/admin/bookings")

    return {
      success: true,
      bookingId,
      message: "Car rental booking created successfully!",
    }
  } catch (error) {
    console.error("Car rental booking error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create booking",
    }
  }
}
