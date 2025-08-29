"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { strapiAPI } from "@/lib/strapi-api"
import type { CarInputDTO, GuestHouseInputDTO } from "@/lib/types"

// Cars
export async function getCars() {
  try {
    const response = await strapiAPI.getCars()
    return response.data || []
  } catch (error) {
    console.error("Failed to fetch cars:", error)
    return []
  }
}

export async function getCar(id: string) {
  try {
    const response = await strapiAPI.getCar(id)
    return response.data
  } catch (error) {
    console.error("Failed to fetch car:", error)
    return null
  }
}

export async function createCar(formData: FormData) {
  try {
    const data: CarInputDTO = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      seats: Number.parseInt(formData.get("seats") as string),
      transmission: formData.get("transmission") as string,
      fuelType: formData.get("fuelType") as string,
      year: Number.parseInt(formData.get("year") as string),
      images: [], // Images handled separately
    }

    await strapiAPI.createCar(data)
    revalidatePath("/admin/cars")
    redirect("/admin/cars")
  } catch (error) {
    console.error("Failed to create car:", error)
    throw new Error("Failed to create car")
  }
}

export async function updateCar(id: string, formData: FormData) {
  try {
    const data: Partial<CarInputDTO> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      seats: Number.parseInt(formData.get("seats") as string),
      transmission: formData.get("transmission") as string,
      fuelType: formData.get("fuelType") as string,
      year: Number.parseInt(formData.get("year") as string),
    }

    await strapiAPI.updateCar(id, data)
    revalidatePath("/admin/cars")
    redirect("/admin/cars")
  } catch (error) {
    console.error("Failed to update car:", error)
    throw new Error("Failed to update car")
  }
}

export async function deleteCar(id: string) {
  try {
    await strapiAPI.deleteCar(id)
    revalidatePath("/admin/cars")
  } catch (error) {
    console.error("Failed to delete car:", error)
    throw new Error("Failed to delete car")
  }
}

// Guest Houses
export async function getGuestHouses() {
  try {
    const response = await strapiAPI.getGuestHouses()
    return response.data || []
  } catch (error) {
    console.error("Failed to fetch guest houses:", error)
    return []
  }
}

export async function getGuestHouse(id: string) {
  try {
    const response = await strapiAPI.getGuestHouse(id)
    return response.data
  } catch (error) {
    console.error("Failed to fetch guest house:", error)
    return null
  }
}

export async function createGuestHouse(formData: FormData) {
  try {
    const data: GuestHouseInputDTO = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      maxGuests: Number.parseInt(formData.get("maxGuests") as string),
      bedrooms: Number.parseInt(formData.get("bedrooms") as string),
      bathrooms: Number.parseInt(formData.get("bathrooms") as string),
      location: formData.get("location") as string,
      amenities: formData.get("amenities") as string,
      images: [], // Images handled separately
    }

    await strapiAPI.createGuestHouse(data)
    revalidatePath("/admin/guest-houses")
    redirect("/admin/guest-houses")
  } catch (error) {
    console.error("Failed to create guest house:", error)
    throw new Error("Failed to create guest house")
  }
}

export async function updateGuestHouse(id: string, formData: FormData) {
  try {
    const data: Partial<GuestHouseInputDTO> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      maxGuests: Number.parseInt(formData.get("maxGuests") as string),
      bedrooms: Number.parseInt(formData.get("bedrooms") as string),
      bathrooms: Number.parseInt(formData.get("bathrooms") as string),
      location: formData.get("location") as string,
      amenities: formData.get("amenities") as string,
    }

    await strapiAPI.updateGuestHouse(id, data)
    revalidatePath("/admin/guest-houses")
    redirect("/admin/guest-houses")
  } catch (error) {
    console.error("Failed to update guest house:", error)
    throw new Error("Failed to update guest house")
  }
}

export async function deleteGuestHouse(id: string) {
  try {
    await strapiAPI.deleteGuestHouse(id)
    revalidatePath("/admin/guest-houses")
  } catch (error) {
    console.error("Failed to delete guest house:", error)
    throw new Error("Failed to delete guest house")
  }
}

// Bookings
export async function getBookingsData() {
  try {
    const [guestHouseBookings, carRentalBookings] = await Promise.all([
      strapiAPI.getGuestHouseBookings(),
      strapiAPI.getCarRentalBookings(),
    ])

    const allBookings = [
      ...(guestHouseBookings.data || []).map((booking: any) => ({
        ...booking,
        type: "guest-house" as const,
        itemName: booking.guest_house?.title || "Unknown Guest House",
      })),
      ...(carRentalBookings.data || []).map((booking: any) => ({
        ...booking,
        type: "car-rental" as const,
        itemName: booking.car?.title || "Unknown Car",
      })),
    ]

    return allBookings
  } catch (error) {
    console.error("Failed to fetch bookings:", error)
    return []
  }
}

export async function getGuestHouseBookings() {
  try {
    const response = await strapiAPI.getGuestHouseBookings()
    return (response.data || []).map((booking: any) => ({
      ...booking,
      type: "guest-house" as const,
      itemName: booking.guest_house?.title || "Unknown Guest House",
    }))
  } catch (error) {
    console.error("Failed to fetch guest house bookings:", error)
    return []
  }
}

export async function getCarRentalBookings() {
  try {
    const response = await strapiAPI.getCarRentalBookings()
    return (response.data || []).map((booking: any) => ({
      ...booking,
      type: "car-rental" as const,
      itemName: booking.car?.title || "Unknown Car",
    }))
  } catch (error) {
    console.error("Failed to fetch car rental bookings:", error)
    return []
  }
}

export async function getBooking(id: string) {
  try {
    // Try to get as guest house booking first
    try {
      const guestHouseBooking = await strapiAPI.getGuestHouseBooking(id)
      if (guestHouseBooking.data) {
        return {
          ...guestHouseBooking.data,
          type: "guest-house" as const,
          itemName: guestHouseBooking.data.guest_house?.title || "Unknown Guest House",
        }
      }
    } catch {
      // If not found, try car rental booking
    }

    const carRentalBooking = await strapiAPI.getCarRentalBooking(id)
    if (carRentalBooking.data) {
      return {
        ...carRentalBooking.data,
        type: "car-rental" as const,
        itemName: carRentalBooking.data.car?.title || "Unknown Car",
      }
    }

    return null
  } catch (error) {
    console.error("Failed to fetch booking:", error)
    return null
  }
}

export async function updateBookingStatus(id: string, status: string, type: "guest-house" | "car-rental") {
  try {
    if (type === "guest-house") {
      await strapiAPI.updateGuestHouseBookingStatus(id, status)
    } else {
      await strapiAPI.updateCarRentalBookingStatus(id, status)
    }

    revalidatePath("/admin/bookings")
    revalidatePath("/admin/guest-house-bookings")
    revalidatePath("/admin/car-rental-bookings")
    revalidatePath(`/admin/bookings/${id}`)

    return { success: true }
  } catch (error) {
    console.error("Failed to update booking status:", error)
    return { success: false, error: "Failed to update booking status" }
  }
}
