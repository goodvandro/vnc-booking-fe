import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_ADMIN_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create form data for Strapi
    const strapiFormData = new FormData()
    strapiFormData.append("files", file)

    // Upload to Strapi
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: strapiFormData,
    })

    if (!response.ok) {
      throw new Error(`Strapi upload failed: ${response.status}`)
    }

    const uploadedFiles = await response.json()

    if (uploadedFiles && uploadedFiles.length > 0) {
      const fileUrl = `${STRAPI_URL}${uploadedFiles[0].url}`
      return NextResponse.json({ url: fileUrl })
    } else {
      throw new Error("No files returned from Strapi")
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
