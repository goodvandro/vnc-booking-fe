import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, Car, Home, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import StrapiStatus from "@/components/admin/strapi-status"

const adminEmails = ["admin@example.com", "owner@example.com"]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId, sessionClaims } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const userEmail = sessionClaims?.email as string
  const isAdmin = adminEmails.includes(userEmail)

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
              <LayoutDashboard className="h-6 w-6" />
              Admin Panel
            </Link>
          </div>

          <nav className="px-4 space-y-2">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            <Link href="/admin/bookings">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </Button>
            </Link>

            <Link href="/admin/guest-houses">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                Guest Houses
              </Button>
            </Link>

            <Link href="/admin/cars">
              <Button variant="ghost" className="w-full justify-start">
                <Car className="h-4 w-4 mr-2" />
                Cars
              </Button>
            </Link>
          </nav>

          <Separator className="my-4" />

          <div className="px-4">
            <StrapiStatus />
          </div>

          <Separator className="my-4" />

          <div className="px-4">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
