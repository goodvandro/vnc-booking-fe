import type { GuestHouse, Car, Booking, BookingStatus } from "./types"

// Mock Data - In a real application, this would come from a database
let guestHouses: GuestHouse[] = [
  {
    id: "gh1",
    images: [
      "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+1",
      "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+2",
      "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+3",
      "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+4",
    ],
    title: "Riverside Retreat",
    location: "Kyoto, Japan",
    rating: 4.5,
    price: 150,
    description:
      "A serene retreat nestled by the river, offering traditional Japanese aesthetics and modern comforts. Perfect for a peaceful getaway.",
  },
  {
    id: "gh2",
    images: [
      "/placeholder.svg?height=300&width=400&text=Urban+Loft+1",
      "/placeholder.svg?height=300&width=400&text=Urban+Loft+2",
      "/placeholder.svg?height=300&width=400&text=Urban+Loft+3",
    ],
    title: "Urban Loft",
    location: "New York, USA",
    rating: 5.0,
    price: 220,
    description:
      "A stylish and spacious loft in the heart of the city, offering breathtaking skyline views and easy access to all major attractions.",
  },
  {
    id: "gh3",
    images: [
      "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+1",
      "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+2",
      "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+3",
      "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+4",
      "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+5",
    ],
    title: "Beachfront Villa",
    location: "Bali, Indonesia",
    rating: 4.8,
    price: 300,
    description:
      "Experience luxury by the sea in this stunning beachfront villa. Enjoy private access to the beach and breathtaking ocean views.",
  },
  {
    id: "gh4",
    images: [
      "/placeholder.svg?height=300&width=400&text=Mountain+Cabin+1",
      "/placeholder.svg?height=300&width=400&text=Mountain+Cabin+2",
      "/placeholder.svg?height=300&width=400&text=Mountain+Cabin+3",
    ],
    title: "Mountain Cabin",
    location: "Aspen, USA",
    rating: 4.9,
    price: 250,
    description:
      "A rustic yet luxurious cabin nestled in the mountains, offering stunning views and direct access to hiking and skiing trails.",
  },
]

let cars: Car[] = [
  {
    id: "car1",
    images: [
      "/placeholder.svg?height=300&width=400&text=Toyota+Camry+Exterior",
      "/placeholder.svg?height=300&width=400&text=Toyota+Camry+Interior",
      "/placeholder.svg?height=300&width=400&text=Toyota+Camry+Dashboard",
    ],
    title: "Toyota Camry",
    seats: 5,
    transmission: "Automatic",
    price: 50,
    description:
      "A reliable and fuel-efficient sedan, perfect for city driving and long road trips. Enjoy a smooth and comfortable ride.",
  },
  {
    id: "car2",
    images: [
      "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Exterior",
      "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Interior",
      "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Cargo",
      "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Dashboard",
    ],
    title: "Honda CR-V",
    seats: 5,
    transmission: "Automatic",
    price: 65,
    description:
      "A versatile and spacious SUV, ideal for families and adventurers. Offers ample cargo space and a comfortable ride.",
  },
  {
    id: "car3",
    images: [
      "/placeholder.svg?height=300&width=400&text=Mercedes+C-Class+Exterior",
      "/placeholder.svg?height=300&width=400&text=Mercedes+C-Class+Interior",
      "/placeholder.svg?height=300&width=400&text=Mercedes+C-Class+Dashboard",
    ],
    title: "Mercedes-Benz C-Class",
    seats: 4,
    transmission: "Automatic",
    price: 120,
    description:
      "Drive in style and comfort with this luxurious sedan. Perfect for business trips or a sophisticated city experience.",
  },
  {
    id: "car4",
    images: [
      "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Exterior",
      "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Interior",
      "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Seating",
      "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Entertainment",
    ],
    title: "Chrysler Pacifica",
    seats: 7,
    transmission: "Automatic",
    price: 90,
    description:
      "The ultimate family minivan, offering ample space, comfort, and entertainment features for long journeys with kids.",
  },
]

const bookings: Booking[] = [
  {
    id: "b1",
    type: "guestHouse",
    itemId: "gh1",
    itemName: "Riverside Retreat",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "111-222-3333",
    startDate: "2025-08-01",
    endDate: "2025-08-05",
    guestsOrSeats: 2,
    specialRequests: "Quiet room preferred.",
    totalPrice: 600,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b2",
    type: "car",
    itemId: "car2",
    itemName: "Honda CR-V",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "444-555-6666",
    startDate: "2025-09-10",
    endDate: "2025-09-15",
    pickupLocation: "LAX Airport",
    specialRequests: "Child seat needed.",
    totalPrice: 325,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
]

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11)

// Guest House CRUD
export async function getGuestHousesData(): Promise<GuestHouse[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...guestHouses]), 100))
}

export async function getGuestHouseByIdData(id: string): Promise<GuestHouse | undefined> {
  return new Promise((resolve) => setTimeout(() => resolve(guestHouses.find((gh) => gh.id === id)), 100))
}

export async function createGuestHouseData(newGh: Omit<GuestHouse, "id">): Promise<GuestHouse> {
  return new Promise((resolve) => {
    const gh = { id: generateId(), ...newGh }
    guestHouses.push(gh)
    setTimeout(() => resolve(gh), 100)
  })
}

export async function updateGuestHouseData(id: string, updatedGh: Partial<GuestHouse>): Promise<GuestHouse | null> {
  return new Promise((resolve) => {
    const index = guestHouses.findIndex((gh) => gh.id === id)
    if (index > -1) {
      guestHouses[index] = { ...guestHouses[index], ...updatedGh }
      setTimeout(() => resolve(guestHouses[index]), 100)
    } else {
      setTimeout(() => resolve(null), 100)
    }
  })
}

export async function deleteGuestHouseData(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    const initialLength = guestHouses.length
    guestHouses = guestHouses.filter((gh) => gh.id !== id)
    setTimeout(() => resolve(guestHouses.length < initialLength), 100)
  })
}

// Car CRUD
export async function getCarsData(): Promise<Car[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...cars]), 100))
}

export async function getCarByIdData(id: string): Promise<Car | undefined> {
  return new Promise((resolve) => setTimeout(() => resolve(cars.find((car) => car.id === id)), 100))
}

export async function createCarData(newCar: Omit<Car, "id">): Promise<Car> {
  return new Promise((resolve) => {
    const car = { id: generateId(), ...newCar }
    cars.push(car)
    setTimeout(() => resolve(car), 100)
  })
}

export async function updateCarData(id: string, updatedCar: Partial<Car>): Promise<Car | null> {
  return new Promise((resolve) => {
    const index = cars.findIndex((car) => car.id === id)
    if (index > -1) {
      cars[index] = { ...cars[index], ...updatedCar }
      setTimeout(() => resolve(cars[index]), 100)
    } else {
      setTimeout(() => resolve(null), 100)
    }
  })
}

export async function deleteCarData(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    const initialLength = cars.length
    cars = cars.filter((car) => car.id !== id)
    setTimeout(() => resolve(cars.length < initialLength), 100)
  })
}

// Booking Management
export async function getBookingsData(): Promise<Booking[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...bookings]), 100))
}

export async function getBookingByIdData(id: string): Promise<Booking | undefined> {
  return new Promise((resolve) => setTimeout(() => resolve(bookings.find((b) => b.id === id)), 100))
}

export async function updateBookingStatusData(id: string, status: BookingStatus): Promise<Booking | null> {
  return new Promise((resolve) => {
    const index = bookings.findIndex((b) => b.id === id)
    if (index > -1) {
      bookings[index].status = status
      setTimeout(() => resolve(bookings[index]), 100)
    } else {
      setTimeout(() => resolve(null), 100)
    }
  })
}

export async function createBookingData(newBooking: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
  return new Promise((resolve) => {
    const booking = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: "pending" as BookingStatus, // Default status
      ...newBooking,
    }
    bookings.push(booking)
    setTimeout(() => resolve(booking), 100)
  })
}

// Dashboard Stats
export async function getDashboardStatsData(): Promise<{
  totalGuestHouses: number
  totalCars: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
}> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          totalGuestHouses: guestHouses.length,
          totalCars: cars.length,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b) => b.status === "pending").length,
          confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
        }),
      100,
    ),
  )
}
