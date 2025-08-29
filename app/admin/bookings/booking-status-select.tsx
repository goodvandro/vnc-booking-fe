"use client"

import { useState, useTransition } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { updateBookingStatus } from "../actions"
import { useToast } from "@/hooks/use-toast"

interface BookingStatusSelectProps {
  bookingId: string
  currentStatus: string
}

const statusOptions = [
  { value: "pending", label: "Pending", variant: "secondary" as const },
  { value: "confirmed", label: "Confirmed", variant: "default" as const },
  { value: "cancelled", label: "Cancelled", variant: "destructive" as const },
  { value: "completed", label: "Completed", variant: "outline" as const },
]

export function BookingStatusSelect({ bookingId, currentStatus }: BookingStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      try {
        const result = await updateBookingStatus(bookingId, newStatus)
        if (result.success) {
          setStatus(newStatus)
          toast({
            title: "Status Updated",
            description: `Booking status changed to ${newStatus}`,
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update status",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update booking status",
          variant: "destructive",
        })
      }
    })
  }

  const currentOption = statusOptions.find((option) => option.value === status)

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
      <SelectTrigger className="w-32">
        <SelectValue>
          <Badge variant={currentOption?.variant || "secondary"}>{currentOption?.label || status}</Badge>
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
