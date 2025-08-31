"use client"

import { MapPin, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ImageSlider from "@/components/common/image-slider"
import type { GuestHouseOutputDTO, SelectedGuestHouse } from "@/lib/types"
import { useEffect, useState } from "react"
import { getGuestHousesData } from "@/lib/strapi-data"

interface GuestHousesSectionProps {
  t: any // Translation object
  handleBookNowClick: (itemData: SelectedGuestHouse["data"]) => void
}

export default function GuestHousesSection({ t, handleBookNowClick }: GuestHousesSectionProps) {
  const [guestHouses, setGuestHouses] = useState<GuestHouseOutputDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGuestHousesData()
      .then((guestHouses) => {
        setGuestHouses(guestHouses)
      })
      .catch((error) => {
        console.error("Failed to fetch guest houses:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section id="guest-houses" className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-muted">
        <div className="section-content">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
            <div className="space-y-2 max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-700">
                {t.guestHousesSectionTitle}
              </h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                {t.guestHousesSectionSubtitle}
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (guestHouses.length === 0) {
    return (
      <section id="guest-houses" className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-muted">
        <div className="section-content">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
            <div className="space-y-2 max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-700">
                {t.guestHousesSectionTitle}
              </h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                {t.guestHousesSectionSubtitle}
              </p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No guest houses available at the moment. Please check back later.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="guest-houses" className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-muted">
      <div className="section-content">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
          <div className="space-y-2 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-700">
              {t.guestHousesSectionTitle}
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
              {t.guestHousesSectionSubtitle}
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {guestHouses.map((gh: GuestHouseOutputDTO) => {
            const images: string[] = []

            if (Array.isArray(gh.images) && gh.images.length > 0) {
              images.push(...gh.images.map((i) => i.url))
            } else {
              images.push(`/placeholder.svg?height=300&width=400&text=${encodeURIComponent(gh.title)}`)
            }

            return (
              <Card key={gh.id} className="flex flex-col overflow-hidden">
                <ImageSlider images={images} alt={gh.title} />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg sm:text-xl">{gh.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{gh.location}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(gh.rating) ? "fill-yellow-500" : "fill-gray-200"}`}
                      />
                    ))}
                    <span className="text-muted-foreground ml-1">({gh.rating})</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold">
                    €{gh.price}
                    <span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perNight}</span>
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleBookNowClick({
                        id: gh.id,
                        guestHouseId: gh.guestHouseId,
                        images,
                        title: gh.title,
                        location: gh.location,
                        rating: gh.rating,
                        price: gh.price,
                        description: gh.description,
                      })
                    }
                  >
                    {t.bookNow}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
