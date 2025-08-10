"use client"

import { useActionState, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MediaInput, { type UploadedMedia } from "@/components/common/media-input"
import { createCar, updateCar } from "../actions"
import type { Car } from "@/lib/types"

interface CarFormProps {
  initialData?: Car
}

export default function CarForm({ initialData }: CarFormProps) {
  const isEditing = !!initialData
  const [media, setMedia] = useState<UploadedMedia[]>((initialData?.images || []).map((url) => ({ url })))

  const action = isEditing ? updateCar.bind(null, initialData.id) : createCar
  const [state, formAction, isPending] = useActionState(action as any, null)

  const handleFormSubmit = (formData: FormData) => {
    // Append uploaded image IDs; the MediaInput already renders hidden inputs imageId-*
    // so we don't need to append here manually unless customizing.
    formAction(formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Car" : "Add New Car"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update the details of this car." : "Fill in the details for a new car."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleFormSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={initialData?.title} required />
          </div>

          <MediaInput
            label="Car Images"
            description="Upload one or more images. You can also add by URL for preview only."
            initialMedia={media}
            onChange={setMedia}
            maxFiles={12}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="seats">Seats</Label>
              <Input
                id="seats"
                name="seats"
                type="number"
                step="1"
                min="1"
                defaultValue={initialData?.seats}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Input id="transmission" name="transmission" defaultValue={initialData?.transmission} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price per Day</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={initialData?.price} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={initialData?.description} required />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Car" : "Create Car"}
          </Button>
          {state && <p className={`text-sm ${state.success ? "text-green-600" : "text-red-500"}`}>{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
