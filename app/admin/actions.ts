"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { BookingStatus, Car, GuestHouse } from "@/lib/types"
import {
  getBookingsData,
  updateBookingStatusData,
  getBookingByIdData,
  // The following are present to satisfy other admin pages; they are stubs in lib/strapi-data.ts for now.
  getGuestHousesData,
  getGuestHouseByIdData,
  createGuestHouseData,
  updateGuestHouseData,
  deleteGuestHouseData,
  getCarsData,
  getCarByIdData,
  createCarData,
  updateCarData,
  deleteCarData,
  getDashboardStatsData,
} from "@/lib/strapi-data"

// ----------------------
// BOOKINGS (Strapi)
// ----------------------
export async function getBookings() {
  return await getBookingsData()
}

export async function getBookingById(id: string) {
  return await getBookingByIdData(id)
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await updateBookingStatusData(id, status)
  revalidatePath("/admin/bookings")
}

// This is the named export your client component imports.
// Keep this function exported to avoid the "doesn't provide an export" error.
export async function updateBookingStatusAction(id: string, status: BookingStatus) {
  await updateBookingStatusData(id, status)
  revalidatePath("/admin/bookings")
}

// ----------------------
// DASHBOARD (optional)
// ----------------------
export async function getDashboardStats() {
  return await getDashboardStatsData()
}

// ----------------------
// GUEST HOUSES (placeholder pass-throughs)
// ----------------------
function extractImagesFromFormData(formData: FormData): string[] {
  const images: string[] = []
  let index = 0
  while (formData.has(`image-${index}`)) {
    const image = formData.get(`image-${index}`) as string
    if (image && image.trim()) images.push(image.trim())
    index++
  }
  return images.length > 0 ? images : ["/placeholder.svg?height=300&width=400"]
}

export async function getGuestHouses() {
  return await getGuestHousesData()
}

export async function getGuestHouse(id: string) {
  return await getGuestHouseByIdData(id)
}

export async function createGuestHouse(formData: FormData) {
  const images = extractImagesFromFormData(formData)
  const newGh: Omit<GuestHouse, "id"> = {
    images,
    title: String(formData.get("title") || ""),
    location: String(formData.get("location") || ""),
    rating: Number.parseFloat(String(formData.get("rating") || "0")),
    price: Number.parseFloat(String(formData.get("price") || "0")),
    description: String(formData.get("description") || ""),
  }
  await createGuestHouseData(newGh)
  revalidatePath("/admin/guest-houses")
  redirect("/admin/guest-houses")
}

export async function updateGuestHouse(id: string, formData: FormData) {
  const images = extractImagesFromFormData(formData)
  const updatedGh: Partial<GuestHouse> = {
    images,
    title: String(formData.get("title") || ""),
    location: String(formData.get("location") || ""),
    rating: Number.parseFloat(String(formData.get("rating") || "0")),
    price: Number.parseFloat(String(formData.get("price") || "0")),
    description: String(formData.get("description") || ""),
  }
  await updateGuestHouseData(id, updatedGh)
  revalidatePath("/admin/guest-houses")
  redirect("/admin/guest-houses")
}

export async function deleteGuestHouse(id: string) {
  await deleteGuestHouseData(id)
  revalidatePath("/admin/guest-houses")
}

// ----------------------
// CARS (placeholder pass-throughs)
// ----------------------
export async function getCars() {
  return await getCarsData()
}

export async function getCar(id: string) {
  return await getCarByIdData(id)
}

export async function createCar(formData: FormData) {
  const images = extractImagesFromFormData(formData)
  const newCar: Omit<Car, "id"> = {
    images,
    title: String(formData.get("title") || ""),
    seats: Number.parseInt(String(formData.get("seats") || "0")),
    transmission: String(formData.get("transmission") || ""),
    price: Number.parseFloat(String(formData.get("price") || "0")),
    description: String(formData.get("description") || ""),
  }
  await createCarData(newCar)
  revalidatePath("/admin/cars")
  redirect("/admin/cars")
}

export async function updateCar(id: string, formData: FormData) {
  const images = extractImagesFromFormData(formData)
  const updatedCar: Partial<Car> = {
    images,
    title: String(formData.get("title") || ""),
    seats: Number.parseInt(String(formData.get("seats") || "0")),
    transmission: String(formData.get("transmission") || ""),
    price: Number.parseFloat(String(formData.get("price") || "0")),
    description: String(formData.get("description") || ""),
  }
  await updateCarData(id, updatedCar)
  revalidatePath("/admin/cars")
  redirect("/admin/cars")
}

export async function deleteCar(id: string) {
  await deleteCarData(id)
  revalidatePath("/admin/cars")
}
