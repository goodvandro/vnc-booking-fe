import type React from "react"
import Link from "next/link"
import { Home, Car, CalendarCheck, LayoutDashboard } from "lucide-react"
import ProtectedRoute from "@/components/auth/protected-route"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
          <div className="flex h-16 items-center border-b px-4 lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <LayoutDashboard className="h-6 w-6" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-2 p-4 lg:p-6">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/guest-houses"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Guest Houses
            </Link>
            <Link
              href="/admin/cars"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Car className="h-4 w-4" />
              Cars
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <CalendarCheck className="h-4 w-4" />
              Bookings
            </Link>
          </nav>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Link href="/" className="ml-auto flex items-center gap-2 text-sm font-medium">
              <Home className="h-4 w-4" />
              Back to Main Site
            </Link>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
