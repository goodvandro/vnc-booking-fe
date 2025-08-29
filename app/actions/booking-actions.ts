"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

// Generate unique booking ID
function generateBookingId(type: "guest-house" | "car-rental"): string {
  const prefix = type === "guest-house" ? "GH" : "CR"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// Guest House Booking Action
export async function createGuestHouseBooking(prevState: any, formData: FormData) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      redirect("/sign-in")
    }

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
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    if (guests < 1 || guests > 8) {
      return {
        success: false,
        message: "Number of guests must be between 1 and 8.",
      }
    }

    if (totalPrice <= 0) {
      return {
        success: false,
        message: "Invalid booking dates or price.",
      }
    }

    // Generate unique booking ID
    const bookingId = generateBookingId("guest-house")

    // Prepare booking data for Strapi
    const bookingData = {
      data: {
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
        // user: userId,
        guest_house: guestHouseId,
      },
    }

    console.log("bookingData", bookingData)

    // Submit to Strapi
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/guest-house-bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Strapi error:", errorData)
      return {
        success: false,
        message: "Failed to create booking. Please try again.",
      }
    }

    const result = await response.json()

    return {
      success: true,
      message: `Your guest house booking has been confirmed! We'll send you a confirmation email shortly.`,
      bookingId,
      data: result.data,
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
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      redirect("/sign-in")
    }

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
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    if (totalPrice <= 0) {
      return {
        success: false,
        message: "Invalid rental dates or price.",
      }
    }

    // Generate unique booking ID
    const bookingId = generateBookingId("car-rental")

    // Prepare booking data for Strapi
    const bookingData = {
      data: {
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
        // user: userId,
        car: carId,
      },
    }

    // Submit to Strapi
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/car-rental-bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Strapi error:", errorData)
      return {
        success: false,
        message: "Failed to create rental booking. Please try again.",
      }
    }

    const result = await response.json()

    return {
      success: true,
      message: `Your car rental booking has been confirmed! We'll send you a confirmation email shortly.`,
      bookingId,
      data: result.data,
    }
  } catch (error) {
    console.error("Car rental booking error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
