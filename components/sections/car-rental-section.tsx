"use client"

import { useState, useEffect } from "react"
import { Users, CalendarDays } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ImageSlider from "@/components/common/image-slider"
import type { SelectedItem, CarOutputDTO } from "@/lib/types"

interface CarRentalSectionProps {
  t: any // Translation object
  handleRentNowClick: (itemData: SelectedItem["data"]) => void
}

export default function CarRentalSection({ t, handleRentNowClick }: CarRentalSectionProps) {
  const [cars, setCars] = useState<CarOutputDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch("/api/cars")
        if (response.ok) {
          const carsData = await response.json()
          setCars(carsData)
        }
      } catch (error) {
        console.error("Failed to fetch cars:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
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
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          {cars.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No cars available at the moment.</p>
            </div>
          ) : (
            cars.map((car) => (
              <Card key={car.id} className="flex flex-col overflow-hidden">
                <ImageSlider
                  images={
                    car.images?.length > 0
                      ? car.images.map((img) => img.url)
                      : ["/placeholder.svg?height=300&width=400&text=" + encodeURIComponent(car.title)]
                  }
                  alt={car.title}
                />
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
                      <span>{car.transmission === "Manual" ? t.manual : t.automatic}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <p className="text-xl sm:text-2xl font-bold">
                    ${car.price}
                    <span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perDay}</span>
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleRentNowClick({
                        images:
                          car.images?.length > 0
                            ? car.images.map((img) => img.url)
                            : ["/placeholder.svg?height=300&width=400&text=" + encodeURIComponent(car.title)],
                        title: car.title,
                        seats: car.seats,
                        transmission: car.transmission,
                        price: car.price,
                        description: car.description || "No description available.",
                      })
                    }
                  >
                    {t.rentNow}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
