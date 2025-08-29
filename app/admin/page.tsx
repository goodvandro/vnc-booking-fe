import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Car, Calendar, Clock, CheckCircle, Users } from "lucide-react"
import { getDashboardStats } from "./actions"
import { StrapiStatus } from "@/components/admin/strapi-status"

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your guest houses, cars, and bookings</p>
        </div>
        <StrapiStatus />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guest Houses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuestHouses}</div>
            <p className="text-xs text-muted-foreground">Total properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCars}</div>
            <p className="text-xs text-muted-foreground">Available vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Booking Status Overview
            </CardTitle>
            <CardDescription>Current booking status distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Pending</Badge>
                <span className="text-sm text-muted-foreground">Awaiting confirmation</span>
              </div>
              <span className="font-semibold">{stats.pendingBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default">Confirmed</Badge>
                <span className="text-sm text-muted-foreground">Ready to go</span>
              </div>
              <span className="font-semibold">{stats.confirmedBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Total</Badge>
                <span className="text-sm text-muted-foreground">All bookings</span>
              </div>
              <span className="font-semibold">{stats.totalBookings}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <a
                href="/admin/bookings"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <span className="font-medium">Manage Bookings</span>
                <Badge variant="secondary">{stats.totalBookings}</Badge>
              </a>
              <a
                href="/admin/guest-houses"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <span className="font-medium">Manage Guest Houses</span>
                <Badge variant="secondary">{stats.totalGuestHouses}</Badge>
              </a>
              <a
                href="/admin/cars"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <span className="font-medium">Manage Cars</span>
                <Badge variant="secondary">{stats.totalCars}</Badge>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
