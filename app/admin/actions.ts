"use server"

import { revalidatePath } from "next/cache"
import { getBookingsData, getCarsData, getGuestHousesData } from "@/lib/strapi-data"
import type { Booking } from "@/lib/types"

export async function getDashboardStats() {
  try {
    const [bookings, cars, guestHouses] = await Promise.all([getBookingsData(), getCarsData(), getGuestHousesData()])

    const pendingBookings = bookings.filter((booking: Booking) => booking.status === "pending").length
    const confirmedBookings = bookings.filter((booking: Booking) => booking.status === "confirmed").length

    return {
      totalBookings: bookings.length,
      totalCars: cars.length,
      totalGuestHouses: guestHouses.length,
      pendingBookings,
      confirmedBookings,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalBookings: 0,
      totalCars: 0,
      totalGuestHouses: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
    }
  }
}

export async function getBookings() {
  try {
    const bookings = await getBookingsData()
    return bookings
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return []
  }
}

export async function getGuestHouseBookings() {
  try {
    const bookings = await getBookingsData()
    return bookings.filter((booking: Booking) => booking.type === "guest-house")
  } catch (error) {
    console.error("Error fetching guest house bookings:", error)
    return []
  }
}

export async function getCarRentalBookings() {
  try {
    const bookings = await getBookingsData()
    return bookings.filter((booking: Booking) => booking.type === "car-rental")
  } catch (error) {
    console.error("Error fetching car rental bookings:", error)
    return []
  }
}

export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    // This would normally update the booking status in Strapi
    // For now, we'll just revalidate the path
    revalidatePath("/admin/bookings")
    revalidatePath("/admin/guest-house-bookings")
    revalidatePath("/admin/car-rental-bookings")
    return { success: true }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return { success: false, error: "Failed to update booking status" }
  }
}
