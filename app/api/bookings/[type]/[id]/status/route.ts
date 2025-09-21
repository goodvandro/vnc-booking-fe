// app/api/bookings/[type]/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { strapiAPI } from "@/lib/strapi-api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params;
    const { status } = await request.json();

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    let result;
    if (type === "guest-house") {
      result = await strapiAPI.updateGuestHouseBookingStatus(id, status);
    } else if (type === "car-rental") {
      result = await strapiAPI.updateCarRentalBookingStatus(id, status);
    } else {
      return NextResponse.json(
        { error: "Invalid booking type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}
