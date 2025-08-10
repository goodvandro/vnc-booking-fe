import { NextResponse } from "next/server"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN

export async function POST(req: Request) {
  try {
    const inForm = await req.formData()
    if (!inForm || [...inForm.keys()].length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const uploadUrl = `${STRAPI_URL.replace(/\/$/, "")}/api/upload`

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        ...(STRAPI_ADMIN_TOKEN ? { Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}` } : {}),
      },
      body: inForm,
    })

    const contentType = res.headers.get("content-type") || ""
    const raw = await res.text()

    if (!res.ok) {
      return NextResponse.json(
        { error: `Strapi upload failed: ${res.status} ${res.statusText}`, details: raw },
        { status: res.status },
      )
    }

    // Strapi returns an array of uploaded files
    const json = contentType.includes("application/json") ? JSON.parse(raw) : []
    const files =
      Array.isArray(json) &&
      json.map((f: any) => ({
        id: f.id,
        url: (f.url || "").startsWith("http") ? f.url : `${STRAPI_URL.replace(/\/$/, "")}${f.url}`,
        name: f.name,
        width: f.width,
        height: f.height,
        mime: f.mime,
      }))

    return NextResponse.json({ files: files || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 })
  }
}
