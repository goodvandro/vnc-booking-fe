"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
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
  getBookingsData,
  updateBookingStatusData,
  getDashboardStatsData,
} from "@/lib/data"
import type { GuestHouse, Car, BookingStatus } from "@/lib/types"

// Helper function to extract images from form data
function extractImagesFromFormData(formData: FormData): string[] {
  const images: string[] = []
  let index = 0

  while (formData.has(`image-${index}`)) {
    const image = formData.get(`image-${index}`) as string
    if (image && image.trim()) {
      images.push(image.trim())
    }
    index++
  }

  return images.length > 0 ? images : ["/placeholder.svg?height=300&width=400"]
}

// Guest House Actions
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
    title: formData.get("title") as string,
    location: formData.get("location") as string,
    rating: Number.parseFloat(formData.get("rating") as string),
    price: Number.parseFloat(formData.get("price") as string),
    description: formData.get("description") as string,
  }
  await createGuestHouseData(newGh)
  revalidatePath("/admin/guest-houses")
  redirect("/admin/guest-houses")
}

export async function updateGuestHouse(id: string, formData: FormData) {
  const images = extractImagesFromFormData(formData)

  const updatedGh: Partial<GuestHouse> = {
    images,
    title: formData.get("title") as string,
    location: formData.get("location") as string,
    rating: Number.parseFloat(formData.get("rating") as string),
    price: Number.parseFloat(formData.get("price") as string),
    description: formData.get("description") as string,
  }
  await updateGuestHouseData(id, updatedGh)
  revalidatePath("/admin/guest-houses")
  redirect("/admin/guest-houses")
}

export async function deleteGuestHouse(id: string) {
  await deleteGuestHouseData(id)
  revalidatePath("/admin/guest-houses")
}

// Car Actions
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
    title: formData.get("title") as string,
    seats: Number.parseInt(formData.get("seats") as string),
    transmission: formData.get("transmission") as string,
    price: Number.parseFloat(formData.get("price") as string),
    description: formData.get("description") as string,
  }
  await createCarData(newCar)
  revalidatePath("/admin/cars")
  redirect("/admin/cars")
}

export async function updateCar(id: string, formData: FormData) {
  const images = extractImagesFromFormData(formData)

  const updatedCar: Partial<Car> = {
    images,
    title: formData.get("title") as string,
    seats: Number.parseInt(formData.get("seats") as string),
    transmission: formData.get("transmission") as string,
    price: Number.parseFloat(formData.get("price") as string),
    description: formData.get("description") as string,
  }
  await updateCarData(id, updatedCar)
  revalidatePath("/admin/cars")
  redirect("/admin/cars")
}

export async function deleteCar(id: string) {
  await deleteCarData(id)
  revalidatePath("/admin/cars")
}

// Booking Actions
export async function getBookings() {
  return await getBookingsData()
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await updateBookingStatusData(id, status)
  revalidatePath("/admin/bookings")
}

// Dashboard Actions
export async function getDashboardStats() {
  return await getDashboardStatsData()
}

// Server Action for updating booking status (to be used in client components)
export async function updateBookingStatusAction(id: string, status: BookingStatus) {
  await updateBookingStatusData(id, status)
  revalidatePath("/admin/bookings")
}
