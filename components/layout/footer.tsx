"use client"

import Link from "next/link"
import { Home, Facebook, Twitter, Instagram } from "lucide-react"
import WhatsAppButton from "@/components/common/whatsapp-button"

interface FooterProps {
  t: any // Translation object
}

export default function Footer({ t }: FooterProps) {
  const whatsappNumber = "+1234567890" // Replace with actual WhatsApp number

  return (
    <footer
      id="footer-contact"
      className="flex flex-col gap-6 py-8 w-full shrink-0 px-4 md:px-6 border-t bg-background"
    >
      {/* Main Footer Content */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 lg:flex-shrink-0">
          <Home className="h-6 w-6" />
          <span className="font-semibold text-lg">{t.siteTitle}</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-4 sm:gap-6 text-sm lg:ml-auto">
          <Link href="#guest-houses" className="hover:underline underline-offset-4">
            {t.guestHouses}
          </Link>
          <Link href="#car-rental" className="hover:underline underline-offset-4">
            {t.carRental}
          </Link>
          <Link href="#marketing-section" className="hover:underline underline-offset-4">
            {t.whyChooseUs}
          </Link>
          <Link href="#about-us" className="hover:underline underline-offset-4">
            {t.aboutUs}
          </Link>
          <Link href="#contact-form" className="hover:underline underline-offset-4">
            {t.contact}
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            {t.privacyPolicy}
          </Link>
        </nav>
      </div>

      {/* Contact Info and Social */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-start sm:items-center">
        {/* Contact Information */}
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span>{t.email}: info@v0booking.com</span>
          <span>{t.phone}: +1 (123) 456-7890</span>
          <span className="hidden sm:inline">{t.address}: 123 Booking Lane, Travel City, TC 12345</span>
        </div>

        {/* Social Media Links and WhatsApp */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Social Media */}
          <div className="flex gap-4">
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
          </div>

          {/* WhatsApp Button */}
          <WhatsAppButton
            phoneNumber={whatsappNumber}
            message={t.whatsappGeneralMessage}
            className="text-sm px-4 py-2"
            t={t}
          />
        </div>
      </div>

      {/* Copyright */}
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          &copy; {new Date().getFullYear()} {t.siteTitle}. {t.allRightsReserved}
        </p>
      </div>
    </footer>
  )
}
