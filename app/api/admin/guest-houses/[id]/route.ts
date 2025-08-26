import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { strapiAPI } from "@/lib/strapi-api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const guestHouse = await strapiAPI.getGuestHouseById(params.id)

    if (!guestHouse) {
      return NextResponse.json({ error: "Guest house not found" }, { status: 404 })
    }

    return NextResponse.json(guestHouse)
  } catch (error) {
    console.error("Error fetching guest house:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const result = await strapiAPI.updateGuestHouse(params.id, data)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating guest house:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await strapiAPI.deleteGuestHouse(params.id)

    if (result.success) {
      return NextResponse.json({ message: "Guest house deleted successfully" })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Error deleting guest house:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
