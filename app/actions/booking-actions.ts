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
export async function createGuestHouseBooking(prevState: any, formData: FormData) {
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
    if (!firstName || !lastName || !email || !phone) {
      return {
        success: false,
        message: "All required fields must be filled out.",
      }
    }

    if (!checkIn || !checkOut) {
      return {
        success: false,
        message: "Check-in and check-out dates are required.",
      }
    }

    if (!guests || guests < 1) {
      return {
        success: false,
        message: "Number of guests must be at least 1.",
      }
    }

    if (!totalPrice || totalPrice <= 0) {
      return {
        success: false,
        message: "Invalid total price.",
      }
    }

    if (!guestHouseId) {
      return {
        success: false,
        message: "Guest house selection is required.",
      }
    }

    // Date validation
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      return {
        success: false,
        message: "Check-in date cannot be in the past.",
      }
    }

    if (checkOutDate <= checkInDate) {
      return {
        success: false,
        message: "Check-out date must be after check-in date.",
      }
    }

    // Generate booking ID
    const bookingId = generateBookingId("guest-house")

    // Prepare booking data for Strapi (matching exact field structure)
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
      user: userId ? Number.parseInt(userId) : null,
      guest_house: Number.parseInt(guestHouseId),
    }

    // Create booking in Strapi
    const result = await strapiAPI.createGuestHouseBooking(bookingData)

    if (result.data) {
      // Revalidate admin pages to show new booking
      revalidatePath("/admin/bookings")

      return {
        success: true,
        message: `Guest house booking confirmed! Your booking ID is: ${bookingId}`,
        bookingId,
      }
    } else {
      return {
        success: false,
        message: "Failed to create booking. Please try again.",
      }
    }
  } catch (error) {
    console.error("Error creating guest house booking:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Car Rental Booking Action
export async function createCarRentalBooking(prevState: any, formData: FormData) {
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
    if (!firstName || !lastName || !email || !phone) {
      return {
        success: false,
        message: "All required fields must be filled out.",
      }
    }

    if (!startDate || !endDate) {
      return {
        success: false,
        message: "Pickup and return dates are required.",
      }
    }

    if (!totalPrice || totalPrice <= 0) {
      return {
        success: false,
        message: "Invalid total price.",
      }
    }

    if (!carId) {
      return {
        success: false,
        message: "Car selection is required.",
      }
    }

    // Date validation
    const pickupDate = new Date(startDate)
    const returnDate = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (pickupDate < today) {
      return {
        success: false,
        message: "Pickup date cannot be in the past.",
      }
    }

    if (returnDate <= pickupDate) {
      return {
        success: false,
        message: "Return date must be after pickup date.",
      }
    }

    // Generate booking ID
    const bookingId = generateBookingId("car-rental")

    // Prepare booking data for Strapi (matching exact field structure)
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

    if (result.data) {
      // Revalidate admin pages to show new booking
      revalidatePath("/admin/bookings")

      return {
        success: true,
        message: `Car rental booking confirmed! Your booking ID is: ${bookingId}`,
        bookingId,
      }
    } else {
      return {
        success: false,
        message: "Failed to create booking. Please try again.",
      }
    }
  } catch (error) {
    console.error("Error creating car rental booking:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
