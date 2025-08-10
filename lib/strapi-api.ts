const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const API_BASE = `${STRAPI_URL.replace(/\/$/, "")}/api`
const TOKEN = process.env.STRAPI_ADMIN_TOKEN

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

async function request(path: string, method: HttpMethod = "GET", body?: any, headers?: HeadersInit) {
  const url = `${API_BASE}${path}`
  const defaultHeaders: HeadersInit = {
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  }
  const init: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    },
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify({ data: body }) // Strapi v4 expects { data: ... }
      : undefined,
    cache: "no-store",
  }

  const res = await fetch(url, init)

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Strapi request failed: ${res.status} ${res.statusText} ${text}`)
  }

  const contentType = res.headers.get("content-type") || ""
  if (res.status === 204 || !contentType.includes("application/json")) {
    return { data: null }
  }
  try {
    return await res.json()
  } catch {
    return { data: null }
  }
}

function qs(params: Record<string, string | number | boolean | undefined>) {
  const s = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&")
  return s ? `?${s}` : ""
}

export const strapiAPI = {
  // Cars
  async getCars() {
    return request(`/cars${qs({ populate: "images" })}`, "GET")
  },
  async getCar(id: string | number) {
    return request(`/cars/${id}${qs({ populate: "images" })}`, "GET")
  },
  async createCar(data: any) {
    return request(`/cars`, "POST", data)
  },
  async updateCar(id: string | number, data: any) {
    return request(`/cars/${id}`, "PUT", data)
  },
  async deleteCar(id: string | number) {
    return request(`/cars/${id}`, "DELETE")
  },

  // Guest Houses
  async getGuestHouses() {
    return request(`/guest-houses${qs({ populate: "images" })}`, "GET")
  },
  async getGuestHouse(id: string | number) {
    return request(`/guest-houses/${id}${qs({ populate: "images" })}`, "GET")
  },
  async createGuestHouse(data: any) {
    return request(`/guest-houses`, "POST", data)
  },
  async updateGuestHouse(id: string | number, data: any) {
    return request(`/guest-houses/${id}`, "PUT", data)
  },
  async deleteGuestHouse(id: string | number) {
    return request(`/guest-houses/${id}`, "DELETE")
  },

  // Bookings: Car Rental
  async getCarRentalBookings() {
    return request(`/car-rental-bookings${qs({ populate: "car" })}`, "GET")
  },
  async getCarRentalBooking(id: string | number) {
    return request(`/car-rental-bookings/${id}${qs({ populate: "car" })}`, "GET")
  },
  async createCarRentalBooking(data: any) {
    return request(`/car-rental-bookings`, "POST", data)
  },
  async updateCarRentalBooking(id: string | number, data: any) {
    return request(`/car-rental-bookings/${id}`, "PUT", data)
  },
  async updateCarRentalBookingStatus(id: string | number, status: string) {
    return request(`/car-rental-bookings/${id}`, "PUT", { bookingStatus: status })
  },

  // Bookings: Guest House
  async getGuestHouseBookings() {
    return request(`/guest-house-bookings${qs({ populate: "guest_house" })}`, "GET")
  },
  async getGuestHouseBooking(id: string | number) {
    return request(`/guest-house-bookings/${id}${qs({ populate: "guest_house" })}`, "GET")
  },
  async createGuestHouseBooking(data: any) {
    return request(`/guest-house-bookings`, "POST", data)
  },
  async updateGuestHouseBooking(id: string | number, data: any) {
    return request(`/guest-house-bookings/${id}`, "PUT", data)
  },
  async updateGuestHouseBookingStatus(id: string | number, status: string) {
    return request(`/guest-house-bookings/${id}`, "PUT", { bookingStatus: status })
  },

  // Upload (direct), used by /api/upload
  async upload(formData: FormData) {
    const url = `${API_BASE}/upload`
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: formData,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`Strapi upload failed: ${res.status} ${res.statusText} ${text}`)
    }

    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      return []
    }

    return res.json()
  },
}
export type StrapiAPI = typeof strapiAPI
