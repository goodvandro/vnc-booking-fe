import { NextResponse } from "next/server"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_ADMIN_TOKEN

export async function POST(req: Request) {
  try {
    const inForm = await req.formData()
    const files = inForm.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const fd = new FormData()
    for (const file of files) {
      // Limit to images only (jpeg, png, webp, gif, svg)
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 })
      }
      fd.append("files", file)
    }

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: fd,
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `Strapi upload failed: ${res.status} ${text}` }, { status: 500 })
    }

    const data = (await res.json()) as any[]

    // Normalize URLs to absolute
    const mapUrl = (url: string) => (url.startsWith("http") ? url : `${STRAPI_URL}${url}`)

    const filesOut = data.map((f) => ({
      id: f.id,
      url: mapUrl(f.url),
      name: f.name,
      mime: f.mime,
      size: f.size,
      width: f.width,
      height: f.height,
      formats: f.formats,
    }))

    return NextResponse.json({ files: filesOut }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload error" }, { status: 500 })
  }
}
