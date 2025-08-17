"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MarketingSectionProps {
  t: any; // Translation object
}

export default function MarketingSection({ t }: MarketingSectionProps) {
  return (
    <section
      id="marketing-section"
      className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-gray-100 dark:bg-gray-800"
    >
      <div className="section-content">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
          <div className="space-y-2 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-700">
              {t.whyChooseV0Booking}
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
              {t.whyChooseV0BookingSubtitle}
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card className="flex flex-col items-center text-center p-4 sm:p-6">
            <Image
              src="/users/user-03.jpg?height=150&width=150"
              width={150}
              height={150}
              alt="Easy Booking"
              className="mb-4 rounded-full object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
            />
            <CardTitle className="text-lg sm:text-xl font-bold mb-2">
              {t.effortlessBookingTitle}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base leading-relaxed">
              {t.effortlessBookingDescription}
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center text-center p-4 sm:p-6">
            <Image
              src="/gh/gh-01.jpg?height=150&width=150"
              width={150}
              height={150}
              alt="Diverse Options"
              className="mb-4 rounded-full object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
            />
            <CardTitle className="text-lg sm:text-xl font-bold mb-2">
              {t.diverseSelectionTitle}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base leading-relaxed">
              {t.diverseSelectionDescription}
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <Image
              src="/users/user-04.jpg?height=150&width=150"
              width={150}
              height={150}
              alt="24/7 Support"
              className="mb-4 rounded-full object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
            />
            <CardTitle className="text-lg sm:text-xl font-bold mb-2">
              {t.supportTitle}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base leading-relaxed">
              {t.supportDescription}
            </CardDescription>
          </Card>
        </div>
        <div className="text-center mt-8 md:mt-12">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="#guest-houses">{t.startYourJourney}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
