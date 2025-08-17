"use client";

import { MapPin, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ImageSlider from "@/components/common/image-slider";
import type { GuestHouseOutputDTO, SelectedItem } from "@/lib/types";
import { getGuestHouses } from "@/app/admin/actions";
import { useEffect, useState } from "react";

interface GuestHousesSectionProps {
  t: any; // Translation object
  handleBookNowClick: (itemData: SelectedItem["data"]) => void;
}

export default function GuestHousesSection({
  t,
  handleBookNowClick,
}: GuestHousesSectionProps) {
  const [guestHouses, setGuestHouses] = useState<GuestHouseOutputDTO[]>([]);

  useEffect(() => {
    getGuestHouses().then((guestHouses) => {
      setGuestHouses(guestHouses);
      console.log("guestHouses", JSON.stringify(guestHouses));
    });
  }, []);

  return (
    <section
      id="guest-houses"
      className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-muted"
    >
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
            const thumbs: string[] = [];

            Array.isArray(gh.images) && gh.images.length > 0
              ? thumbs.push(...gh.images.map((i) => i.url)) || thumbs
              : thumbs.push(
                  `/placeholder.svg?height=300&width=400&text=${gh.title}`
                );

            return (
              <Card key={gh.id} className="flex flex-col overflow-hidden">
                <ImageSlider images={thumbs} alt="Riverside Retreat" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg sm:text-xl">
                    {gh.title}
                  </CardTitle>
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
                        className={`w-4 h-4 ${
                          i < gh.rating ? "fill-yellow-500" : "fill-white"
                        }`}
                      />
                    ))}
                    <span className="text-muted-foreground ml-1">
                      ({gh.rating})
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold">
                    €{gh.price}
                    <span className="text-sm sm:text-base font-normal text-muted-foreground">
                      {t.perNight}
                    </span>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
