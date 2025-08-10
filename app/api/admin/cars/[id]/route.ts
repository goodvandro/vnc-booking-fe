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

function absUrl(path?: string | null) {
  if (!path) return ""
  return path.startsWith("http") ? path : `${getStrapiUrl()}${path}`
}

// Strapi returns description as array (e.g., dynamic zone) in your model.
// We'll normalize for the UI (string to show in textarea) on GET,
// and convert string back to array on PUT.
function toDescriptionText(description: unknown): string {
  if (Array.isArray(description)) {
    // join blocks as paragraphs when possible; if blocks have 'text' use it, else JSON stringify
    const parts = description.map((b: any) => {
      if (b == null) return ""
      if (typeof b === "string") return b
      if (typeof b?.text === "string") return b.text
      return typeof b === "object" ? JSON.stringify(b) : String(b)
    })
    return parts.filter(Boolean).join("\n\n")
  }
  if (typeof description === "string") return description
  return ""
}

function toDescriptionArray(input: unknown): any[] {
  if (Array.isArray(input)) return input
  if (typeof input === "string") {
    const trimmed = input.trim()
    if (!trimmed) return []
    // simplest mapping: one block containing text
    return [{ type: "paragraph", text: trimmed }]
  }
  // Default empty array to satisfy the Strapi validator
  return []
}

function normalizeNumbers(n: any): number | undefined {
  const v = typeof n === "string" ? n.trim() : n
  const num = Number(v)
  return Number.isFinite(num) ? num : undefined
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(
      `${getStrapiUrl()}/api/cars/${params.id}?populate[images][fields][0]=url&populate[images][fields][1]=name&populate[images][fields][2]=width&populate[images][fields][3]=height&populate[images][fields][4]=mime`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
        },
        cache: "no-store",
      },
    )
    const json = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        { error: `Strapi request failed: ${res.status} ${res.statusText}`, details: json },
        { status: res.status },
      )
    }
    const d = json?.data
    if (!d) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const a = d.attributes || {}

    const imagesData = a.images?.data
    const images = Array.isArray(imagesData)
      ? imagesData.map((img: any) => ({
          id: img.id,
          url: absUrl(img.attributes?.url),
          name: img.attributes?.name,
          width: img.attributes?.width,
          height: img.attributes?.height,
          mime: img.attributes?.mime,
        }))
      : []

    return NextResponse.json({
      id: a.carId || undefined,
      documentId: d.id,
      title: a.title ?? "",
      seats: a.seats ?? null,
      transmission: a.transmission ?? "",
      price: a.price ?? null,
      description: toDescriptionText(a.description),
      images,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch car" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await req.json()

    const data: any = {
      // optional external id
      carId: payload.carId || undefined,
      title: payload.title ?? "",
      seats: normalizeNumbers(payload.seats),
      transmission: payload.transmission ?? "",
      price: normalizeNumbers(payload.price),
      // Convert textarea string to array to satisfy your Strapi model
      description: toDescriptionArray(payload.description),
      // Media many: array of IDs
      images: Array.isArray(payload.images) ? payload.images : [],
    }

    const res = await fetch(`${getStrapiUrl()}/api/cars/${params.id}`, {
      method: "PUT",
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
    return NextResponse.json({ error: err?.message || "Failed to update car" }, { status: 500 })
  }
}
