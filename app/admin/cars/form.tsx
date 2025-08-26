"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import MediaInput from "@/components/common/media-input"
import type { Car } from "@/lib/types"
import { createCar, updateCar } from "../actions"

interface CarFormProps {
  car?: Car
}

export default function CarForm({ car }: CarFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>(car?.images || [])

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      // Add images to form data
      formData.append("images", JSON.stringify(images))

      const result = car ? await updateCar(car.id.toString(), formData) : await createCar(formData)

      if (result.success) {
        router.push("/admin/cars")
      } else {
        setError(result.error || "An error occurred")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/cars">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{car ? "Edit Car" : "Add New Car"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Car Name *</Label>
                <Input id="name" name="name" defaultValue={car?.name} required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="make">Make *</Label>
                <Input id="make" name="make" defaultValue={car?.make} required disabled={isLoading} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input id="model" name="model" defaultValue={car?.model} required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="1990"
                  max="2030"
                  defaultValue={car?.year}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seats">Seats *</Label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  min="2"
                  max="8"
                  defaultValue={car?.seats}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="transmission">Transmission *</Label>
                <Select name="transmission" defaultValue={car?.transmission} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Select name="fuelType" defaultValue={car?.fuelType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pricePerDay">Price per Day ($) *</Label>
                <Input
                  id="pricePerDay"
                  name="pricePerDay"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={car?.pricePerDay}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" defaultValue={car?.location} required disabled={isLoading} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={car?.description}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>Images</Label>
              <MediaInput images={images} onImagesChange={setImages} maxImages={5} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="available" name="available" defaultChecked={car?.available !== false} disabled={isLoading} />
              <Label htmlFor="available">Available for rental</Label>
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {car ? "Updating..." : "Creating..."}
                  </>
                ) : car ? (
                  "Update Car"
                ) : (
                  "Create Car"
                )}
              </Button>
              <Link href="/admin/cars">
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
