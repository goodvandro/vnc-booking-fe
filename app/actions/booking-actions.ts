"use server"

import { strapiAPI } from "@/lib/strapi-api"
import { revalidatePath } from "next/cache"

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
  pickupDate: string
  returnDate: string
  pickupLocation: string
  specialRequests?: string
  carId: number
  totalPrice: number
}

export async function createGuestHouseBooking(data: GuestHouseBookingData) {
  try {
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

    // Prepare data for Strapi
    const bookingData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      numGuests: data.numGuests,
      specialRequests: data.specialRequests || "",
      totalPrice: data.totalPrice,
      bookingStatus: "pending",
      guest_house: data.guestHouseId,
    }

    const result = await strapiAPI.createGuestHouseBooking(bookingData)

    // Revalidate the bookings page to show the new booking
    revalidatePath("/admin/bookings")

    return {
      success: true,
      data: result.data,
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
    // Validate required fields
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.pickupDate ||
      !data.returnDate ||
      !data.pickupLocation
    ) {
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

    // Prepare data for Strapi
    const bookingData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      pickupDate: data.pickupDate,
      returnDate: data.returnDate,
      pickupLocation: data.pickupLocation,
      specialRequests: data.specialRequests || "",
      totalPrice: data.totalPrice,
      bookingStatus: "pending",
      car: data.carId,
    }

    const result = await strapiAPI.createCarRentalBooking(bookingData)

    // Revalidate the bookings page to show the new booking
    revalidatePath("/admin/bookings")

    return {
      success: true,
      data: result.data,
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
