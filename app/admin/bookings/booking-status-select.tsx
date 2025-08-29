"use client"

import { useState, useTransition } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { updateBookingStatus } from "../actions"
import type { BookingStatus } from "@/lib/types"

interface BookingStatusSelectProps {
  bookingId: string
  currentStatus: BookingStatus
}

const statusOptions = [
  {
    value: "pending" as BookingStatus,
    label: "Pending",
    variant: "secondary" as const,
  },
  {
    value: "confirmed" as BookingStatus,
    label: "Confirmed",
    variant: "default" as const,
  },
  {
    value: "cancelled" as BookingStatus,
    label: "Cancelled",
    variant: "destructive" as const,
  },
  {
    value: "completed" as BookingStatus,
    label: "Completed",
    variant: "outline" as const,
  },
]

export default function BookingStatusSelect({ bookingId, currentStatus }: BookingStatusSelectProps) {
  const [status, setStatus] = useState<BookingStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (newStatus: string) => {
    const newBookingStatus = newStatus as BookingStatus
    setStatus(newBookingStatus)

    startTransition(async () => {
      try {
        await updateBookingStatus(bookingId, newBookingStatus)
      } catch (error) {
        // Revert on error
        setStatus(currentStatus)
        console.error("Failed to update booking status:", error)
      }
    })
  }

  const currentStatusOption = statusOptions.find((option) => option.value === status)

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
      <SelectTrigger className="w-[130px]">
        <SelectValue>
          <Badge variant={currentStatusOption?.variant || "secondary"}>{currentStatusOption?.label || status}</Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <Badge variant={option.variant}>{option.label}</Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
