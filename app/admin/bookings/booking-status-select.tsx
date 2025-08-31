"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  updateCarRentalBookingStatus,
  updateGuestHouseBookingStatus,
} from "@/lib/strapi-data";
import { BookingStatus } from "@/lib/types";
import { useState, useTransition } from "react";

interface BookingStatusSelectProps {
  bookingType: "car" | "guest_house";
  bookingId: string;
  currentStatus: BookingStatus;
}

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
];

export default function BookingStatusSelect({
  bookingType,
  bookingId,
  currentStatus,
}: BookingStatusSelectProps) {
  const [status, setStatus] = useState<BookingStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStatusChange = (newStatus: BookingStatus) => {
    startTransition(async () => {
      try {
        bookingType === "guest_house"
          ? await updateGuestHouseBookingStatus(bookingId, newStatus)
          : await updateCarRentalBookingStatus(bookingId, newStatus);

        setStatus(newStatus);
        toast({
          title: "Status Updated",
          description: `Booking status changed to ${newStatus}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update booking status",
          variant: "destructive",
        });
      }
    });
  };

  const currentStatusOption = statusOptions.find(
    (option) => option.value === status
  );

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue>
          <Badge className={currentStatusOption?.color}>
            {currentStatusOption?.label || status}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <Badge className={option.color}>{option.label}</Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
