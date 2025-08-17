"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Settings, Car } from "lucide-react"
import BookingRentalModal from "@/components/common/booking-rental-modal"
import ImageSlider from "@/components/common/image-slider"
import type { Car as CarType } from "@/lib/types"

interface CarRentalSectionProps {
  t: any
}

export default function CarRentalSection({ t }: CarRentalSectionProps) {
  const [cars, setCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars")
        if (!response.ok) {
          throw new Error("Failed to fetch cars")
        }
        const data = await response.json()
        setCars(data)
      } catch (error) {
        console.error("Error fetching cars:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const handleRentNow = (car: CarType) => {
    setSelectedCar(car)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <section id="car-rental" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t.carRentalSectionTitle}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.carRentalSectionSubtitle}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="car-rental" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t.carRentalSectionTitle}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t.carRentalSectionSubtitle}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {cars.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cars available</h3>
              <p className="text-muted-foreground">Check back later or contact us for availability.</p>
            </div>
          ) : (
            cars.map((car) => (
              <Card key={car.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  {car.images && car.images.length > 0 ? (
                    <ImageSlider images={car.images} alt={car.title} className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src="/placeholder.svg?height=200&width=300&text=Car"
                      alt={car.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{car.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {car.seats} {t.seats}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="h-4 w-4" />
                        <span>{car.transmission === "automatic" ? t.automatic : t.manual}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      ${car.pricePerDay}
                      {t.perDay}
                    </Badge>
                  </div>
                  <Button className="w-full" onClick={() => handleRentNow(car)}>
                    {t.rentNow}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {selectedCar && (
        <BookingRentalModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCar(null)
          }}
          item={selectedCar}
          type="car"
          t={t}
        />
      )}
    </section>
  )
}
