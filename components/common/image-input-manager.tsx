"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import Image from "next/image"

interface ImageInputManagerProps {
  initialImages?: string[]
  onChange: (images: string[]) => void
  label?: string
}

export default function ImageInputManager({ initialImages = [], onChange, label = "Images" }: ImageInputManagerProps) {
  const [images, setImages] = useState<string[]>(initialImages.length > 0 ? initialImages : [""])

  const addImageInput = () => {
    const newImages = [...images, ""]
    setImages(newImages)
    onChange(newImages)
  }

  const removeImageInput = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onChange(newImages)
  }

  const updateImage = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
    onChange(newImages)
  }

  return (
    <div className="grid gap-4">
      <Label>{label}</Label>
      {images.map((image, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder={`Image URL ${index + 1}`}
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
                className="flex-1"
              />
              {images.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeImageInput(index)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {/* Preview */}
            {image && (
              <div className="w-24 h-18 border rounded overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  width={96}
                  height={72}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addImageInput} className="w-fit bg-transparent">
        <Plus className="h-4 w-4 mr-2" />
        Add Another Image
      </Button>
      {/* Hidden inputs for form submission */}
      {images.map((image, index) => (
        <input key={index} type="hidden" name={`image-${index}`} value={image} />
      ))}
    </div>
  )
}
