"use server"

import { revalidatePath } from "next/cache"
import { strapiAPI } from "@/lib/strapi-api"
import { auth } from "@clerk/nextjs/server"

// Generate unique booking ID
function generateBookingId(type: "guest-house" | "car"): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  const prefix = type === "guest-house" ? "GH" : "CR"
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
    const guests = Number.parseInt(formData.get("guests") as string)
    const specialRequests = formData.get("specialRequests") as string
    const checkIn = formData.get("checkIn") as string
    const checkOut = formData.get("checkOut") as string
    const totalPrice = Number.parseFloat(formData.get("totalPrice") as string)
    const guestHouseId = formData.get("guestHouseId") as string

    // Validation
    if (!firstName || !lastName || !email || !phone || !checkIn || !checkOut || !totalPrice) {
      throw new Error("Missing required fields")
    }

    // Date validation
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      throw new Error("Check-in date cannot be in the past")
    }

    if (checkOutDate <= checkInDate) {
      throw new Error("Check-out date must be after check-in date")
    }

    // Generate unique booking ID
    const bookingId = generateBookingId("guest-house")

    // Create booking payload matching Strapi structure
    const bookingPayload = {
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
      user: userId ? Number.parseInt(userId) : null,
      guest_house: guestHouseId ? Number.parseInt(guestHouseId) : null,
    }

    // Create booking in Strapi
    const response = await strapiAPI.createGuestHouseBooking(bookingPayload)

    // Revalidate admin pages
    revalidatePath("/admin/bookings")
    revalidatePath("/admin")

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
    if (!firstName || !lastName || !email || !phone || !startDate || !endDate || !totalPrice) {
      throw new Error("Missing required fields")
    }

    // Date validation
    const startDateTime = new Date(startDate)
    const endDateTime = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDateTime < today) {
      throw new Error("Start date cannot be in the past")
    }

    if (endDateTime <= startDateTime) {
      throw new Error("End date must be after start date")
    }

    // Generate unique booking ID
    const bookingId = generateBookingId("car")

    // Create booking payload matching Strapi structure
    const bookingPayload = {
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
      user: userId ? Number.parseInt(userId) : null,
      car: carId ? Number.parseInt(carId) : null,
    }

    // Create booking in Strapi
    const response = await strapiAPI.createCarRentalBooking(bookingPayload)

    // Revalidate admin pages
    revalidatePath("/admin/bookings")
    revalidatePath("/admin")

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
