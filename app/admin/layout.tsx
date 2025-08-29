"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Home, Car, Calendar, Menu, Building2, CalendarCheck } from "lucide-react"
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
    icon: Building2,
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
    icon: Home,
  },
  {
    name: "Car Rental Bookings",
    href: "/admin/car-rental-bookings",
    icon: CalendarCheck,
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
      <div className="hidden w-64 border-r bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Building2 className="h-6 w-6" />
              Admin Panel
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <NavItems />
          </nav>
          <div className="border-t p-4">
            <StrapiStatus />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex h-full flex-col">
                <div className="flex h-14 items-center border-b px-4">
                  <Link href="/admin" className="flex items-center gap-2 font-semibold">
                    <Building2 className="h-6 w-6" />
                    Admin Panel
                  </Link>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                  <NavItems />
                </nav>
                <div className="border-t p-4">
                  <StrapiStatus />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 font-semibold">
            <Building2 className="h-6 w-6" />
            Admin Panel
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
