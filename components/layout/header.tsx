"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Car, Info, Mail, User } from "lucide-react"
import Link from "next/link"
import AuthButtons from "@/components/auth/auth-buttons"
import type { User as ClerkUser } from "@clerk/nextjs/server"

interface HeaderProps {
  t: any
  user: ClerkUser | null | undefined
}

export default function Header({ t, user }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "#guest-houses", label: t.guestHouses || "Guest Houses", icon: Home },
    { href: "#car-rental", label: t.carRental || "Car Rental", icon: Car },
    { href: "#about", label: t.aboutUs || "About Us", icon: Info },
    { href: "#contact", label: t.contact || "Contact", icon: Mail },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MB</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">{t.siteName || "Modern Booking"}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons t={t} />
            {user && (
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {t.profile || "Profile"}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}

                <div className="pt-4 border-t">
                  <AuthButtons t={t} />
                  {user && (
                    <Link href="/profile" className="mt-4 block">
                      <Button variant="outline" className="w-full bg-transparent">
                        <User className="h-4 w-4 mr-2" />
                        {t.profile || "Profile"}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
