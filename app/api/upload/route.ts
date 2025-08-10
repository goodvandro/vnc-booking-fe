import { NextResponse } from "next/server"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN

function getStrapiUrl() {
  const base = STRAPI_URL || "http://localhost:1337"
  return base.replace(/\/$/, "")
}

export async function POST(req: Request) {
  try {
    if (!STRAPI_ADMIN_TOKEN) {
      return NextResponse.json({ error: "Missing STRAPI_ADMIN_TOKEN" }, { status: 500 })
    }

    // Expecting multipart/form-data with "files" (one or multiple)
    const contentType = req.headers.get("content-type") || ""
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content-Type must be multipart/form-data" }, { status: 400 })
    }

    const incoming = await req.formData()
    const form = new FormData()
    // Forward all fields; Strapi expects "files" or "files[]"
    // We'll support both by appending exactly as provided
    for (const [key, value] of incoming.entries()) {
      form.append(key, value as any)
    }

    const res = await fetch(`${getStrapiUrl()}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
      },
      body: form,
      // do not set content-type manually, let fetch set boundary
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        { error: `Strapi upload failed: ${res.status} ${res.statusText}`, details: data },
        { status: res.status },
      )
    }

    // Normalize response to { files: [{ id, url, ...}] }
    const arr = Array.isArray(data) ? data : [data]
    const files = arr.map((f: any) => ({
      id: f.id,
      url: typeof f.url === "string" ? (f.url.startsWith("http") ? f.url : `${getStrapiUrl()}${f.url}`) : "",
      name: f.name,
      size: f.size,
      width: f.width,
      height: f.height,
      mime: f.mime,
      hash: f.hash,
      ext: f.ext,
    }))

    return NextResponse.json({ files })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 })
  }
}
