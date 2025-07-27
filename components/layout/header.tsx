"use client"

import Link from "next/link"
import { Home, Globe, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { languageNames } from "@/lib/translations"
import AuthButtons from "@/components/auth/auth-buttons"
import { useState } from "react"

interface HeaderProps {
  t: any // Translation object
  currentLanguage: string
  setCurrentLanguage: (lang: string) => void
  isLanguageLoading?: boolean
}

export default function Header({ t, currentLanguage, setCurrentLanguage, isLanguageLoading = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const NavLinks = ({ mobile = false, onLinkClick = () => {} }) => (
    <>
      <Link
        href="#guest-houses"
        className={`${mobile ? "block py-2 px-4 text-base" : ""} text-sm font-medium hover:underline underline-offset-4`}
        onClick={onLinkClick}
      >
        {t.guestHouses}
      </Link>
      <Link
        href="#car-rental"
        className={`${mobile ? "block py-2 px-4 text-base" : ""} text-sm font-medium hover:underline underline-offset-4`}
        onClick={onLinkClick}
      >
        {t.carRental}
      </Link>
      <Link
        href="#marketing-section"
        className={`${mobile ? "block py-2 px-4 text-base" : ""} text-sm font-medium hover:underline underline-offset-4`}
        onClick={onLinkClick}
      >
        {t.whyChooseUs}
      </Link>
      <Link
        href="#about-us"
        className={`${mobile ? "block py-2 px-4 text-base" : ""} text-sm font-medium hover:underline underline-offset-4`}
        onClick={onLinkClick}
      >
        {t.aboutUs}
      </Link>
      <Link
        href="#contact-form"
        className={`${mobile ? "block py-2 px-4 text-base" : ""} text-sm font-medium hover:underline underline-offset-4`}
        onClick={onLinkClick}
      >
        {t.contact}
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-background shadow-sm">
      {/* Logo */}
      <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
        <Home className="h-6 w-6" />
        <span className="sr-only">{t.siteTitle}</span>
        <span className="hidden sm:inline">{t.siteTitle}</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex gap-6">
        <NavLinks />
      </nav>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-xs sm:text-sm"
              disabled={isLanguageLoading}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{isLanguageLoading ? "..." : languageNames[currentLanguage]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setCurrentLanguage("en")}
              className={currentLanguage === "en" ? "bg-accent" : ""}
            >
              {languageNames["en"]} {currentLanguage === "en" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setCurrentLanguage("fr")}
              className={currentLanguage === "fr" ? "bg-accent" : ""}
            >
              {languageNames["fr"]} {currentLanguage === "fr" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setCurrentLanguage("pt")}
              className={currentLanguage === "pt" ? "bg-accent" : ""}
            >
              {languageNames["pt"]} {currentLanguage === "pt" && "✓"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Auth Buttons - Hidden on mobile */}
        <div className="hidden sm:flex">
          <AuthButtons t={t} />
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  <span className="font-semibold">{t.siteTitle}</span>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col py-4 space-y-1">
                <NavLinks mobile onLinkClick={() => setIsOpen(false)} />
              </nav>

              {/* Auth Buttons */}
              <div className="mt-auto pt-4 border-t">
                <AuthButtons t={t} mobile />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
