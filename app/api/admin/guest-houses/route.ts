import { NextResponse } from "next/server"
import { strapiAPI } from "@/lib/strapi-api"

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    // Expecting: { guestHouseId?, title, location, rating, price, description, images?: [id,...] }
    const data: any = {
      guestHouseId: payload.guestHouseId || `gh-${Date.now()}`,
      title: payload.title,
      location: payload.location,
      rating: payload.rating,
      price: payload.price,
      description: payload.description,
    }
    if (Array.isArray(payload.images)) data.images = payload.images

    const res = await strapiAPI.createGuestHouse(data)
    return NextResponse.json({ ok: true, data: res?.data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create guest house" }, { status: 500 })
  }
}
