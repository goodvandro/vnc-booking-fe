"use client"

import { Users, CalendarDays } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ImageSlider from "@/components/common/image-slider"
import type { SelectedItem } from "@/lib/types"

interface CarRentalSectionProps {
  t: any // Translation object
  handleRentNowClick: (itemData: SelectedItem["data"]) => void
}

export default function CarRentalSection({ t, handleRentNowClick }: CarRentalSectionProps) {
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
          {/* Car cards content remains the same, just wrapped in proper container */}
          <Card className="flex flex-col overflow-hidden">
            <ImageSlider
              images={[
                "/placeholder.svg?height=300&width=400&text=Toyota+Camry+Exterior",
                "/placeholder.svg?height=300&width=400&text=Toyota+Camry+Interior",
                "/placeholder.svg?height=300&width=400&text=Toyota+Camry+Dashboard",
              ]}
              alt="Toyota Camry"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Toyota Camry</CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm flex-wrap">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>5 {t.seats}</span>
                </div>
                <span className="mx-1">•</span>
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{t.automatic}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <p className="text-xl sm:text-2xl font-bold">
                $50<span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perDay}</span>
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full"
                onClick={() =>
                  handleRentNowClick({
                    images: [
                      "/placeholder.svg?height=300&width=400&text=Toyota+Camry+Exterior",
                      "/placeholder.svg?height=300&width=400&text=Toyota+Camry+Interior",
                      "/placeholder.svg?height=300&width=400&text=Toyota+Camry+Dashboard",
                    ],
                    title: "Toyota Camry",
                    seats: 5,
                    transmission: "Automatic",
                    price: 50,
                    description:
                      "A reliable and fuel-efficient sedan, perfect for city driving and long road trips. Enjoy a smooth and comfortable ride.",
                  })
                }
              >
                {t.rentNow}
              </Button>
            </CardFooter>
          </Card>
          {/* Add the other 3 car cards with the same structure */}
          <Card className="flex flex-col overflow-hidden">
            <ImageSlider
              images={[
                "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Exterior",
                "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Interior",
                "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Cargo",
                "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Dashboard",
              ]}
              alt="Honda CR-V"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Honda CR-V</CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm flex-wrap">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>5 {t.seats}</span>
                </div>
                <span className="mx-1">•</span>
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{t.automatic}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <p className="text-xl sm:text-2xl font-bold">
                $65<span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perDay}</span>
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full"
                onClick={() =>
                  handleRentNowClick({
                    images: [
                      "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Exterior",
                      "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Interior",
                      "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Cargo",
                      "/placeholder.svg?height=300&width=400&text=Honda+CR-V+Dashboard",
                    ],
                    title: "Honda CR-V",
                    seats: 5,
                    transmission: "Automatic",
                    price: 65,
                    description:
                      "A versatile and spacious SUV, ideal for families and adventurers. Offers ample cargo space and a comfortable ride.",
                  })
                }
              >
                {t.rentNow}
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col overflow-hidden">
            <ImageSlider
              images={[
                "/placeholder.svg?height=300&width=400&text=Mercedes+C-Class+Exterior",
                "/placeholder.svg?height=300&width=400&text=Mercedes+C-Class+Interior",
                "/placeholder.svg?height=300&width=400&text=Mercedes+C-Class+Dashboard",
              ]}
              alt="Mercedes-Benz C-Class"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Mercedes-Benz C-Class</CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm flex-wrap">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>4 {t.seats}</span>
                </div>
                <span className="mx-1">•</span>
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{t.automatic}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <p className="text-xl sm:text-2xl font-bold">
                $120<span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perDay}</span>
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full"
                onClick={() =>
                  handleRentNowClick({
                    images: [
                      "/placeholder.svg?height=300&width=400&text=Mercedes+C-Class+Exterior",
                      "/placeholder.svg?height=300&width=400&text=Mercedes+C-Class+Interior",
                      "/placeholder.svg?height=300&width=400&text=Mercedes+C-Class+Dashboard",
                    ],
                    title: "Mercedes-Benz C-Class",
                    seats: 4,
                    transmission: "Automatic",
                    price: 120,
                    description:
                      "Drive in style and comfort with this luxurious sedan. Perfect for business trips or a sophisticated city experience.",
                  })
                }
              >
                {t.rentNow}
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col overflow-hidden">
            <ImageSlider
              images={[
                "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Exterior",
                "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Interior",
                "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Seating",
                "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Entertainment",
              ]}
              alt="Chrysler Pacifica"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Chrysler Pacifica</CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm flex-wrap">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>7 {t.seats}</span>
                </div>
                <span className="mx-1">•</span>
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{t.automatic}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <p className="text-xl sm:text-2xl font-bold">
                $90<span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perDay}</span>
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full"
                onClick={() =>
                  handleRentNowClick({
                    images: [
                      "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Exterior",
                      "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Interior",
                      "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Seating",
                      "/placeholder.svg?height=300&width=400&text=Chrysler+Pacifica+Entertainment",
                    ],
                    title: "Chrysler Pacifica",
                    seats: 7,
                    transmission: "Automatic",
                    price: 90,
                    description:
                      "The ultimate family minivan, offering ample space, comfort, and entertainment features for long journeys with kids.",
                  })
                }
              >
                {t.rentNow}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
