"use server"

import { strapiAPI } from "@/lib/strapi-api"

type ActionResult = { success: boolean; message: string }

function getImageIdsFromForm(formData: FormData): number[] {
  const ids: number[] = []
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("imageId-")) {
      const n = Number(value)
      if (!Number.isNaN(n)) ids.push(n)
    }
  }
  return ids
}

// Cars
export async function createCar(formData: FormData): Promise<ActionResult> {
  try {
    const title = String(formData.get("title") || "").trim()
    const seats = Number(formData.get("seats") || 0)
    const transmission = String(formData.get("transmission") || "").trim()
    const price = Number(formData.get("price") || 0)
    const description = String(formData.get("description") || "").trim()
    const images = getImageIdsFromForm(formData)

    if (!title || !seats || !transmission || !price || !description) {
      return { success: false, message: "Please fill out all required fields." }
    }

    await strapiAPI.createCar({
      carId: `car-${Date.now()}`,
      title,
      seats,
      transmission,
      price,
      description,
      ...(images.length > 0 ? { images } : {}),
    })

    return { success: true, message: "Car created successfully." }
  } catch (e: any) {
    return { success: false, message: e?.message || "Failed to create car." }
  }
}

export async function updateCar(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const title = String(formData.get("title") || "").trim()
    const seats = Number(formData.get("seats") || 0)
    const transmission = String(formData.get("transmission") || "").trim()
    const price = Number(formData.get("price") || 0)
    const description = String(formData.get("description") || "").trim()
    const images = getImageIdsFromForm(formData)

    if (!title || !seats || !transmission || !price || !description) {
      return { success: false, message: "Please fill out all required fields." }
    }

    const payload: any = {
      title,
      seats,
      transmission,
      price,
      description,
    }
    if (images.length > 0) payload.images = images

    await strapiAPI.updateCar(id, payload)

    return { success: true, message: "Car updated successfully." }
  } catch (e: any) {
    return { success: false, message: e?.message || "Failed to update car." }
  }
}

// Guest Houses
export async function createGuestHouse(formData: FormData): Promise<ActionResult> {
  try {
    const title = String(formData.get("title") || "").trim()
    const location = String(formData.get("location") || "").trim()
    const rating = Number(formData.get("rating") || 0)
    const price = Number(formData.get("price") || 0)
    const description = String(formData.get("description") || "").trim()
    const images = getImageIdsFromForm(formData)

    if (!title || !location || !rating || !price || !description) {
      return { success: false, message: "Please fill out all required fields." }
    }

    await strapiAPI.createGuestHouse({
      guestHouseId: `gh-${Date.now()}`,
      title,
      location,
      rating,
      price,
      description,
      ...(images.length > 0 ? { images } : {}),
    })

    return { success: true, message: "Guest house created successfully." }
  } catch (e: any) {
    return { success: false, message: e?.message || "Failed to create guest house." }
  }
}

export async function updateGuestHouse(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const title = String(formData.get("title") || "").trim()
    const location = String(formData.get("location") || "").trim()
    const rating = Number(formData.get("rating") || 0)
    const price = Number(formData.get("price") || 0)
    const description = String(formData.get("description") || "").trim()
    const images = getImageIdsFromForm(formData)

    if (!title || !location || !rating || !price || !description) {
      return { success: false, message: "Please fill out all required fields." }
    }

    const payload: any = {
      title,
      location,
      rating,
      price,
      description,
    }
    if (images.length > 0) payload.images = images

    await strapiAPI.updateGuestHouse(id, payload)

    return { success: true, message: "Guest house updated successfully." }
  } catch (e: any) {
    return { success: false, message: e?.message || "Failed to update guest house." }
  }
}
