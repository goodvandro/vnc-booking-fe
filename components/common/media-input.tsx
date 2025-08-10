"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, UploadCloud, Plus } from "lucide-react"

export type UploadedMedia = {
  id?: number
  url: string
  name?: string
  width?: number
  height?: number
  mime?: string
}

interface MediaInputProps {
  label?: string
  description?: string
  initialMedia?: UploadedMedia[]
  onChange?: (media: UploadedMedia[]) => void
  maxFiles?: number
}

export default function MediaInput({
  label = "Images",
  description,
  initialMedia = [],
  onChange,
  maxFiles = 10,
}: MediaInputProps) {
  const [items, setItems] = useState<UploadedMedia[]>(initialMedia)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [addUrl, setAddUrl] = useState("")

  const update = (next: UploadedMedia[]) => {
    setItems(next)
    onChange?.(next)
  }

  const uploadFiles = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((f) => formData.append("files", f))
    setProgress(10)
    setError(null)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    if (!res.ok) {
      const message = "Upload failed"
      try {
        const j = await res.json()
        const errorMessage = j?.error || message
        throw new Error(errorMessage)
      } catch {}
    }
    const { uploadedFiles } = (await res.json()) as { uploadedFiles: UploadedMedia[] }
    return uploadedFiles
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const remaining = Math.max(0, maxFiles - items.length)
    const toUpload = Array.from(files).slice(0, remaining)
    try {
      const uploaded = await uploadFiles(toUpload)
      setProgress(85)
      const next = [...items, ...(uploaded || [])]
      update(next)
      setProgress(100)
      setTimeout(() => setProgress(0), 600)
    } catch (e: any) {
      setError(e?.message || "Upload failed")
      setProgress(0)
    }
  }

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [items],
  )

  const onAddUrl = () => {
    if (!addUrl.trim()) return
    const next = [...items, { url: addUrl.trim(), name: addUrl.trim() }]
    update(next)
    setAddUrl("")
  }

  const removeAt = (index: number) => {
    const next = items.filter((_, i) => i !== index)
    update(next)
  }

  return (
    <div className="grid gap-3">
      <Label>{label}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      <div
        className={[
          "rounded-md border border-dashed p-6 transition-colors",
          isDragging ? "bg-muted/40 border-primary" : "bg-muted/20",
        ].join(" ")}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        role="button"
        aria-label="Upload images by dropping files here"
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <UploadCloud className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drag and drop images here, or click to select files</p>
          <Button type="button" variant="outline" className="mt-2 bg-transparent">
            Choose files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {progress > 0 && (
            <div className="w-full max-w-sm mt-3">
              <Progress value={progress} className="h-2" />
            </div>
          )}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      <div className="flex gap-2">
        <Input placeholder="https://example.com/image.jpg" value={addUrl} onChange={(e) => setAddUrl(e.target.value)} />
        <Button type="button" variant="outline" onClick={onAddUrl}>
          <Plus className="h-4 w-4 mr-1" /> Add URL
        </Button>
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((m, idx) => (
            <Card key={`${m.url}-${idx}`} className="relative overflow-hidden">
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute right-1 top-1 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/80 shadow hover:bg-background"
                aria-label={`Remove image ${idx + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative h-28 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.url || "/placeholder.svg?height=120&width=160&query=preview"}
                  alt={m.name || `Image ${idx + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement
                    t.src = "/placeholder.svg?height=120&width=160"
                  }}
                />
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-muted-foreground">{m.name || m.url}</p>
                {typeof m.id === "number" && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    Strapi ID #{m.id}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
