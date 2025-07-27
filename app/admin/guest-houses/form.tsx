"use client"

import { useActionState, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImageInputManager from "@/components/common/image-input-manager"
import { createGuestHouse, updateGuestHouse } from "../actions"
import type { GuestHouse } from "@/lib/types"

interface GuestHouseFormProps {
  initialData?: GuestHouse
}

export default function GuestHouseForm({ initialData }: GuestHouseFormProps) {
  const isEditing = !!initialData
  const [images, setImages] = useState<string[]>(initialData?.images || [])

  const action = isEditing ? updateGuestHouse.bind(null, initialData.id) : createGuestHouse
  const [state, formAction, isPending] = useActionState(action, null)

  const handleFormSubmit = (formData: FormData) => {
    // Add images to form data
    images.forEach((image, index) => {
      if (image.trim()) {
        formData.append(`image-${index}`, image)
      }
    })
    formAction(formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Guest House" : "Add New Guest House"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update the details of this guest house." : "Fill in the details for a new guest house."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleFormSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={initialData?.title} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={initialData?.location} required />
          </div>
          <ImageInputManager initialImages={initialData?.images} onChange={setImages} label="Guest House Images" />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price per Night</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={initialData?.price} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                defaultValue={initialData?.rating}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={initialData?.description} required />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Guest House" : "Create Guest House"}
          </Button>
          {state && <p className="text-sm text-red-500">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
