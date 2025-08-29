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
      return NextResponse.json({
        status: "connected",
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          status: "error",
          timestamp: new Date().toISOString(),
          error: "Connection failed",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
