"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WhatsAppButtonProps {
  phoneNumber: string
  message?: string
  className?: string
  t?: any
}

export default function WhatsAppButton({ phoneNumber, message = "", className = "", t }: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    // Remove any non-numeric characters from phone number
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, "")

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
      size="lg"
    >
      <MessageCircle className="h-5 w-5 mr-2" />
      {t?.whatsappSupport || "WhatsApp Support"}
    </Button>
  )
}
