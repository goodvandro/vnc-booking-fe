"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react"

interface HeroSectionProps {
  t: any
}

export default function HeroSection({ t }: HeroSectionProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {t?.heroTitle || "Discover Your Perfect"}
            <span className="text-primary block">{t?.heroSubtitle || "Getaway"}</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t?.heroDescription ||
              "From cozy guest houses to reliable car rentals, we make your travel dreams come true with exceptional service and unbeatable prices."}
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t?.heroFeature1 || "Prime Locations"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t?.heroFeature2 || "Easy Booking"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t?.heroFeature3 || "24/7 Support"}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 h-auto" onClick={() => scrollToSection("guest-houses")}>
              {t?.heroCtaGuest || "Book Guest House"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 h-auto bg-white/80 backdrop-blur-sm"
              onClick={() => scrollToSection("car-rental")}
            >
              {t?.heroCtaCar || "Rent a Car"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">{t?.heroStat1 || "Happy Guests"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">{t?.heroStat2 || "Properties"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-gray-600">{t?.heroStat3 || "Vehicles"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">{t?.heroStat4 || "Support"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
