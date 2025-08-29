import { NextResponse } from "next/server"

export async function GET() {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
    const response = await fetch(`${strapiUrl}/api/cars?pagination[limit]=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
      },
    })

    if (response.ok) {
      return NextResponse.json({ status: "connected" })
    } else {
      return NextResponse.json({ status: "disconnected" }, { status: 503 })
    }
  } catch (error) {
    return NextResponse.json({ status: "disconnected" }, { status: 503 })
  }
}
