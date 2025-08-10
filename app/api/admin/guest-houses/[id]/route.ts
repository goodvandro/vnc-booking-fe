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

function toDescriptionText(description: unknown): string {
  if (Array.isArray(description)) {
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
    return [{ type: "paragraph", text: trimmed }]
  }
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
      `${getStrapiUrl()}/api/guest-houses/${params.id}?populate[images][fields][0]=url&populate[images][fields][1]=name&populate[images][fields][2]=width&populate[images][fields][3]=height&populate[images][fields][4]=mime`,
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
      id: a.ghId || undefined,
      documentId: d.id,
      title: a.title ?? "",
      location: a.location ?? "",
      rating: normalizeNumbers(a.rating) ?? null,
      price: normalizeNumbers(a.price) ?? null,
      description: toDescriptionText(a.description),
      images,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch guest house" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await req.json()

    const data: any = {
      ghId: payload.ghId || undefined,
      title: payload.title ?? "",
      location: payload.location ?? "",
      rating: normalizeNumbers(payload.rating),
      price: normalizeNumbers(payload.price),
      description: toDescriptionArray(payload.description),
      images: Array.isArray(payload.images) ? payload.images : [],
    }

    const res = await fetch(`${getStrapiUrl()}/api/guest-houses/${params.id}`, {
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
    return NextResponse.json({ error: err?.message || "Failed to update guest house" }, { status: 500 })
  }
}
