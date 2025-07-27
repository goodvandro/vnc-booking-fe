"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import FullscreenImageViewer from "./fullscreen-image-viewer"

interface ImageSliderProps {
  images: string[]
  alt: string
  className?: string
  enableFullscreen?: boolean
}

export default function ImageSlider({ images, alt, className = "", enableFullscreen = false }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className={`bg-muted flex items-center justify-center h-48 ${className}`}>
        <span className="text-muted-foreground text-sm">No images available</span>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const openFullscreen = () => {
    if (enableFullscreen) {
      setIsFullscreenOpen(true)
    }
  }

  return (
    <>
      <div className={`relative group ${className}`}>
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-md">
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            width={400}
            height={300}
            alt={`${alt} - Image ${currentIndex + 1}`}
            className={`w-full h-48 object-cover transition-all duration-300 ${
              enableFullscreen ? "cursor-pointer" : ""
            }`}
            onClick={openFullscreen}
          />

          {/* Fullscreen Button - Only show if fullscreen is enabled */}
          {enableFullscreen && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
              onClick={openFullscreen}
              aria-label="View fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}

          {/* Navigation Arrows - Only show if more than 1 image */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
                onClick={goToNext}
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation - Only show if more than 1 image and hide on mobile */}
        {images.length > 1 && (
          <div className="hidden sm:flex gap-2 mt-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-12 h-9 sm:w-16 sm:h-12 rounded border-2 overflow-hidden transition-all duration-200 ${
                  index === currentIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  width={64}
                  height={48}
                  alt={`${alt} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Viewer */}
      {enableFullscreen && (
        <FullscreenImageViewer
          images={images}
          alt={alt}
          isOpen={isFullscreenOpen}
          onClose={() => setIsFullscreenOpen(false)}
          initialIndex={currentIndex}
        />
      )}
    </>
  )
}
