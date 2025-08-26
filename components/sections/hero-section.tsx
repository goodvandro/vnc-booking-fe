"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star, Users, Car } from "lucide-react"

interface HeroSectionProps {
  t: any
}

export default function HeroSection({ t }: HeroSectionProps) {
  // Fallback translations in case t is undefined
  const fallbackTranslations = {
    heroTitle: "Discover Your Perfect Getaway",
    heroSubtitle: "Find cozy guest houses and reliable car rentals for your next adventure",
    exploreGuestHouses: "Explore Guest Houses",
    browseCars: "Browse Cars",
    featuredStats: {
      guestHouses: "Guest Houses",
      cars: "Cars Available",
      happyCustomers: "Happy Customers",
      locations: "Locations",
    },
  }

  // Use provided translations or fallback
  const translations = t || fallbackTranslations

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Hero Content */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {translations.heroTitle || fallbackTranslations.heroTitle}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {translations.heroSubtitle || fallbackTranslations.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => scrollToSection("guest-houses")}>
              <MapPin className="mr-2 h-5 w-5" />
              {translations.exploreGuestHouses || fallbackTranslations.exploreGuestHouses}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-transparent"
              onClick={() => scrollToSection("car-rental")}
            >
              <Car className="mr-2 h-5 w-5" />
              {translations.browseCars || fallbackTranslations.browseCars}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">
                  {translations.featuredStats?.guestHouses || fallbackTranslations.featuredStats.guestHouses}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">
                  {translations.featuredStats?.cars || fallbackTranslations.featuredStats.cars}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">
                  {translations.featuredStats?.happyCustomers || fallbackTranslations.featuredStats.happyCustomers}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">25+</div>
                <div className="text-sm text-muted-foreground">
                  {translations.featuredStats?.locations || fallbackTranslations.featuredStats.locations}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
