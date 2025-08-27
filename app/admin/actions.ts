"use server"

import { revalidatePath } from "next/cache"
import { strapiAPI } from "@/lib/strapi-api"

export async function createCar(formData: FormData) {
  try {
    const carData = {
      name: formData.get("name") as string,
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: Number.parseInt(formData.get("year") as string),
      seats: Number.parseInt(formData.get("seats") as string),
      transmission: formData.get("transmission") as string,
      fuelType: formData.get("fuelType") as string,
      pricePerDay: Number.parseFloat(formData.get("pricePerDay") as string),
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      images: JSON.parse((formData.get("images") as string) || "[]"),
      available: formData.get("available") === "true",
    }

    const result = await strapiAPI.createCar(carData)

    if (result.success) {
      revalidatePath("/admin/cars")
      return { success: true, message: "Car created successfully" }
    } else {
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error("Error creating car:", error)
    return { success: false, error: "Failed to create car" }
  }
}

export async function updateCar(id: string, formData: FormData) {
  try {
    const carData = {
      name: formData.get("name") as string,
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: Number.parseInt(formData.get("year") as string),
      seats: Number.parseInt(formData.get("seats") as string),
      transmission: formData.get("transmission") as string,
      fuelType: formData.get("fuelType") as string,
      pricePerDay: Number.parseFloat(formData.get("pricePerDay") as string),
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      images: JSON.parse((formData.get("images") as string) || "[]"),
      available: formData.get("available") === "true",
    }

    const result = await strapiAPI.updateCar(id, carData)

    if (result.success) {
      revalidatePath("/admin/cars")
      return { success: true, message: "Car updated successfully" }
    } else {
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error("Error updating car:", error)
    return { success: false, error: "Failed to update car" }
  }
}

export async function createGuestHouse(formData: FormData) {
  try {
    const guestHouseData = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      pricePerNight: Number.parseFloat(formData.get("pricePerNight") as string),
      maxGuests: Number.parseInt(formData.get("maxGuests") as string),
      bedrooms: Number.parseInt(formData.get("bedrooms") as string),
      bathrooms: Number.parseInt(formData.get("bathrooms") as string),
      rating: Number.parseFloat(formData.get("rating") as string),
      description: formData.get("description") as string,
      amenities: JSON.parse((formData.get("amenities") as string) || "[]"),
      images: JSON.parse((formData.get("images") as string) || "[]"),
      available: formData.get("available") === "true",
    }

    const result = await strapiAPI.createGuestHouse(guestHouseData)

    if (result.success) {
      revalidatePath("/admin/guest-houses")
      return { success: true, message: "Guest house created successfully" }
    } else {
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error("Error creating guest house:", error)
    return { success: false, error: "Failed to create guest house" }
  }
}

export async function updateGuestHouse(id: string, formData: FormData) {
  try {
    const guestHouseData = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      pricePerNight: Number.parseFloat(formData.get("pricePerNight") as string),
      maxGuests: Number.parseInt(formData.get("maxGuests") as string),
      bedrooms: Number.parseInt(formData.get("bedrooms") as string),
      bathrooms: Number.parseInt(formData.get("bathrooms") as string),
      rating: Number.parseFloat(formData.get("rating") as string),
      description: formData.get("description") as string,
      amenities: JSON.parse((formData.get("amenities") as string) || "[]"),
      images: JSON.parse((formData.get("images") as string) || "[]"),
      available: formData.get("available") === "true",
    }

    const result = await strapiAPI.updateGuestHouse(id, guestHouseData)

    if (result.success) {
      revalidatePath("/admin/guest-houses")
      return { success: true, message: "Guest house updated successfully" }
    } else {
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error("Error updating guest house:", error)
    return { success: false, error: "Failed to update guest house" }
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const result = await strapiAPI.updateBookingStatus(id, status)

    if (result.success) {
      revalidatePath("/admin/bookings")
      return { success: true, message: "Booking status updated successfully" }
    } else {
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return { success: false, error: "Failed to update booking status" }
  }
}
