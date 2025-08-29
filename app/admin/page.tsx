import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, Car, Calendar, CarTaxiFront, Plus, Eye } from "lucide-react"
import { getBookingsData, getCars, getGuestHouses } from "./actions"

export default async function AdminDashboard() {
  const [bookings, cars, guestHouses] = await Promise.all([getBookingsData(), getCars(), getGuestHouses()])

  const guestHouseBookings = bookings.filter((b) => b.type === "guest-house")
  const carRentalBookings = bookings.filter((b) => b.type === "car-rental")

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      description: "All bookings combined",
      icon: Calendar,
      href: "/admin/bookings",
    },
    {
      title: "Guest House Bookings",
      value: guestHouseBookings.length,
      description: "Active guest house reservations",
      icon: Building2,
      href: "/admin/guest-house-bookings",
    },
    {
      title: "Car Rental Bookings",
      value: carRentalBookings.length,
      description: "Active car rental bookings",
      icon: CarTaxiFront,
      href: "/admin/car-rental-bookings",
    },
    {
      title: "Available Cars",
      value: cars.length,
      description: "Cars in the fleet",
      icon: Car,
      href: "/admin/cars",
    },
    {
      title: "Guest Houses",
      value: guestHouses.length,
      description: "Properties available",
      icon: Building2,
      href: "/admin/guest-houses",
    },
  ]

  const quickActions = [
    {
      title: "Add New Car",
      description: "Add a new car to the rental fleet",
      href: "/admin/cars/create",
      icon: Car,
    },
    {
      title: "Add Guest House",
      description: "Add a new guest house property",
      href: "/admin/guest-houses/create",
      icon: Building2,
    },
    {
      title: "View All Bookings",
      description: "Manage all bookings and reservations",
      href: "/admin/bookings",
      icon: Calendar,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your booking system and quick actions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <Button asChild variant="outline" size="sm" className="mt-2 bg-transparent">
                <Link href={stat.href}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <action.icon className="h-5 w-5" />
                {action.title}
              </CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={action.href}>
                  <Plus className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
