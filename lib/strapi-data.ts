import { strapiAPI } from "./strapi-api"
import type { GuestHouse, Car, Booking, BookingStatus, CarRentalBooking, GuestHouseBooking } from "./types"

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
export async function getBookingsData(): Promise<Booking[]> {
  try {
    const [carBookings, guestHouseBookings] = await Promise.all([
      getCarRentalBookingsData(),
      getGuestHouseBookingsData(),
    ])

    // Transform car bookings to legacy format
    const transformedCarBookings: Booking[] = carBookings.map((booking) => ({
      id: booking.id,
      type: "car" as const,
      itemId: booking.car?.id || "",
      itemName: booking.car?.title || "Unknown Car",
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      startDate: booking.startDate,
      endDate: booking.endDate,
      guestsOrSeats: undefined,
      pickupLocation: booking.driverLicense,
      specialRequests: "",
      totalPrice: booking.totalPrice,
      status: booking.bookingStatus,
      createdAt: booking.createdAt,
    }))

    // Transform guest house bookings to legacy format
    const transformedGuestHouseBookings: Booking[] = guestHouseBookings.map((booking) => ({
      id: booking.id,
      type: "guestHouse" as const,
      itemId: booking.guest_house?.id || "",
      itemName: booking.guest_house?.title || "Unknown Guest House",
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      startDate: booking.checkIn,
      endDate: booking.checkOut,
      guestsOrSeats: booking.guests,
      pickupLocation: undefined,
      specialRequests: booking.specialRequests || "",
      totalPrice: booking.totalPrice,
      status: booking.bookingStatus,
      createdAt: booking.createdAt,
    }))

    return [...transformedCarBookings, ...transformedGuestHouseBookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  } catch (error) {
    console.error("Failed to fetch bookings:", error)
    return []
  }
}

export async function getBookingByIdData(id: string): Promise<Booking | undefined> {
  try {
    // Try to find in car bookings first
    const carBooking = await getCarRentalBookingByIdData(id)
    if (carBooking) {
      return {
        id: carBooking.id,
        type: "car" as const,
        itemId: carBooking.car?.id || "",
        itemName: carBooking.car?.title || "Unknown Car",
        firstName: carBooking.firstName,
        lastName: carBooking.lastName,
        email: carBooking.email,
        phone: carBooking.phone,
        startDate: carBooking.startDate,
        endDate: carBooking.endDate,
        guestsOrSeats: undefined,
        pickupLocation: carBooking.driverLicense,
        specialRequests: "",
        totalPrice: carBooking.totalPrice,
        status: carBooking.bookingStatus,
        createdAt: carBooking.createdAt,
      }
    }

    // Try guest house bookings
    const guestHouseBooking = await getGuestHouseBookingByIdData(id)
    if (guestHouseBooking) {
      return {
        id: guestHouseBooking.id,
        type: "guestHouse" as const,
        itemId: guestHouseBooking.guest_house?.id || "",
        itemName: guestHouseBooking.guest_house?.title || "Unknown Guest House",
        firstName: guestHouseBooking.firstName,
        lastName: guestHouseBooking.lastName,
        email: guestHouseBooking.email,
        phone: guestHouseBooking.phone,
        startDate: guestHouseBooking.checkIn,
        endDate: guestHouseBooking.checkOut,
        guestsOrSeats: guestHouseBooking.guests,
        pickupLocation: undefined,
        specialRequests: guestHouseBooking.specialRequests || "",
        totalPrice: guestHouseBooking.totalPrice,
        status: guestHouseBooking.bookingStatus,
        createdAt: guestHouseBooking.createdAt,
      }
    }

    return undefined
  } catch (error) {
    console.error("Failed to fetch booking:", error)
    return undefined
  }
}

export async function updateBookingStatusData(id: string, status: BookingStatus): Promise<Booking | null> {
  try {
    // Try to update car booking first
    try {
      const response = await strapiAPI.updateCarRentalBooking(id, { bookingStatus: status })
      const carBooking = {
        ...transformStrapiEntity<Omit<CarRentalBooking, "id">>(response.data),
        createdAt: response.data.attributes.createdAt || new Date().toISOString(),
      }

      return {
        id: carBooking.id,
        type: "car" as const,
        itemId: "",
        itemName: "Car Rental",
        firstName: carBooking.firstName,
        lastName: carBooking.lastName,
        email: carBooking.email,
        phone: carBooking.phone,
        startDate: carBooking.startDate,
        endDate: carBooking.endDate,
        guestsOrSeats: undefined,
        pickupLocation: carBooking.driverLicense,
        specialRequests: "",
        totalPrice: carBooking.totalPrice,
        status: carBooking.bookingStatus,
        createdAt: carBooking.createdAt,
      }
    } catch (carError) {
      // Try guest house booking
      const response = await strapiAPI.updateGuestHouseBooking(id, { bookingStatus: status })
      const guestHouseBooking = {
        ...transformStrapiEntity<Omit<GuestHouseBooking, "id">>(response.data),
        createdAt: response.data.attributes.createdAt || new Date().toISOString(),
      }

      return {
        id: guestHouseBooking.id,
        type: "guestHouse" as const,
        itemId: "",
        itemName: "Guest House",
        firstName: guestHouseBooking.firstName,
        lastName: guestHouseBooking.lastName,
        email: guestHouseBooking.email,
        phone: guestHouseBooking.phone,
        startDate: guestHouseBooking.checkIn,
        endDate: guestHouseBooking.checkOut,
        guestsOrSeats: guestHouseBooking.guests,
        pickupLocation: undefined,
        specialRequests: guestHouseBooking.specialRequests || "",
        totalPrice: guestHouseBooking.totalPrice,
        status: guestHouseBooking.bookingStatus,
        createdAt: guestHouseBooking.createdAt,
      }
    }
  } catch (error) {
    console.error("Failed to update booking status:", error)
    return null
  }
}

export async function createBookingData(newBooking: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
  try {
    if (newBooking.type === "car") {
      const carBookingData = {
        bookingId: `car-${Date.now()}`,
        firstName: newBooking.firstName,
        lastName: newBooking.lastName,
        email: newBooking.email,
        phone: newBooking.phone,
        driverLicense: newBooking.pickupLocation,
        startDate: newBooking.startDate,
        endDate: newBooking.endDate,
        totalPrice: newBooking.totalPrice,
        bookingStatus: "pending" as BookingStatus,
        car: newBooking.itemId,
      }

      const response = await strapiAPI.createCarRentalBooking(carBookingData)
      const booking = transformStrapiEntity<Omit<CarRentalBooking, "id">>(response.data)

      return {
        id: booking.id,
        type: "car",
        itemId: newBooking.itemId,
        itemName: newBooking.itemName,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        startDate: booking.startDate,
        endDate: booking.endDate,
        guestsOrSeats: undefined,
        pickupLocation: booking.driverLicense,
        specialRequests: "",
        totalPrice: booking.totalPrice,
        status: booking.bookingStatus,
        createdAt: response.data.attributes.createdAt || new Date().toISOString(),
      }
    } else {
      const guestHouseBookingData = {
        bookingId: `gh-${Date.now()}`,
        firstName: newBooking.firstName,
        lastName: newBooking.lastName,
        email: newBooking.email,
        phone: newBooking.phone,
        guests: newBooking.guestsOrSeats || 1,
        specialRequests: newBooking.specialRequests,
        checkIn: newBooking.startDate,
        checkOut: newBooking.endDate,
        totalPrice: newBooking.totalPrice,
        bookingStatus: "pending" as BookingStatus,
        guest_house: newBooking.itemId,
      }

      const response = await strapiAPI.createGuestHouseBooking(guestHouseBookingData)
      const booking = transformStrapiEntity<Omit<GuestHouseBooking, "id">>(response.data)

      return {
        id: booking.id,
        type: "guestHouse",
        itemId: newBooking.itemId,
        itemName: newBooking.itemName,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        startDate: booking.checkIn,
        endDate: booking.checkOut,
        guestsOrSeats: booking.guests,
        pickupLocation: undefined,
        specialRequests: booking.specialRequests || "",
        totalPrice: booking.totalPrice,
        status: booking.bookingStatus,
        createdAt: response.data.attributes.createdAt || new Date().toISOString(),
      }
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
    const [guestHouses, cars, carBookings, guestHouseBookings] = await Promise.all([
      getGuestHousesData(),
      getCarsData(),
      getCarRentalBookingsData(),
      getGuestHouseBookingsData(),
    ])

    const totalBookings = carBookings.length + guestHouseBookings.length
    const pendingBookings = [...carBookings, ...guestHouseBookings].filter((b) => b.bookingStatus === "pending").length
    const confirmedBookings = [...carBookings, ...guestHouseBookings].filter(
      (b) => b.bookingStatus === "confirmed",
    ).length

    return {
      totalGuestHouses: guestHouses.length,
      totalCars: cars.length,
      totalBookings,
      pendingBookings,
      confirmedBookings,
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
