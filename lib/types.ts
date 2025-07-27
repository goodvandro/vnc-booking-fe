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
  images: string[] // Changed from imageSrc to images array
  title: string
  location: string
  rating: number
  price: number
  description: string
}

export interface Car {
  id: string
  images: string[] // Changed from imageSrc to images array
  title: string
  seats: number
  transmission: string
  price: number
  description: string
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed"

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
