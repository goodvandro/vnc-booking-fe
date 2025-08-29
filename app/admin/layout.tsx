"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Car, Building2, Calendar, CarTaxiFront, Menu, Settings, BarChart3 } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { StrapiStatus } from "@/components/admin/strapi-status"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
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
    icon: CarTaxiFront,
  },
]

function NavItems({ pathname }: { pathname: string }) {
  return (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${
              isActive ? "bg-muted text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ProtectedRoute>
  )
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Settings className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavItems pathname={pathname} />
            </nav>
          </div>
          <div className="mt-auto p-4">
            <StrapiStatus />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Settings className="h-6 w-6" />
                  <span>Admin Panel</span>
                </Link>
                <NavItems pathname={pathname} />
              </nav>
              <div className="mt-auto">
                <StrapiStatus />
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">
              {navigation.find((item) => item.href === pathname)?.name || "Admin"}
            </h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
