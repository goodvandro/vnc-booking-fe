import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "./actions"
import { Building2, Car, Calendar, Clock, CheckCircle, Euro, Home, CalendarCheck } from "lucide-react"

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Total Guest Houses",
      value: stats.totalGuestHouses || 0,
      icon: Building2,
      description: "Active guest house listings",
    },
    {
      title: "Total Cars",
      value: stats.totalCars || 0,
      icon: Car,
      description: "Available rental cars",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings || 0,
      icon: Calendar,
      description: "All time bookings",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings || 0,
      icon: Clock,
      description: "Awaiting confirmation",
    },
    {
      title: "Confirmed Bookings",
      value: stats.confirmedBookings || 0,
      icon: CheckCircle,
      description: "Confirmed reservations",
    },
    {
      title: "Total Revenue",
      value: `€${(stats.totalRevenue || 0).toFixed(2)}`,
      icon: Euro,
      description: "Total earnings",
    },
  ]

  const quickActions = [
    {
      title: "Guest House Bookings",
      description: "Manage guest house reservations",
      href: "/admin/guest-house-bookings",
      icon: Home,
      count: stats.guestHouseBookings || 0,
    },
    {
      title: "Car Rental Bookings",
      description: "Manage car rental bookings",
      href: "/admin/car-rental-bookings",
      icon: CalendarCheck,
      count: stats.carRentalBookings || 0,
    },
    {
      title: "All Bookings",
      description: "View all bookings together",
      href: "/admin/bookings",
      icon: Calendar,
      count: stats.totalBookings || 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your booking management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <action.icon className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold">{action.count}</span>
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={action.href}>Manage {action.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Management Links */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Content Management</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Guest Houses
              </CardTitle>
              <CardDescription>Manage your guest house listings and properties</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/guest-houses">Manage Guest Houses</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Cars
              </CardTitle>
              <CardDescription>Manage your car rental fleet and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/cars">Manage Cars</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
