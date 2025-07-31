"use client"

import Image from "next/image"

interface AboutUsSectionProps {
  t: any // Translation object
}

export default function AboutUsSection({ t }: AboutUsSectionProps) {
  return (
    <section id="about-us" className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32">
      <div className="section-content">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
          <div className="space-y-2 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-700">
              {t.aboutV0BookingTitle}
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
              {t.aboutV0BookingSubtitle}
            </p>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-3 items-start max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              {t.aboutV0BookingParagraph1}
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              {t.aboutV0BookingParagraph2}
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              {t.aboutV0BookingParagraph3}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-1 order-1 lg:order-2">
            <Image
              src="/placeholder.svg?height=200&width=200"
              width={200}
              height={200}
              alt="Happy Travelers"
              className="rounded-lg object-cover w-full h-32 sm:h-40 md:h-48"
            />
            <Image
              src="/placeholder.svg?height=200&width=200"
              width={200}
              height={200}
              alt="Diverse Destinations"
              className="rounded-lg object-cover w-full h-32 sm:h-40 md:h-48"
            />
            <Image
              src="/placeholder.svg?height=200&width=200"
              width={200}
              height={200}
              alt="Customer Support"
              className="rounded-lg object-cover w-full h-32 sm:h-40 md:h-48"
            />
            <Image
              src="/placeholder.svg?height=200&width=200"
              width={200}
              height={200}
              alt="Modern Cars"
              className="rounded-lg object-cover w-full h-32 sm:h-40 md:h-48"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
