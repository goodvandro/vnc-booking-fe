import { Card, CardHeader, CardTitle, CardContent, Button, Link } from "ui-components"
import { Home, Car, Calendar } from "icons"

const AdminPage = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Existing stats cards here */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Guest House Bookings</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings ? Math.floor(stats.totalBookings * 0.6) : 0}</div>
          <p className="text-xs text-muted-foreground">Active guest house reservations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Car Rentals</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings ? Math.floor(stats.totalBookings * 0.4) : 0}</div>
          <p className="text-xs text-muted-foreground">Active car rental bookings</p>
        </CardContent>
      </Card>

      {/* Quick action buttons here */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/guest-house-bookings">
                <Home className="h-4 w-4 mr-2" />
                Manage Guest House Bookings
              </Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link href="/admin/car-rental-bookings">
                <Car className="h-4 w-4 mr-2" />
                Manage Car Rental Bookings
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin/bookings">
                <Calendar className="h-4 w-4 mr-2" />
                View All Bookings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminPage
