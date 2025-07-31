import { strapiAPI } from "./strapi-api"
import type { GuestHouse, Car, Booking, BookingStatus } from "./types"

// Helper function to transform Strapi entity to our types
function transformStrapiEntity<T>(entity: any): T & { id: string } {
  return {
    id: entity.id.toString(),
    ...entity.attributes,
  }
}

function transformStrapiEntities<T>(entities: any[]): (T & { id: string })[] {
  return entities.map(transformStrapiEntity)
}

// Helper function to get image URLs from Strapi media
function getImageUrls(media: any): string[] {
  if (!media?.data) return ["/placeholder.svg?height=300&width=400"]

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

  if (Array.isArray(media.data)) {
    return media.data.map((img: any) => `${STRAPI_URL}${img.attributes.url}`)
  } else {
    return [`${STRAPI_URL}${media.data.attributes.url}`]
  }
}

// Guest House CRUD
export async function getGuestHousesData(): Promise<GuestHouse[]> {
  try {
    const response = await strapiAPI.getGuestHouses()
    return response.data.map((entity) => ({
      ...transformStrapiEntity<Omit<GuestHouse, "id">>(entity),
      images: getImageUrls(entity.attributes.images),
    }))
  } catch (error) {
    console.error("Failed to fetch guest houses:", error)
    return []
  }
}

export async function getGuestHouseByIdData(id: string): Promise<GuestHouse | undefined> {
  try {
    const response = await strapiAPI.getGuestHouse(id)
    return {
      ...transformStrapiEntity<Omit<GuestHouse, "id">>(response.data),
      images: getImageUrls(response.data.attributes.images),
    }
  } catch (error) {
    console.error("Failed to fetch guest house:", error)
    return undefined
  }
}

export async function createGuestHouseData(newGh: Omit<GuestHouse, "id">): Promise<GuestHouse> {
  try {
    const response = await strapiAPI.createGuestHouse({
      title: newGh.title,
      location: newGh.location,
      rating: newGh.rating,
      price: newGh.price,
      description: newGh.description,
      // Note: Images should be handled separately through upload endpoint
    })

    return {
      ...transformStrapiEntity<Omit<GuestHouse, "id">>(response.data),
      images: newGh.images, // Use provided images for now
    }
  } catch (error) {
    console.error("Failed to create guest house:", error)
    throw error
  }
}

export async function updateGuestHouseData(id: string, updatedGh: Partial<GuestHouse>): Promise<GuestHouse | null> {
  try {
    const response = await strapiAPI.updateGuestHouse(id, {
      title: updatedGh.title,
      location: updatedGh.location,
      rating: updatedGh.rating,
      price: updatedGh.price,
      description: updatedGh.description,
    })

    return {
      ...transformStrapiEntity<Omit<GuestHouse, "id">>(response.data),
      images: updatedGh.images || [], // Use provided images for now
    }
  } catch (error) {
    console.error("Failed to update guest house:", error)
    return null
  }
}

export async function deleteGuestHouseData(id: string): Promise<boolean> {
  try {
    await strapiAPI.deleteGuestHouse(id)
    return true
  } catch (error) {
    console.error("Failed to delete guest house:", error)
    return false
  }
}

// Car CRUD
export async function getCarsData(): Promise<Car[]> {
  try {
    const response = await strapiAPI.getCars()
    return response.data.map((entity) => ({
      ...transformStrapiEntity<Omit<Car, "id">>(entity),
      images: getImageUrls(entity.attributes.images),
    }))
  } catch (error) {
    console.error("Failed to fetch cars:", error)
    return []
  }
}

export async function getCarByIdData(id: string): Promise<Car | undefined> {
  try {
    const response = await strapiAPI.getCar(id)
    return {
      ...transformStrapiEntity<Omit<Car, "id">>(response.data),
      images: getImageUrls(response.data.attributes.images),
    }
  } catch (error) {
    console.error("Failed to fetch car:", error)
    return undefined
  }
}

export async function createCarData(newCar: Omit<Car, "id">): Promise<Car> {
  try {
    const response = await strapiAPI.createCar({
      title: newCar.title,
      seats: newCar.seats,
      transmission: newCar.transmission,
      price: newCar.price,
      description: newCar.description,
    })

    return {
      ...transformStrapiEntity<Omit<Car, "id">>(response.data),
      images: newCar.images, // Use provided images for now
    }
  } catch (error) {
    console.error("Failed to create car:", error)
    throw error
  }
}

export async function updateCarData(id: string, updatedCar: Partial<Car>): Promise<Car | null> {
  try {
    const response = await strapiAPI.updateCar(id, {
      title: updatedCar.title,
      seats: updatedCar.seats,
      transmission: updatedCar.transmission,
      price: updatedCar.price,
      description: updatedCar.description,
    })

    return {
      ...transformStrapiEntity<Omit<Car, "id">>(response.data),
      images: updatedCar.images || [], // Use provided images for now
    }
  } catch (error) {
    console.error("Failed to update car:", error)
    return null
  }
}

export async function deleteCarData(id: string): Promise<boolean> {
  try {
    await strapiAPI.deleteCar(id)
    return true
  } catch (error) {
    console.error("Failed to delete car:", error)
    return false
  }
}

// Booking Management
export async function getBookingsData(): Promise<Booking[]> {
  try {
    const response = await strapiAPI.getBookings()
    return response.data.map((entity) => ({
      ...transformStrapiEntity<Omit<Booking, "id">>(entity),
      createdAt: entity.attributes.createdAt || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Failed to fetch bookings:", error)
    return []
  }
}

export async function getBookingByIdData(id: string): Promise<Booking | undefined> {
  try {
    const response = await strapiAPI.getBooking(id)
    return {
      ...transformStrapiEntity<Omit<Booking, "id">>(response.data),
      createdAt: response.data.attributes.createdAt || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Failed to fetch booking:", error)
    return undefined
  }
}

export async function updateBookingStatusData(id: string, status: BookingStatus): Promise<Booking | null> {
  try {
    const response = await strapiAPI.updateBooking(id, { status })
    return {
      ...transformStrapiEntity<Omit<Booking, "id">>(response.data),
      createdAt: response.data.attributes.createdAt || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Failed to update booking status:", error)
    return null
  }
}

export async function createBookingData(newBooking: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
  try {
    const response = await strapiAPI.createBooking({
      ...newBooking,
      status: "pending", // Default status
    })

    return {
      ...transformStrapiEntity<Omit<Booking, "id">>(response.data),
      createdAt: response.data.attributes.createdAt || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Failed to create booking:", error)
    throw error
  }
}

// Dashboard Stats
export async function getDashboardStatsData(): Promise<{
  totalGuestHouses: number
  totalCars: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
}> {
  try {
    const [guestHouses, cars, bookings] = await Promise.all([getGuestHousesData(), getCarsData(), getBookingsData()])

    return {
      totalGuestHouses: guestHouses.length,
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    }
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return {
      totalGuestHouses: 0,
      totalCars: 0,
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
    }
  }
}
