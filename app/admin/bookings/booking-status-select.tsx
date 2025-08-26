"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { updateBookingStatus } from "../actions"
import { Loader2 } from "lucide-react"

interface BookingStatusSelectProps {
  bookingId: string
  currentStatus: string
}

export default function BookingStatusSelect({ bookingId, currentStatus }: BookingStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpdate = async () => {
    if (status === currentStatus) return

    setIsLoading(true)
    setMessage("")

    try {
      const result = await updateBookingStatus(bookingId, status)

      if (result.success) {
        setMessage("Status updated successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage(result.error || "Failed to update status")
      }
    } catch (error) {
      setMessage("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleUpdate} disabled={isLoading || status === currentStatus} size="sm">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </div>

      {message && (
        <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</p>
      )}
    </div>
  )
}
