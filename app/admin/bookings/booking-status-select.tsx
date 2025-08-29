"use client"

import { useState, useTransition } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { updateBookingStatusAction } from "../actions"
import { useToast } from "@/hooks/use-toast"
import type { BookingStatus } from "@/lib/types"

interface BookingStatusSelectProps {
  bookingId: string
  currentStatus: BookingStatus
}

const statusVariants = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
  completed: "outline",
} as const

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
} as const

export function BookingStatusSelect({ bookingId, currentStatus }: BookingStatusSelectProps) {
  const [status, setStatus] = useState<BookingStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleStatusChange = (newStatus: BookingStatus) => {
    setStatus(newStatus)
    startTransition(async () => {
      try {
        await updateBookingStatusAction(bookingId, newStatus)
        toast({
          title: "Status Updated",
          description: `Booking status changed to ${statusLabels[newStatus]}`,
        })
      } catch (error) {
        setStatus(currentStatus) // Revert on error
        toast({
          title: "Error",
          description: "Failed to update booking status",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
      <SelectTrigger className="w-[130px]">
        <SelectValue>
          <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusLabels).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            <Badge variant={statusVariants[value as BookingStatus]}>{label}</Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
