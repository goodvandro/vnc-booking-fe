const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_ADMIN_TOKEN

if (!STRAPI_TOKEN) {
  console.warn("STRAPI_ADMIN_TOKEN is not set. Some admin features may not work.")
}

const headers = {
  "Content-Type": "application/json",
  ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
}

// API response interfaces
interface StrapiResponse<T> {
  data: T
  meta?: any
}

interface StrapiEntity {
  id: number
  attributes: any
}

interface StrapiCollection<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

class StrapiAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${STRAPI_URL}/api${endpoint}`

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Strapi API Error: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Strapi API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      await this.request("/guest-houses?pagination[limit]=1")
      return {
        status: "connected",
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        status: "error",
        timestamp: new Date().toISOString(),
      }
    }
  }

  // Guest Houses
  async getGuestHouses(): Promise<StrapiCollection<StrapiEntity>> {
    return this.request("/guest-houses?populate=images")
  }

  async getGuestHouse(id: string): Promise<StrapiResponse<StrapiEntity>> {
    return this.request(`/guest-houses/${id}?populate=images`)
  }

  async createGuestHouse(data: any): Promise<StrapiResponse<StrapiEntity>> {
    return this.request("/guest-houses", {
      method: "POST",
      body: JSON.stringify({ data }),
    })
  }

  async updateGuestHouse(id: string, data: any): Promise<StrapiResponse<StrapiEntity>> {
    return this.request(`/guest-houses/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    })
  }

  async deleteGuestHouse(id: string): Promise<StrapiResponse<StrapiEntity>> {
    return this.request(`/guest-houses/${id}`, {
      method: "DELETE",
    })
  }

  // Cars
  async getCars(): Promise<StrapiCollection<StrapiEntity>> {
    return this.request("/cars?populate=images")
  }

  async getCar(id: string): Promise<StrapiResponse<StrapiEntity>> {
    return this.request(`/cars/${id}?populate=images`)
  }

  async createCar(data: any): Promise<StrapiResponse<StrapiEntity>> {
    return this.request("/cars", {
      method: "POST",
      body: JSON.stringify({ data }),
    })
  }

  async updateCar(id: string, data: any): Promise<StrapiResponse<StrapiEntity>> {
    return this.request(`/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    })
  }

  async deleteCar(id: string): Promise<StrapiResponse<StrapiEntity>> {
    return this.request(`/cars/${id}`, {
      method: "DELETE",
    })
  }

  // Bookings
  async getBookings(): Promise<StrapiCollection<StrapiEntity>> {
    return this.request("/bookings?sort=createdAt:desc")
  }

  async getBooking(id: string): Promise<StrapiResponse<StrapiEntity>> {
    return this.request(`/bookings/${id}`)
  }

  async createBooking(data: any): Promise<StrapiResponse<StrapiEntity>> {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify({ data }),
    })
  }

  async updateBooking(id: string, data: any): Promise<StrapiResponse<StrapiEntity>> {
    return this.request(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    })
  }

  async deleteBooking(id: string): Promise<StrapiResponse<StrapiEntity>> {
    return this.request(`/bookings/${id}`, {
      method: "DELETE",
    })
  }

  // File upload
  async uploadFile(file: File): Promise<any> {
    const formData = new FormData()
    formData.append("files", file)

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.statusText}`)
    }

    return await response.json()
  }
}

export const strapiAPI = new StrapiAPI()
