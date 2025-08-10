const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

async function parseResponse(res: Response): Promise<any> {
  // Handle no content
  if (res.status === 204) return {}
  const contentType = res.headers.get("content-type") || ""
  const text = await res.text()

  // Strapi should return JSON; fall back gracefully if not
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text)
    } catch {
      // If Strapi returns a blank/HTML page while status=ok, avoid crashing JSON.parse
      return {}
    }
  }

  // Not JSON; return the raw text to avoid JSON parse errors
  return { raw: text }
}

async function strapiFetch<T>(
  path: string,
  options: { method?: HttpMethod; body?: any; headers?: HeadersInit } = {},
): Promise<T> {
  const url = `${STRAPI_URL}${path}`
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(STRAPI_ADMIN_TOKEN ? { Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}` } : {}),
    ...options.headers,
  }

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    let message = `Strapi request failed: ${res.status} ${res.statusText}`
    try {
      const errMaybeJson = await parseResponse(res)
      const errMsg =
        (errMaybeJson?.error && (errMaybeJson.error.message || errMaybeJson.error.name)) ||
        errMaybeJson?.message ||
        errMaybeJson?.raw
      if (errMsg) message = errMsg
    } catch {
      // ignore parse error
    }
    throw new Error(message)
  }

  return (await parseResponse(res)) as T
}

export const strapiAPI = {
  // Car Rental Bookings
  async getCarRentalBookings() {
    return strapiFetch<{
      data: Array<{
        id: number
        attributes: {
          bookingId?: string
          firstName: string
          lastName: string
          email: string
          phone: string
          driverLicense?: string
          startDate: string
          endDate: string
          totalPrice: number
          bookingStatus: "pending" | "confirmed" | "cancelled" | "completed"
          createdAt?: string
          car?: { data?: { id: number; attributes: { title?: string; carId?: string } } }
        }
      }>
    }>(
      `/api/car-rental-bookings?populate[car][fields][0]=title&populate[car][fields][1]=carId&sort=createdAt:desc&pagination[pageSize]=200`,
    )
  },

  async updateCarRentalBookingStatus(documentId: number, status: "pending" | "confirmed" | "cancelled" | "completed") {
    return strapiFetch(`/api/car-rental-bookings/${documentId}`, {
      method: "PUT",
      body: { data: { bookingStatus: status } },
    })
  },

  // Guest House Bookings
  async getGuestHouseBookings() {
    return strapiFetch<{
      data: Array<{
        id: number
        attributes: {
          bookingId?: string
          firstName: string
          lastName: string
          email: string
          phone: string
          guests?: number
          specialRequests?: string
          checkIn: string
          checkOut: string
          totalPrice: number
          bookingStatus: "pending" | "confirmed" | "cancelled" | "completed"
          createdAt?: string
          guest_house?: { data?: { id: number; attributes: { title?: string; guestHouseId?: string } } }
        }
      }>
    }>(
      `/api/guest-house-bookings?populate[guest_house][fields][0]=title&populate[guest_house][fields][1]=guestHouseId&sort=createdAt:desc&pagination[pageSize]=200`,
    )
  },

  async updateGuestHouseBookingStatus(documentId: number, status: "pending" | "confirmed" | "cancelled" | "completed") {
    return strapiFetch(`/api/guest-house-bookings/${documentId}`, {
      method: "PUT",
      body: { data: { bookingStatus: status } },
    })
  },
}
