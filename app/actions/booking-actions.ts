"use server"

import { revalidatePath } from "next/cache"
import { strapiAPI } from "@/lib/strapi-api"

export async function createGuestHouseBooking(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const checkIn = formData.get("checkIn") as string
    const checkOut = formData.get("checkOut") as string
    const guests = Number.parseInt(formData.get("guests") as string)
    const specialRequests = formData.get("specialRequests") as string
    const totalPrice = Number.parseFloat(formData.get("totalPrice") as string)
    const guestHouseId = formData.get("guestHouseId") as string
    const userId = formData.get("userId") as string

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !checkIn ||
      !checkOut ||
      !guests ||
      !totalPrice ||
      !guestHouseId
    ) {
      return {
        success: false,
        error: "All required fields must be filled",
      }
    }

    // Validate dates
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      return {
        success: false,
        error: "Check-in date cannot be in the past",
      }
    }

    if (checkOutDate <= checkInDate) {
      return {
        success: false,
        error: "Check-out date must be after check-in date",
      }
    }

    // Generate unique booking ID
    const bookingId = `GH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create booking data matching Strapi structure
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

    if (result.success) {
      // Revalidate admin pages to show new booking
      revalidatePath("/admin/bookings")

      return {
        success: true,
        bookingId,
        message: `Booking created successfully! Your booking ID is: ${bookingId}`,
      }
    } else {
      return {
        success: false,
        error: result.error || "Failed to create booking",
      }
    }
  } catch (error) {
    console.error("Error creating guest house booking:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function createCarRentalBooking(formData: FormData) {
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

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !startDate || !endDate || !totalPrice || !carId) {
      return {
        success: false,
        error: "All required fields must be filled",
      }
    }

    // Validate dates
    const pickupDate = new Date(startDate)
    const returnDate = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (pickupDate < today) {
      return {
        success: false,
        error: "Pickup date cannot be in the past",
      }
    }

    if (returnDate <= pickupDate) {
      return {
        success: false,
        error: "Return date must be after pickup date",
      }
    }

    // Generate unique booking ID
    const bookingId = `CR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create booking data matching Strapi structure
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
        bookingId,
        message: `Booking created successfully! Your booking ID is: ${bookingId}`,
      }
    } else {
      return {
        success: false,
        error: result.error || "Failed to create booking",
      }
    }
  } catch (error) {
    console.error("Error creating car rental booking:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
