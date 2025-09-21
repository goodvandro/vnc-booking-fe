"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FloatingWhatsAppProps {
  phoneNumber: string
  t?: any
}

export default function FloatingWhatsApp({ phoneNumber, t }: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show the floating button after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleWhatsAppClick = (messageType: string) => {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, "")
    let message = ""

    switch (messageType) {
      case "booking":
        message = t?.whatsappBookingMessage || "Hi! I would like to make a booking. Can you help me?"
        break
      case "support":
        message = t?.whatsappSupportMessage || "Hi! I need help with my booking. Can you assist me?"
        break
      case "info":
        message = t?.whatsappInfoMessage || "Hi! I would like more information about your services."
        break
      default:
        message = t?.whatsappGeneralMessage || "Hi! I have a question."
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="mb-4 w-80 shadow-lg animate-in slide-in-from-bottom-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
                {t?.whatsappTitle || "WhatsApp Support"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{t?.whatsappDescription || "How can we help you today?"}</p>
            <div className="space-y-2">
              <Button
                onClick={() => handleWhatsAppClick("booking")}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                {t?.whatsappBooking || "Make a Booking"}
              </Button>
              <Button
                onClick={() => handleWhatsAppClick("support")}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                {t?.whatsappSupport || "Get Support"}
              </Button>
              <Button
                onClick={() => handleWhatsAppClick("info")}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                {t?.whatsappInfo || "Get Information"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  )
}
