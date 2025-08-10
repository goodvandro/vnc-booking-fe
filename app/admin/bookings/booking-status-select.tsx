"use client"

import { useTransition, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateBookingStatusAction } from "../actions"
import type { BookingStatus } from "@/lib/types"

const STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"]

export default function BookingStatusSelect(props: { bookingId: string; currentStatus: BookingStatus }) {
  const { bookingId, currentStatus } = props
  const [value, setValue] = useState<BookingStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        const nextStatus = next as BookingStatus
        setValue(nextStatus)
        startTransition(async () => {
          try {
            await updateBookingStatusAction(bookingId, nextStatus)
          } catch (e) {
            // revert on error
            setValue(currentStatus)
            console.error("Failed to update booking status:", e)
          }
        })
      }}
      disabled={isPending}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
