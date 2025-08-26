"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import MediaInput from "@/components/common/media-input"
import type { GuestHouse } from "@/lib/types"
import { createGuestHouse, updateGuestHouse } from "../actions"

interface GuestHouseFormProps {
  guestHouse?: GuestHouse
}

export default function GuestHouseForm({ guestHouse }: GuestHouseFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>(guestHouse?.images || [])
  const [amenities, setAmenities] = useState<string[]>(guestHouse?.amenities || [])

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      // Add images and amenities to form data
      formData.append("images", JSON.stringify(images))
      formData.append("amenities", JSON.stringify(amenities))

      const result = guestHouse
        ? await updateGuestHouse(guestHouse.id.toString(), formData)
        : await createGuestHouse(formData)

      if (result.success) {
        router.push("/admin/guest-houses")
      } else {
        setError(result.error || "An error occurred")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity])
    } else {
      setAmenities(amenities.filter((a) => a !== amenity))
    }
  }

  const commonAmenities = [
    "WiFi",
    "Kitchen",
    "Parking",
    "Pool",
    "Air Conditioning",
    "Heating",
    "TV",
    "Washing Machine",
    "Balcony",
    "Garden",
  ]

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/guest-houses">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guest Houses
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{guestHouse ? "Edit Guest House" : "Add New Guest House"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" defaultValue={guestHouse?.name} required disabled={isLoading} />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" defaultValue={guestHouse?.location} required disabled={isLoading} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricePerNight">Price per Night ($) *</Label>
                <Input
                  id="pricePerNight"
                  name="pricePerNight"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={guestHouse?.pricePerNight}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="maxGuests">Max Guests *</Label>
                <Input
                  id="maxGuests"
                  name="maxGuests"
                  type="number"
                  min="1"
                  max="20"
                  defaultValue={guestHouse?.maxGuests}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue={guestHouse?.bedrooms}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue={guestHouse?.bathrooms}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                defaultValue={guestHouse?.rating}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={guestHouse?.description}
                rows={4}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {commonAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={amenity}
                      checked={amenities.includes(amenity)}
                      onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                      className="rounded"
                      disabled={isLoading}
                    />
                    <Label htmlFor={amenity} className="text-sm">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Images</Label>
              <MediaInput images={images} onImagesChange={setImages} maxImages={10} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                name="available"
                defaultChecked={guestHouse?.available !== false}
                disabled={isLoading}
              />
              <Label htmlFor="available">Available for booking</Label>
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {guestHouse ? "Updating..." : "Creating..."}
                  </>
                ) : guestHouse ? (
                  "Update Guest House"
                ) : (
                  "Create Guest House"
                )}
              </Button>
              <Link href="/admin/guest-houses">
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
