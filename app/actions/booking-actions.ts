"use server"

import { strapiAPI } from "@/lib/strapi-api"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

export interface GuestHouseBookingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  checkInDate: string
  checkOutDate: string
  numGuests: number
  specialRequests?: string
  guestHouseId: number
  totalPrice: number
}

export interface CarRentalBookingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  driverLicense?: string
  pickupDate: string
  returnDate: string
  pickupLocation: string
  specialRequests?: string
  carId: number
  totalPrice: number
}

// Generate a unique booking ID
function generateBookingId(type: "GH" | "CR"): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${type}-${timestamp}-${random}`.toUpperCase()
}

export async function createGuestHouseBooking(data: GuestHouseBookingData) {
  try {
    // Get current user from Clerk
    const { userId } = auth()

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.checkInDate || !data.checkOutDate) {
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    // Validate dates
    const checkIn = new Date(data.checkInDate)
    const checkOut = new Date(data.checkOutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkIn < today) {
      return {
        success: false,
        error: "Check-in date cannot be in the past",
      }
    }

    if (checkOut <= checkIn) {
      return {
        success: false,
        error: "Check-out date must be after check-in date",
      }
    }

    // Validate number of guests
    if (data.numGuests < 1) {
      return {
        success: false,
        error: "Number of guests must be at least 1",
      }
    }

    // Generate unique booking ID
    const bookingId = generateBookingId("GH")

    // Prepare data for Strapi - matching the exact collection structure
    const bookingData = {
      bookingId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || "",
      guests: data.numGuests,
      specialRequests: data.specialRequests || "",
      checkIn: data.checkInDate,
      checkOut: data.checkOutDate,
      totalPrice: data.totalPrice,
      bookingStatus: "pending",
      guest_house: data.guestHouseId,
      // Add user relation if user is authenticated
      ...(userId && { user: userId }),
    }

    const result = await strapiAPI.createGuestHouseBooking(bookingData)

    // Revalidate the bookings page to show the new booking
    revalidatePath("/admin/bookings")

    return {
      success: true,
      data: result.data,
      bookingId,
      message: "Guest house booking created successfully!",
    }
  } catch (error) {
    console.error("Error creating guest house booking:", error)
    return {
      success: false,
      error: "Failed to create booking. Please try again.",
    }
  }
}

export async function createCarRentalBooking(data: CarRentalBookingData) {
  try {
    // Get current user from Clerk
    const { userId } = auth()

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.pickupDate || !data.returnDate) {
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    // Validate dates
    const pickup = new Date(data.pickupDate)
    const returnDate = new Date(data.returnDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (pickup < today) {
      return {
        success: false,
        error: "Pickup date cannot be in the past",
      }
    }

    if (returnDate <= pickup) {
      return {
        success: false,
        error: "Return date must be after pickup date",
      }
    }

    // Generate unique booking ID
    const bookingId = generateBookingId("CR")

    // Prepare data for Strapi - matching the exact collection structure
    const bookingData = {
      bookingId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || "",
      driverLicense: data.driverLicense || "",
      startDate: data.pickupDate,
      endDate: data.returnDate,
      totalPrice: data.totalPrice,
      bookingStatus: "pending",
      car: data.carId,
      // Add user relation if user is authenticated
      ...(userId && { user: userId }),
    }

    const result = await strapiAPI.createCarRentalBooking(bookingData)

    // Revalidate the bookings page to show the new booking
    revalidatePath("/admin/bookings")

    return {
      success: true,
      data: result.data,
      bookingId,
      message: "Car rental booking created successfully!",
    }
  } catch (error) {
    console.error("Error creating car rental booking:", error)
    return {
      success: false,
      error: "Failed to create booking. Please try again.",
    }
  }
}
