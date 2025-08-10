import { NextResponse } from "next/server"
import { strapiAPI } from "@/lib/strapi-api"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    // Forward directly to Strapi upload endpoint
    const uploaded = await strapiAPI.upload(formData)
    // Map Strapi files to our UploadedMedia shape
    const base = STRAPI_URL.replace(/\/$/, "")
    const files = (uploaded as any[]).map((f) => ({
      id: f.id,
      url: f.url?.startsWith("http") ? f.url : `${base}${f.url}`,
      name: f.name,
      width: f.width,
      height: f.height,
      mime: f.mime,
    }))
    return NextResponse.json({ files })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 })
  }
}
