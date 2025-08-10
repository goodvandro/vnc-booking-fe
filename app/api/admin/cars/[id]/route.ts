import { NextResponse } from "next/server"
import { strapiAPI } from "@/lib/strapi-api"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

function mapImageFiles(media: any) {
  const base = STRAPI_URL.replace(/\/$/, "")
  const data = media?.data
  if (!data) return []
  const arr = Array.isArray(data) ? data : [data]
  return arr.map((img: any) => ({
    id: img.id,
    url: img.attributes?.url?.startsWith("http") ? img.attributes.url : `${base}${img.attributes?.url}`,
    name: img.attributes?.name,
    width: img.attributes?.width,
    height: img.attributes?.height,
    mime: img.attributes?.mime,
  }))
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const res = await strapiAPI.getCar(params.id)
    const d = res?.data
    if (!d) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const a = d.attributes || {}

    const images = mapImageFiles(a.images)

    return NextResponse.json({
      id: String(a.carId || d.id),
      documentId: Number(d.id),
      title: a.title,
      seats: a.seats,
      transmission: a.transmission,
      price: a.price,
      description: a.description,
      images, // [{id,url,...}]
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch car" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await req.json()
    // Expecting: { title, seats, transmission, price, description, images: [mediaId, ...] }
    const data: any = {
      title: payload.title,
      seats: payload.seats,
      transmission: payload.transmission,
      price: payload.price,
      description: payload.description,
    }
    if (Array.isArray(payload.images)) data.images = payload.images

    const res = await strapiAPI.updateCar(params.id, data)
    return NextResponse.json({ ok: true, data: res?.data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update car" }, { status: 500 })
  }
}
