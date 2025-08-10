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

// Convert Strapi richtext blocks -> plain text (for textarea)
function toPlainTextFromRichText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return typeof blocks === "string" ? blocks : ""
  const lines: string[] = []
  for (const node of blocks as any[]) {
    if (!node || node.type !== "paragraph") continue
    const children = Array.isArray(node.children) ? node.children : []
    const text = children.map((ch: any) => (typeof ch?.text === "string" ? ch.text : "")).join("")
    lines.push(text)
  }
  return lines.join("\n")
}

// Convert textarea string -> Strapi richtext blocks
function toRichTextBlocksFromString(input: unknown): any[] {
  if (Array.isArray(input)) return input
  const str = typeof input === "string" ? input : ""
  // Split by newlines to paragraphs, preserve empty lines
  const paragraphs = str.split(/\r?\n/)
  return paragraphs.map((line) => ({
    type: "paragraph",
    children: [{ type: "text", text: line }],
  }))
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
        headers: { Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}` },
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
      description: toPlainTextFromRichText(a.description),
      descriptionBlocks: Array.isArray(a.description) ? a.description : [],
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
      carId: payload.carId || undefined,
      title: payload.title ?? "",
      seats: normalizeNumbers(payload.seats),
      transmission: payload.transmission ?? "",
      price: normalizeNumbers(payload.price),
      // Convert textarea string to Strapi richtext blocks
      description: toRichTextBlocksFromString(payload.description),
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
        { error: `Strapi request failed: ${res.status} ${res.statusText} ${JSON.stringify(json)}` },
        { status: res.status },
      )
    }

    return NextResponse.json({ ok: true, data: json.data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update car" }, { status: 500 })
  }
}
