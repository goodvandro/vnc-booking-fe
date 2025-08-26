"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  t: any // Translation object
}

export default function HeroSection({ t }: HeroSectionProps) {
  // Fallback translations in case t is undefined
  const fallbackTranslations = {
    heroTitle: "Discover Your Perfect Stay & Ride",
    heroSubtitle: "Find cozy guest houses and reliable car rentals for your next adventure.",
    findGuestHouse: "Find Guest House",
    rentACar: "Rent a Car",
  }

  // Use fallback if t is undefined
  const translations = t || fallbackTranslations

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId.replace("#", ""))
    if (targetElement) {
      const headerOffset = 80 // Account for fixed header height
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="section-container relative w-full py-16 sm:py-24 md:py-32 lg:py-48 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <Image
        src="/placeholder-02.jpg?height=1080&width=1920"
        width={1920}
        height={1080}
        alt="Hero Background"
        className="absolute inset-0 object-cover w-full h-full opacity-30"
      />
      <div className="section-content relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-gray-200 leading-tight">
            {translations.heroTitle}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {translations.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/70 w-full sm:w-auto"
            >
              <Link href="#guest-houses" onClick={(e) => handleSmoothScroll(e, "#guest-houses")}>
                {translations.findGuestHouse}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-white hover:text-gray-900 bg-transparent w-full sm:w-auto"
            >
              <Link href="#car-rental" onClick={(e) => handleSmoothScroll(e, "#car-rental")}>
                {translations.rentACar}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
