"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { StrapiStatus } from "@/components/admin/strapi-status"
import { Menu, Home, Car, Building, Calendar, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    name: "All Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    name: "Guest House Bookings",
    href: "/admin/guest-house-bookings",
    icon: Home,
  },
  {
    name: "Car Rental Bookings",
    href: "/admin/car-rental-bookings",
    icon: Car,
  },
  {
    name: "Guest Houses",
    href: "/admin/guest-houses",
    icon: Building,
  },
  {
    name: "Cars",
    href: "/admin/cars",
    icon: Car,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-background border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-1">
              <NavItems />
            </nav>
          </div>
          <div className="flex-shrink-0 p-4 border-t">
            <StrapiStatus />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40 bg-transparent">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center flex-shrink-0 px-4 py-5">
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex-grow">
              <nav className="px-4 space-y-1">
                <NavItems />
              </nav>
            </div>
            <div className="flex-shrink-0 p-4 border-t">
              <StrapiStatus />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">{children}</main>
      </div>
    </div>
  )
}
