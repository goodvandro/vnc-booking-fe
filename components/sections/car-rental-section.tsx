"use client"

import ImageSlider from "@/components/common/image-slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getCarsData } from "@/lib/strapi-data"
import type { CarOutputDTO, SelectedCar } from "@/lib/types"
import { CalendarDays, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface CarRentalSectionProps {
  t: any // Translation object
  handleRentNowClick: (itemData: SelectedCar["data"]) => void
}

export default function CarRentalSection({ t, handleRentNowClick }: CarRentalSectionProps) {
  const [cars, setCars] = useState<CarOutputDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCarsData()
      .then((carRental) => {
        setCars(carRental)
      })
      .catch((error) => {
        console.error("Failed to fetch cars:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section id="car-rental" className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32">
        <div className="section-content">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
            <div className="space-y-2 max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-700">
                {t.carRentalSectionTitle}
              </h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                {t.carRentalSectionSubtitle}
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

  if (cars.length === 0) {
    return (
      <section id="car-rental" className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32">
        <div className="section-content">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
            <div className="space-y-2 max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-700">
                {t.carRentalSectionTitle}
              </h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                {t.carRentalSectionSubtitle}
              </p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No cars available at the moment. Please check back later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="car-rental" className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32">
      <div className="section-content">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
          <div className="space-y-2 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-700">
              {t.carRentalSectionTitle}
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
              {t.carRentalSectionSubtitle}
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {cars.map((car: CarOutputDTO) => {
            const images: string[] = []

            if (Array.isArray(car.images) && car.images.length > 0) {
              images.push(...car.images.map((i) => i.url))
            } else {
              images.push(`/placeholder.svg?height=300&width=400&text=${encodeURIComponent(car.title)}`)
            }

            return (
              <Card key={car.id} className="flex flex-col overflow-hidden">
                <ImageSlider images={images} alt={car.title} />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg sm:text-xl">{car.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm flex-wrap">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>
                        {car.seats} {t.seats}
                      </span>
                    </div>
                    <span className="mx-1">•</span>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>{car.transmission}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <p className="text-xl sm:text-2xl font-bold">
                    €{car.price}
                    <span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perDay}</span>
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleRentNowClick({
                        id: car.id,
                        carId: car.carId,
                        images,
                        title: car.title,
                        seats: car.seats,
                        transmission: car.transmission,
                        price: car.price,
                        description: car.description,
                      })
                    }
                  >
                    {t.rentNow}
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
