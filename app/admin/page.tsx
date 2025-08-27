import { strapiAPI } from "@/lib/strapi-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Car, Home, Users, TrendingUp, Clock } from "lucide-react"

export default async function AdminDashboard() {
  // Fetch dashboard data
  const [bookings, cars, guestHouses] = await Promise.all([
    strapiAPI.getAllBookings(),
    strapiAPI.getCars(),
    strapiAPI.getGuestHouses(),
  ])

  // Calculate stats
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.bookingStatus === "pending").length
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === "confirmed").length
  const totalRevenue = bookings.filter((b) => b.bookingStatus === "confirmed").reduce((sum, b) => sum + b.totalPrice, 0)

  const availableCars = cars.filter((c) => c.available).length
  const availableGuestHouses = guestHouses.filter((gh) => gh.available).length

  // Recent bookings (last 5)
  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {pendingBookings} pending, {confirmedBookings} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From confirmed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableCars}</div>
            <p className="text-xs text-muted-foreground">Out of {cars.length} total cars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Guest Houses</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableGuestHouses}</div>
            <p className="text-xs text-muted-foreground">Out of {guestHouses.length} total properties</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent bookings</p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {booking.firstName} {booking.lastName}
                      </span>
                    </div>
                    <Badge variant="outline">{booking.guest_house ? "Guest House" : "Car Rental"}</Badge>
                    <Badge className={getStatusColor(booking.bookingStatus)}>{booking.bookingStatus}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${booking.totalPrice}</div>
                    <div className="text-sm text-muted-foreground">{booking.bookingId}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
