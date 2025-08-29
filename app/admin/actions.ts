"use server"

import { revalidatePath } from "next/cache"

// Mock data for bookings
const mockBookings = [
  {
    id: "booking-001",
    type: "guestHouse" as const,
    itemName: "Cozy Mountain Retreat",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    startDate: "2024-02-15",
    endDate: "2024-02-20",
    guestsOrSeats: 4,
    totalPrice: 750.0,
    status: "confirmed" as const,
    specialRequests: "Late check-in requested",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "booking-002",
    type: "carRental" as const,
    itemName: "Toyota Camry 2023",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1-555-0456",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    guestsOrSeats: 5,
    pickupLocation: "Airport Terminal 1",
    totalPrice: 180.0,
    status: "pending" as const,
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "booking-003",
    type: "guestHouse" as const,
    itemName: "Seaside Villa",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phone: "+1-555-0789",
    startDate: "2024-03-01",
    endDate: "2024-03-07",
    guestsOrSeats: 6,
    totalPrice: 1200.0,
    status: "confirmed" as const,
    createdAt: "2024-01-20T09:15:00Z",
  },
]

export async function getBookings() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockBookings
}

export async function getGuestHouseBookings() {
  const bookings = await getBookings()
  return bookings.filter((booking) => booking.type === "guestHouse")
}

export async function getCarRentalBookings() {
  const bookings = await getBookings()
  return bookings.filter((booking) => booking.type === "carRental")
}

export async function getBookingById(id: string) {
  const bookings = await getBookings()
  return bookings.find((booking) => booking.id === id)
}

export async function updateBookingStatus(bookingId: string, status: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, this would update the database
  console.log(`Updating booking ${bookingId} to status: ${status}`)

  revalidatePath("/admin/bookings")
  revalidatePath("/admin/guest-house-bookings")
  revalidatePath("/admin/car-rental-bookings")
  revalidatePath(`/admin/bookings/${bookingId}`)

  return { success: true }
}

// Mock data for dashboard stats
export async function getDashboardStats() {
  const bookings = await getBookings()
  const guestHouseBookings = bookings.filter((b) => b.type === "guestHouse")
  const carRentalBookings = bookings.filter((b) => b.type === "carRental")

  return {
    totalBookings: bookings.length,
    guestHouseBookings: guestHouseBookings.length,
    carRentalBookings: carRentalBookings.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
  }
}
