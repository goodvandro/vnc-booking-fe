"use client"

import { cn } from "@/lib/utils"
import { Calendar, Car, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const AdminLayout = () => {
  const pathname = usePathname()

  return (
    <div className="flex">
      <nav className="bg-white p-4">
        <Link
          href="/admin/guest-house-bookings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === "/admin/guest-house-bookings" && "bg-muted text-primary",
          )}
        >
          <Home className="h-4 w-4" />
          Guest House Bookings
        </Link>

        <Link
          href="/admin/car-rental-bookings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === "/admin/car-rental-bookings" && "bg-muted text-primary",
          )}
        >
          <Car className="h-4 w-4" />
          Car Rental Bookings
        </Link>

        <Link
          href="/admin/bookings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === "/admin/bookings" && "bg-muted text-primary",
          )}
        >
          <Calendar className="h-4 w-4" />
          All Bookings
        </Link>

        {/* rest of code here */}
      </nav>
      <main className="flex-1 p-4">{/* main content here */}</main>
    </div>
  )
}

export default AdminLayout
