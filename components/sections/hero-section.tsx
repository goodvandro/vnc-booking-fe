"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  t: any // Translation object
}

export default function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="section-container relative w-full py-16 sm:py-24 md:py-32 lg:py-48 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <Image
        src="/placeholder.svg?height=1080&width=1920"
        width={1920}
        height={1080}
        alt="Hero Background"
        className="absolute inset-0 object-cover w-full h-full opacity-30"
      />
      <div className="section-content relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-gray-200 leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              <Link href="#guest-houses">{t.findGuestHouse}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-white hover:text-gray-900 bg-transparent w-full sm:w-auto"
            >
              <Link href="#car-rental">{t.rentACar}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
