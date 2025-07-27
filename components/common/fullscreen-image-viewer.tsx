"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FullscreenImageViewerProps {
  images: string[]
  alt: string
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export default function FullscreenImageViewer({
  images,
  alt,
  isOpen,
  onClose,
  initialIndex = 0,
}: FullscreenImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          goToPrevious()
          break
        case "ArrowRight":
          goToNext()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!isOpen || !images || images.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 h-10 w-10"
        onClick={onClose}
        aria-label="Close fullscreen"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          width={1200}
          height={800}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          priority
        />

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
          <div className="flex gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded border-2 overflow-hidden transition-all duration-200 ${
                  index === currentIndex ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  width={80}
                  height={64}
                  alt={`${alt} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} aria-label="Click to close fullscreen" />
    </div>
  )
}
