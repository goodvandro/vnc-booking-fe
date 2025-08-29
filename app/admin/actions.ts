"use server"

import { revalidatePath } from "next/cache"
import { strapiAPI } from "@/lib/strapi-api"
import type { Car, GuestHouse, Booking } from "@/lib/types"

// Car actions
export async function getCars(): Promise<Car[]> {
  try {
    const response = await strapiAPI.get("/cars?populate=*")
    return response.data || []
  } catch (error) {
    console.error("Error fetching cars:", error)
    return []
  }
}

export async function getCar(documentId: string): Promise<Car | null> {
  try {
    const response = await strapiAPI.get(`/cars/${documentId}?populate=*`)
    return response.data || null
  } catch (error) {
    console.error("Error fetching car:", error)
    return null
  }
}

export async function deleteCar(documentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await strapiAPI.delete(`/cars/${documentId}`)
    revalidatePath("/admin/cars")
    return { success: true }
  } catch (error) {
    console.error("Error deleting car:", error)
    return { success: false, error: "Failed to delete car" }
  }
}

// Guest House actions
export async function getGuestHouses(): Promise<GuestHouse[]> {
  try {
    const response = await strapiAPI.get("/guest-houses?populate=*")
    return response.data || []
  } catch (error) {
    console.error("Error fetching guest houses:", error)
    return []
  }
}

export async function getGuestHouse(documentId: string): Promise<GuestHouse | null> {
  try {
    const response = await strapiAPI.get(`/guest-houses/${documentId}?populate=*`)
    return response.data || null
  } catch (error) {
    console.error("Error fetching guest house:", error)
    return null
  }
}

export async function deleteGuestHouse(documentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await strapiAPI.delete(`/guest-houses/${documentId}`)
    revalidatePath("/admin/guest-houses")
    return { success: true }
  } catch (error) {
    console.error("Error deleting guest house:", error)
    return { success: false, error: "Failed to delete guest house" }
  }
}

// Booking actions
export async function getBookingsData(): Promise<Booking[]> {
  try {
    const response = await strapiAPI.get("/bookings?populate=*")
    return response.data || []
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return []
  }
}

export async function getGuestHouseBookings(): Promise<Booking[]> {
  try {
    const bookings = await getBookingsData()
    return bookings.filter((booking) => booking.type === "guest-house")
  } catch (error) {
    console.error("Error fetching guest house bookings:", error)
    return []
  }
}

export async function getCarRentalBookings(): Promise<Booking[]> {
  try {
    const bookings = await getBookingsData()
    return bookings.filter((booking) => booking.type === "car-rental")
  } catch (error) {
    console.error("Error fetching car rental bookings:", error)
    return []
  }
}

export async function getBooking(id: string): Promise<Booking | null> {
  try {
    const response = await strapiAPI.get(`/bookings/${id}?populate=*`)
    return response.data || null
  } catch (error) {
    console.error("Error fetching booking:", error)
    return null
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await strapiAPI.put(`/bookings/${bookingId}`, {
      data: { status },
    })
    revalidatePath("/admin/bookings")
    revalidatePath("/admin/guest-house-bookings")
    revalidatePath("/admin/car-rental-bookings")
    return { success: true }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return { success: false, error: "Failed to update booking status" }
  }
}
