const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_ADMIN_TOKEN

interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface StrapiEntity {
  id: number
  attributes: Record<string, any>
  createdAt: string
  updatedAt: string
}

class StrapiAPI {
  private baseURL: string
  private token: string | undefined

  constructor() {
    this.baseURL = STRAPI_URL
    this.token = STRAPI_TOKEN
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<StrapiResponse<T>> {
    const url = `${this.baseURL}/api${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Strapi API request failed:", error)
      throw error
    }
  }

  // Guest Houses
  async getGuestHouses() {
    return this.request<StrapiEntity[]>("/guest-houses?populate=*")
  }

  async getGuestHouse(id: string) {
    return this.request<StrapiEntity>(`/guest-houses/${id}?populate=*`)
  }

  async createGuestHouse(data: any) {
    return this.request<StrapiEntity>("/guest-houses", {
      method: "POST",
      body: JSON.stringify({ data }),
    })
  }

  async updateGuestHouse(id: string, data: any) {
    return this.request<StrapiEntity>(`/guest-houses/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    })
  }

  async deleteGuestHouse(id: string) {
    return this.request<StrapiEntity>(`/guest-houses/${id}`, {
      method: "DELETE",
    })
  }

  // Cars
  async getCars() {
    return this.request<StrapiEntity[]>("/cars?populate=*")
  }

  async getCar(id: string) {
    return this.request<StrapiEntity>(`/cars/${id}?populate=*`)
  }

  async createCar(data: any) {
    return this.request<StrapiEntity>("/cars", {
      method: "POST",
      body: JSON.stringify({ data }),
    })
  }

  async updateCar(id: string, data: any) {
    return this.request<StrapiEntity>(`/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    })
  }

  async deleteCar(id: string) {
    return this.request<StrapiEntity>(`/cars/${id}`, {
      method: "DELETE",
    })
  }

  // Bookings
  async getBookings() {
    return this.request<StrapiEntity[]>("/bookings?populate=*")
  }

  async getBooking(id: string) {
    return this.request<StrapiEntity>(`/bookings/${id}?populate=*`)
  }

  async createBooking(data: any) {
    return this.request<StrapiEntity>("/bookings", {
      method: "POST",
      body: JSON.stringify({ data }),
    })
  }

  async updateBooking(id: string, data: any) {
    return this.request<StrapiEntity>(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    })
  }

  async deleteBooking(id: string) {
    return this.request<StrapiEntity>(`/bookings/${id}`, {
      method: "DELETE",
    })
  }

  // Upload files
  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append("files", file)

    const headers: HeadersInit = {}
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseURL}/api/upload`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }
}

export const strapiAPI = new StrapiAPI()
