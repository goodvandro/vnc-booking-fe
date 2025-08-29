"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, Home, Car, Calendar, Menu, Building2, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { StrapiStatus } from "@/components/admin/strapi-status"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Guest Houses",
    href: "/admin/guest-houses",
    icon: Home,
  },
  {
    name: "Cars",
    href: "/admin/cars",
    icon: Car,
  },
  {
    name: "All Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    name: "Guest House Bookings",
    href: "/admin/guest-house-bookings",
    icon: Building2,
  },
  {
    name: "Car Rental Bookings",
    href: "/admin/car-rental-bookings",
    icon: CalendarDays,
  },
]

function NavigationItems({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-2">
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
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-background border-r">
          <div className="flex items-center flex-shrink-0 px-4 py-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex flex-col flex-grow px-4 pb-4">
            <NavigationItems pathname={pathname} />
            <Separator className="my-4" />
            <StrapiStatus />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-50 bg-transparent">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full bg-background">
            <div className="flex items-center flex-shrink-0 px-4 py-6">
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex flex-col flex-grow px-4 pb-4">
              <NavigationItems pathname={pathname} />
              <Separator className="my-4" />
              <StrapiStatus />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-4 lg:p-8">
          <div className="lg:hidden mb-16" /> {/* Spacer for mobile menu button */}
          {children}
        </main>
      </div>
    </div>
  )
}
