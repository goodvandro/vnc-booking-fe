"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateBookingStatusAction } from "../actions"
import type { BookingStatus } from "@/lib/types"

interface BookingStatusSelectProps {
  bookingId: string
  currentStatus: BookingStatus
}

export default function BookingStatusSelect({ bookingId, currentStatus }: BookingStatusSelectProps) {
  const handleStatusChange = async (newStatus: string) => {
    await updateBookingStatusAction(bookingId, newStatus as BookingStatus)
  }

  return (
    <Select defaultValue={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="confirmed">Confirmed</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  )
}
