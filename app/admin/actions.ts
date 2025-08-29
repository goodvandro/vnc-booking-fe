"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { BookingStatus, Car, GuestHouseOutputDTO } from "@/lib/types"
import {
  getBookingsData,
  getBookingByIdData,
  updateBookingStatusData,
  getDashboardStatsData,
  // stubs below keep other admin imports working
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
} from "@/lib/strapi-data"

// BOOKINGS
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
// Keep this export for the client component import to avoid "doesn't provide an export" errors.
export async function updateBookingStatusAction(id: string, status: BookingStatus) {
  await updateBookingStatusData(id, status)
  revalidatePath("/admin/bookings")
}

// GUEST HOUSE BOOKINGS
export async function getGuestHouseBookings() {
  const allBookings = await getBookingsData()
  return allBookings.filter((booking) => booking.type === "guestHouse")
}

// CAR RENTAL BOOKINGS
export async function getCarRentalBookings() {
  const allBookings = await getBookingsData()
  return allBookings.filter((booking) => booking.type === "car")
}

// DASHBOARD
export async function getDashboardStats() {
  return await getDashboardStatsData()
}

// GUEST HOUSES (stubs passthrough)
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
  return (await getGuestHousesData()) as GuestHouseOutputDTO[]
}
export async function getGuestHouse(id: string) {
  return await getGuestHouseByIdData(id)
}
export async function createGuestHouse(payload: any) {
  return await createGuestHouseData(payload)
}
export async function updateGuestHouse(id: string, payload: any) {
  return await updateGuestHouseData(id, payload)
}
export async function deleteGuestHouse(id: string | number) {
  await deleteGuestHouseData(String(id))
  revalidatePath("/admin/guest-houses")
}

// CARS (stubs passthrough)
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
    carId: new Date().getTime().toString(),
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
export async function deleteCar(id: string | number) {
  await deleteCarData(String(id))
  revalidatePath("/admin/cars")
}
