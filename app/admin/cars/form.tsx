"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MediaInput, { type UploadedMedia } from "@/components/common/media-input"
import type { Car } from "@/lib/types"
import { useRouter } from "next/navigation"

interface CarFormProps {
  initialData?: Car
}

export default function CarForm({ initialData }: CarFormProps) {
  const isEditing = !!initialData
  const router = useRouter()
  const [media, setMedia] = useState<UploadedMedia[]>((initialData?.images || []).map((url) => ({ url })))
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Hydrate existing media and description for editing
  useEffect(() => {
    const documentId = (initialData as any)?.documentId
    if (!isEditing || !documentId) return

    let active = true
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/cars/${documentId}`, { method: "GET", cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!active) return
        const next: UploadedMedia[] = Array.isArray(data.images) ? data.images : []
        setMedia(next.length ? next : media)
        const descEl = document.getElementById("description") as HTMLTextAreaElement | null
        if (descEl && typeof data.description === "string" && !descEl.value) {
          descEl.value = data.description
        }
      } catch {}
    })()
    return () => {
      active = false
    }
  }, [isEditing, initialData])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const form = e.currentTarget
    const payload = {
      carId: (initialData as any)?.carId,
      title: (form.elements.namedItem("title") as HTMLInputElement)?.value,
      seats: Number((form.elements.namedItem("seats") as HTMLInputElement)?.value),
      transmission: (form.elements.namedItem("transmission") as HTMLInputElement)?.value,
      price: Number((form.elements.namedItem("price") as HTMLInputElement)?.value),
      description: (form.elements.namedItem("description") as HTMLTextAreaElement)?.value,
      images: media.filter((m) => typeof m.id === "number").map((m) => m.id) as number[],
    }

    try {
      const documentId = (initialData as any)?.documentId
      const res = await fetch(documentId ? `/api/admin/cars/${documentId}` : `/api/admin/cars`, {
        method: documentId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || "Save failed")
      setMessage("Saved successfully.")
      setTimeout(() => {
        router.push("/admin/cars")
      }, 600)
    } catch (err: any) {
      setMessage(err?.message || "Save failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Car" : "Add New Car"}</CardTitle>
        <CardDescription>We convert the description to Strapi Rich Text Blocks automatically.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={initialData?.title} required />
          </div>

          <MediaInput
            label="Car Images"
            description="Upload images. These are saved in Strapi and linked by media IDs."
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
            <Textarea
              id="description"
              name="description"
              placeholder={"One paragraph per line.\nUse blank lines for empty paragraphs."}
              defaultValue={(initialData as any)?.description}
            />
            <p className="text-xs text-muted-foreground">Each line becomes a paragraph in Strapi Rich Text.</p>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Car" : "Create Car"}
          </Button>
          {message && (
            <p className={`text-sm ${/successfully/i.test(message) ? "text-green-600" : "text-red-500"}`}>{message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
