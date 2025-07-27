"use client"

import { MapPin, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ImageSlider from "@/components/common/image-slider"
import type { SelectedItem } from "@/lib/types"

interface GuestHousesSectionProps {
  t: any // Translation object
  handleBookNowClick: (itemData: SelectedItem["data"]) => void
}

export default function GuestHousesSection({ t, handleBookNowClick }: GuestHousesSectionProps) {
  return (
    <section id="guest-houses" className="w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-700">
              {t.guestHousesSectionTitle}
            </h2>
            <p className="max-w-[900px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
              {t.guestHousesSectionSubtitle}
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card className="flex flex-col overflow-hidden">
            <ImageSlider
              images={[
                "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+1",
                "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+2",
                "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+3",
                "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+4",
              ]}
              alt="Riverside Retreat"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Riverside Retreat</CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>Kyoto, Japan</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4" />
                <span className="text-muted-foreground ml-1">(4.5)</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                $150<span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perNight}</span>
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full"
                onClick={() =>
                  handleBookNowClick({
                    images: [
                      "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+1",
                      "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+2",
                      "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+3",
                      "/placeholder.svg?height=300&width=400&text=Riverside+Retreat+4",
                    ],
                    title: "Riverside Retreat",
                    location: "Kyoto, Japan",
                    rating: 4.5,
                    price: 150,
                    description:
                      "A serene retreat nestled by the river, offering traditional Japanese aesthetics and modern comforts. Perfect for a peaceful getaway.",
                  })
                }
              >
                {t.bookNow}
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col overflow-hidden">
            <ImageSlider
              images={[
                "/placeholder.svg?height=300&width=400&text=Urban+Loft+1",
                "/placeholder.svg?height=300&width=400&text=Urban+Loft+2",
                "/placeholder.svg?height=300&width=400&text=Urban+Loft+3",
              ]}
              alt="Urban Loft"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Urban Loft</CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>New York, USA</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <span className="text-muted-foreground ml-1">(5.0)</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                $220<span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perNight}</span>
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full"
                onClick={() =>
                  handleBookNowClick({
                    images: [
                      "/placeholder.svg?height=300&width=400&text=Urban+Loft+1",
                      "/placeholder.svg?height=300&width=400&text=Urban+Loft+2",
                      "/placeholder.svg?height=300&width=400&text=Urban+Loft+3",
                    ],
                    title: "Urban Loft",
                    location: "New York, USA",
                    rating: 5.0,
                    price: 220,
                    description:
                      "A stylish and spacious loft in the heart of the city, offering breathtaking skyline views and easy access to all major attractions.",
                  })
                }
              >
                {t.bookNow}
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col overflow-hidden">
            <ImageSlider
              images={[
                "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+1",
                "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+2",
                "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+3",
                "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+4",
                "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+5",
              ]}
              alt="Beachfront Villa"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Beachfront Villa</CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>Bali, Indonesia</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4" />
                <span className="text-muted-foreground ml-1">(4.8)</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                $300<span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perNight}</span>
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full"
                onClick={() =>
                  handleBookNowClick({
                    images: [
                      "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+1",
                      "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+2",
                      "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+3",
                      "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+4",
                      "/placeholder.svg?height=300&width=400&text=Beachfront+Villa+5",
                    ],
                    title: "Beachfront Villa",
                    location: "Bali, Indonesia",
                    rating: 4.8,
                    price: 300,
                    description:
                      "Experience luxury by the sea in this stunning beachfront villa. Enjoy private access to the beach and breathtaking ocean views.",
                  })
                }
              >
                {t.bookNow}
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col overflow-hidden">
            <ImageSlider
              images={[
                "/placeholder.svg?height=300&width=400&text=Mountain+Cabin+1",
                "/placeholder.svg?height=300&width=400&text=Mountain+Cabin+2",
                "/placeholder.svg?height=300&width=400&text=Mountain+Cabin+3",
              ]}
              alt="Mountain Cabin"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Mountain Cabin</CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>Aspen, USA</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <span className="text-muted-foreground ml-1">(4.9)</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                $250<span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perNight}</span>
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full"
                onClick={() =>
                  handleBookNowClick({
                    images: [
                      "/placeholder.svg?height=300&width=400&text=Mountain+Cabin+1",
                      "/placeholder.svg?height=300&width=400&text=Mountain+Cabin+2",
                      "/placeholder.svg?height=300&width=400&text=Mountain+Cabin+3",
                    ],
                    title: "Mountain Cabin",
                    location: "Aspen, USA",
                    rating: 4.9,
                    price: 250,
                    description:
                      "A rustic yet luxurious cabin nestled in the mountains, offering stunning views and direct access to hiking and skiing trails.",
                  })
                }
              >
                {t.bookNow}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
