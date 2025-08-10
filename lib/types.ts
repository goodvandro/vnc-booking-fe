export interface SelectedItem {
  type: "guestHouse" | "car"
  data: {
    images: string[] // Changed from imageSrc to images array
    title: string
    location?: string
    rating?: number
    price: number
    description: string
    seats?: number
    transmission?: string
  }
}

export interface GuestHouse {
  id: string
  guestHouseId: string
  images: string[] // Changed from imageSrc to images array
  title: string
  location: string
  rating: number
  price: number
  description: string
}

export interface Car {
  id: string
  documentId?: string
  carId: string
  images: string[] // Changed from imageSrc to images array
  title: string
  seats: number
  transmission: string
  price: number
  description: string
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed"

export interface CarRentalBooking {
  id: string
  bookingId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  driverLicense?: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  totalPrice: number
  bookingStatus: BookingStatus
  createdAt: string // ISO string
  car?: Car
  user?: any
}

export interface GuestHouseBooking {
  id: string
  bookingId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  guests: number
  specialRequests?: string
  checkIn: string // YYYY-MM-DD
  checkOut: string // YYYY-MM-DD
  totalPrice: number
  bookingStatus: BookingStatus
  createdAt: string // ISO string
  guest_house?: GuestHouse
  user?: any
}

// Legacy booking interface for backward compatibility
export interface Booking {
  id: string
  type: "guestHouse" | "car"
  itemId: string
  itemName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD or returnDate
  guestsOrSeats?: number
  pickupLocation?: string
  specialRequests: string
  totalPrice: number
  status: BookingStatus
  createdAt: string // ISO string
}
