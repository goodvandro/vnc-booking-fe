import { NextResponse } from "next/server"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN

function getStrapiUrl() {
  const base = STRAPI_URL || "http://localhost:1337"
  return base.replace(/\/$/, "")
}

function authHeaders() {
  if (!STRAPI_ADMIN_TOKEN) throw new Error("Missing STRAPI_ADMIN_TOKEN")
  return {
    Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
    "Content-Type": "application/json",
  }
}

function toDescriptionArray(input: unknown): any[] {
  if (Array.isArray(input)) return input
  if (typeof input === "string") {
    const trimmed = input.trim()
    if (!trimmed) return []
    return [{ type: "paragraph", text: trimmed }]
  }
  return []
}

function normalizeNumbers(n: any): number | undefined {
  const v = typeof n === "string" ? n.trim() : n
  const num = Number(v)
  return Number.isFinite(num) ? num : undefined
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const data: any = {
      carId: payload.carId || `car-${Date.now()}`,
      title: payload.title ?? "",
      seats: normalizeNumbers(payload.seats),
      transmission: payload.transmission ?? "",
      price: normalizeNumbers(payload.price),
      description: toDescriptionArray(payload.description),
      images: Array.isArray(payload.images) ? payload.images : [],
    }

    const res = await fetch(`${getStrapiUrl()}/api/cars`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ data }),
    })
    const json = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Strapi request failed: ${res.status} ${res.statusText} ${JSON.stringify(json)}`,
        },
        { status: res.status },
      )
    }

    return NextResponse.json({ ok: true, data: json.data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create car" }, { status: 500 })
  }
}
