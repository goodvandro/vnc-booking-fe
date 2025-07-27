"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ContactSectionProps {
  t: any // Translation object
}

export default function ContactSection({ t }: ContactSectionProps) {
  return (
    <section id="contact-form" className="w-full py-12 md:py-16 lg:py-24 xl:py-32">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-gray-700">
            {t.getInTouchTitle}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            {t.getInTouchSubtitle}
          </p>
          <div className="space-y-2 text-muted-foreground text-left max-w-md mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
            <p>
              <strong>{t.email}:</strong> info@v0booking.com
            </p>
            <p>
              <strong>{t.phone}:</strong> +1 (123) 456-7890
            </p>
            <p>
              <strong>{t.address}:</strong> 123 Booking Lane, Travel City, TC 12345
            </p>
          </div>
          <form className="space-y-4 max-w-md mx-auto text-left">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                {t.firstName}
              </Label>
              <Input id="name" type="text" placeholder={t.yourName} className="text-sm sm:text-base" />
            </div>
            <div>
              <Label htmlFor="email-contact" className="block text-sm font-medium text-foreground mb-1">
                {t.email}
              </Label>
              <Input id="email-contact" type="email" placeholder={t.yourEmail} className="text-sm sm:text-base" />
            </div>
            <div>
              <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                {t.message}
              </Label>
              <textarea
                id="message"
                rows={5}
                placeholder={t.yourMessage}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
            </div>
            <Button type="submit" className="w-full">
              {t.sendMessage}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
