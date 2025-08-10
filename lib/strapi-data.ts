import { strapiAPI } from "./strapi-api"
import type { GuestHouse, Car, BookingStatus, CarRentalBooking, GuestHouseBooking, AdminBooking } from "./types"

// Helper function to transform Strapi entity to our types
function transformStrapiEntity<T>(entity: any): T & { id: string } {
  return {
    id: entity.id.toString(),
    ...entity,
  }
}

// function transformStrapiEntities<T>(entities: any[]): (T & { id: string })[] {
//   return entities.map(transformStrapiEntity)
// }

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
      guestHouseId: newGh.guestHouseId || `gh-${Date.now()}`,
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
      guestHouseId: updatedGh.guestHouseId,
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
      // images: getImageUrls(entity.attributes.images),
    }))
  } catch (error) {
    console.error("Failed to fetch cars:", error)
    return []
  }
}

export async function getCarByIdData(id: string): Promise<Car | undefined> {
  try {
    const response = await strapiAPI.getCar(id)
    console.log("response", response)
    return {
      ...transformStrapiEntity<Omit<Car, "id">>(response.data),
      // images: getImageUrls(response.data.attributes.images),
    }
  } catch (error) {
    console.error("Failed to fetch car:", error)
    return undefined
  }
}

export async function createCarData(newCar: Omit<Car, "id">): Promise<Car> {
  try {
    const response = await strapiAPI.createCar({
      carId: newCar.carId || `car-${Date.now()}`,
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
      carId: updatedCar.carId,
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

// Car Rental Booking Management
export async function getCarRentalBookingsData(): Promise<CarRentalBooking[]> {
  try {
    const response = await strapiAPI.getCarRentalBookings()
    return response.data.map((entity) => ({
      ...transformStrapiEntity<Omit<CarRentalBooking, "id">>(entity),
      createdAt: entity.attributes.createdAt || new Date().toISOString(),
      car: entity.attributes.car?.data ? transformStrapiEntity(entity.attributes.car.data) : undefined,
    }))
  } catch (error) {
    console.error("Failed to fetch car rental bookings:", error)
    return []
  }
}

export async function getCarRentalBookingByIdData(id: string): Promise<CarRentalBooking | undefined> {
  try {
    const response = await strapiAPI.getCarRentalBooking(id)
    return {
      ...transformStrapiEntity<Omit<CarRentalBooking, "id">>(response.data),
      createdAt: response.data.attributes.createdAt || new Date().toISOString(),
      car: response.data.attributes.car?.data ? transformStrapiEntity(response.data.attributes.car.data) : undefined,
    }
  } catch (error) {
    console.error("Failed to fetch car rental booking:", error)
    return undefined
  }
}

// Guest House Booking Management
export async function getGuestHouseBookingsData(): Promise<GuestHouseBooking[]> {
  try {
    const response = await strapiAPI.getGuestHouseBookings()
    return response.data.map((entity) => ({
      ...transformStrapiEntity<Omit<GuestHouseBooking, "id">>(entity),
      createdAt: entity.attributes.createdAt || new Date().toISOString(),
      guest_house: entity.attributes.guest_house?.data
        ? transformStrapiEntity(entity.attributes.guest_house.data)
        : undefined,
    }))
  } catch (error) {
    console.error("Failed to fetch guest house bookings:", error)
    return []
  }
}

export async function getGuestHouseBookingByIdData(id: string): Promise<GuestHouseBooking | undefined> {
  try {
    const response = await strapiAPI.getGuestHouseBooking(id)
    return {
      ...transformStrapiEntity<Omit<GuestHouseBooking, "id">>(response.data),
      createdAt: response.data.attributes.createdAt || new Date().toISOString(),
      guest_house: response.data.attributes.guest_house?.data
        ? transformStrapiEntity(response.data.attributes.guest_house.data)
        : undefined,
    }
  } catch (error) {
    console.error("Failed to fetch guest house booking:", error)
    return undefined
  }
}

// Combined Booking Management (for backward compatibility)
export async function getBookingsData(): Promise<AdminBooking[]> {
  const [carRes, ghRes] = await Promise.all([strapiAPI.getCarRentalBookings(), strapiAPI.getGuestHouseBookings()])

  const cars: AdminBooking[] = (carRes.data || []).map((item) => {
    const a = item.attributes
    return {
      id: a.bookingId || String(item.id),
      documentId: item.id,
      type: "car",
      itemName: a.car?.data?.attributes?.title || "Car",
      firstName: a.firstName,
      lastName: a.lastName,
      email: a.email,
      phone: a.phone,
      startDate: a.startDate,
      endDate: a.endDate,
      totalPrice: a.totalPrice,
      status: (a.bookingStatus || "pending") as BookingStatus,
      createdAt: a.createdAt || new Date().toISOString(),
    }
  })

  const ghs: AdminBooking[] = (ghRes.data || []).map((item) => {
    const a = item.attributes
    return {
      id: a.bookingId || String(item.id),
      documentId: item.id,
      type: "guestHouse",
      itemName: a.guest_house?.data?.attributes?.title || "Guest House",
      firstName: a.firstName,
      lastName: a.lastName,
      email: a.email,
      phone: a.phone,
      startDate: a.checkIn,
      endDate: a.checkOut,
      totalPrice: a.totalPrice,
      status: (a.bookingStatus || "pending") as BookingStatus,
      createdAt: a.createdAt || new Date().toISOString(),
    }
  })

  const all = [...cars, ...ghs]
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return all
}

export async function getBookingByIdData(id: string): Promise<AdminBooking | null> {
  const list = await getBookingsData()
  return list.find((b) => b.id === id) || null
}

export async function updateBookingStatusData(id: string, status: BookingStatus): Promise<void> {
  const b = await getBookingByIdData(id)
  if (!b) throw new Error("Booking not found")

  if (b.type === "car") {
    await strapiAPI.updateCarRentalBookingStatus(b.documentId, status as any)
  } else {
    await strapiAPI.updateGuestHouseBookingStatus(b.documentId, status as any)
  }
}

// Optional: basic dashboard stats to avoid import errors elsewhere.
export async function getDashboardStatsData() {
  const list = await getBookingsData()
  const total = list.length
  const pending = list.filter((b) => b.status === "pending").length
  const confirmed = list.filter((b) => b.status === "confirmed").length
  const cancelled = list.filter((b) => b.status === "cancelled").length
  const completed = list.filter((b) => b.status === "completed").length
  return { total, pending, confirmed, cancelled, completed }
}

// Stubs to keep other imports working. Replace with full implementations if needed.
// export async function getGuestHousesData() {
//   return []
// }
// export async function getGuestHouseByIdData(_id: string) {
//   return null
// }
// export async function createGuestHouseData(_payload: any) {
//   return {}
// }
// export async function updateGuestHouseData(_id: string, _payload: any) {
//   return {}
// }
// export async function deleteGuestHouseData(_id: string) {
//   return {}
// }
// export async function getCarsData() {
//   return []
// }
// export async function getCarByIdData(_id: string) {
//   return null
// }
// export async function createCarData(_payload: any) {
//   return {}
// }
// export async function updateCarData(_id: string, _payload: any) {
//   return {}
// }
// export async function deleteCarData(_id: string) {
//   return {}
// }
