"use server"

import { revalidatePath } from "next/cache"
import { getBookingsData, updateBookingStatusData, getDashboardStatsData } from "@/lib/strapi-data"
import type { BookingStatus } from "@/lib/types"

export async function getBookings() {
  try {
    const bookings = await getBookingsData()
    return bookings
  } catch (error) {
    console.error("Failed to fetch bookings:", error)
    return []
  }
}

export async function getGuestHouseBookings() {
  try {
    const allBookings = await getBookingsData()
    return allBookings.filter((booking) => booking.type === "guestHouse")
  } catch (error) {
    console.error("Failed to fetch guest house bookings:", error)
    return []
  }
}

export async function getCarRentalBookings() {
  try {
    const allBookings = await getBookingsData()
    return allBookings.filter((booking) => booking.type === "car")
  } catch (error) {
    console.error("Failed to fetch car rental bookings:", error)
    return []
  }
}

export async function updateBookingStatusAction(bookingId: string, status: BookingStatus) {
  try {
    await updateBookingStatusData(bookingId, status)
    revalidatePath("/admin/bookings")
    revalidatePath("/admin/guest-house-bookings")
    revalidatePath("/admin/car-rental-bookings")
    revalidatePath(`/admin/bookings/${bookingId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to update booking status:", error)
    throw new Error("Failed to update booking status")
  }
}

export async function updateBookingStatus(bookingId: string, status: string) {
  return updateBookingStatusAction(bookingId, status as BookingStatus)
}

export async function getDashboardStats() {
  try {
    const stats = await getDashboardStatsData()
    const allBookings = await getBookingsData()

    const guestHouseBookings = allBookings.filter((b) => b.type === "guestHouse").length
    const carRentalBookings = allBookings.filter((b) => b.type === "car").length
    const totalRevenue = allBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)

    return {
      ...stats,
      guestHouseBookings,
      carRentalBookings,
      totalRevenue,
    }
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return {
      totalGuestHouses: 0,
      totalCars: 0,
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      guestHouseBookings: 0,
      carRentalBookings: 0,
      totalRevenue: 0,
    }
  }
}
