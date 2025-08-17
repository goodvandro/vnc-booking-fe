"use client";

import { getCars } from "@/app/admin/actions";
import ImageSlider from "@/components/common/image-slider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CarOutputDTO, SelectedItem } from "@/lib/types";
import { CalendarDays, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface CarRentalSectionProps {
  t: any; // Translation object
  handleRentNowClick: (itemData: SelectedItem["data"]) => void;
}

export default function CarRentalSection({
  t,
  handleRentNowClick,
}: CarRentalSectionProps) {
  const [cars, setCars] = useState<CarOutputDTO[]>([]);

  useEffect(() => {
    getCars().then((carRental) => {
      setCars(carRental);
    });
  }, []);

  return (
    <section
      id="car-rental"
      className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32"
    >
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
            const thumbs: string[] = [];

            Array.isArray(car.images) && car.images.length > 0
              ? thumbs.push(...car.images.map((i) => i.url)) || thumbs
              : thumbs.push(
                  `/placeholder.svg?height=300&width=400&text=${car.title}`
                );

            return (
              <Card key={car.id} className="flex flex-col overflow-hidden">
                <ImageSlider
                  images={thumbs}
                  alt="Toyota Camry"
                />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg sm:text-xl">
                    {car.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm flex-wrap">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>{car.seats} {t.seats}</span>
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
                    <span className="text-sm sm:text-base font-normal text-muted-foreground">
                      {t.perDay}
                    </span>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
