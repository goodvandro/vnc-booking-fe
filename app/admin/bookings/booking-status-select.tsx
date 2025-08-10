"use client"

import * as React from "react"
import { updateBookingStatusAction } from "../actions"
import type { BookingStatus } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookingStatusSelect({
  bookingId,
  currentStatus,
}: {
  bookingId: string
  currentStatus: BookingStatus
}) {
  const [value, setValue] = React.useState<BookingStatus>(currentStatus)
  const [pending, startTransition] = React.useTransition()

  const onChange = (next: BookingStatus) => {
    setValue(next) // optimistic
    startTransition(async () => {
      try {
        await updateBookingStatusAction(bookingId, next)
      } catch (err) {
        // revert on failure
        setValue(currentStatus)
        console.error("Failed to update booking status", err)
      }
    })
  }

  return (
    <Select value={value} onValueChange={(v) => onChange(v as BookingStatus)} disabled={pending}>
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
