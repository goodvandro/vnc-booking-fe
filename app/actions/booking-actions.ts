"use server"

import { revalidatePath } from "next/cache"
import { strapiAPI } from "@/lib/strapi-api"

// Generate unique booking ID
function generateBookingId(type: "GH" | "CR"): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${type}-${timestamp}-${random}`
}

// Guest House Booking Action
export async function createGuestHouseBooking(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const guests = Number.parseInt(formData.get("guests") as string)
    const specialRequests = formData.get("specialRequests") as string
    const checkInDate = formData.get("checkInDate") as string
    const checkOutDate = formData.get("checkOutDate") as string
    const totalPrice = Number.parseFloat(formData.get("totalPrice") as string)
    const guestHouseId = formData.get("guestHouseId") as string
    const userId = formData.get("userId") as string

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !guests ||
      !checkInDate ||
      !checkOutDate ||
      !totalPrice ||
      !guestHouseId
    ) {
      return {
        success: false,
        message: "All required fields must be filled out.",
      }
    }

    // Date validation
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkIn < today) {
      return {
        success: false,
        message: "Check-in date cannot be in the past.",
      }
    }

    if (checkOut <= checkIn) {
      return {
        success: false,
        message: "Check-out date must be after check-in date.",
      }
    }

    if (guests < 1 || guests > 20) {
      return {
        success: false,
        message: "Number of guests must be between 1 and 20.",
      }
    }

    // Generate booking ID
    const bookingId = generateBookingId("GH")

    // Prepare booking data for Strapi
    const bookingData = {
      bookingId,
      firstName,
      lastName,
      email,
      phone,
      guests,
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
        message: `Booking created successfully! Your booking ID is: ${bookingId}`,
        bookingId,
      }
    } else {
      return {
        success: false,
        message: result.error || "Failed to create booking. Please try again.",
      }
    }
  } catch (error) {
    console.error("Guest house booking error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Car Rental Booking Action
export async function createCarRentalBooking(prevState: any, formData: FormData) {
  try {
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
    const userId = formData.get("userId") as string

    // Validation
    if (!firstName || !lastName || !email || !phone || !startDate || !endDate || !totalPrice || !carId) {
      return {
        success: false,
        message: "All required fields must be filled out.",
      }
    }

    // Date validation
    const pickup = new Date(startDate)
    const returnDate = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (pickup < today) {
      return {
        success: false,
        message: "Pickup date cannot be in the past.",
      }
    }

    if (returnDate <= pickup) {
      return {
        success: false,
        message: "Return date must be after pickup date.",
      }
    }

    // Generate booking ID
    const bookingId = generateBookingId("CR")

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
        message: `Booking created successfully! Your booking ID is: ${bookingId}`,
        bookingId,
      }
    } else {
      return {
        success: false,
        message: result.error || "Failed to create booking. Please try again.",
      }
    }
  } catch (error) {
    console.error("Car rental booking error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
