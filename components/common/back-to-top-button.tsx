"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackToTopButtonProps {
  t: any // Translation object
  show: boolean
  onClick: () => void
}

export default function BackToTopButton({ t, show, onClick }: BackToTopButtonProps) {
  if (!show) return null

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 p-3 rounded-full shadow-lg z-50 h-12 w-12 sm:h-14 sm:w-14"
      aria-label={t.backToTop}
    >
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
    </Button>
  )
}
