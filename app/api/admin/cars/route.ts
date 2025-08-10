import { NextResponse } from "next/server"
import { strapiAPI } from "@/lib/strapi-api"

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    // Expecting: { carId?, title, seats, transmission, price, description, images?: [id,...] }
    const data: any = {
      carId: payload.carId || `car-${Date.now()}`,
      title: payload.title,
      seats: payload.seats,
      transmission: payload.transmission,
      price: payload.price,
      description: payload.description,
    }
    if (Array.isArray(payload.images)) data.images = payload.images

    const res = await strapiAPI.createCar(data)
    return NextResponse.json({ ok: true, data: res?.data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create car" }, { status: 500 })
  }
}
