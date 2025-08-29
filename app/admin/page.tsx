"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, Plus, Eye, BarChart3 } from "lucide-react"
import { getBookingsData, getCars, getGuestHouses } from "./actions"
import type { Booking } from "@/lib/types"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    guestHouseBookings: 0,
    carRentalBookings: 0,
    totalCars: 0,
    totalGuestHouses: 0,
    pendingBookings: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [bookings, cars, guestHouses] = await Promise.all([getBookingsData(), getCars(), getGuestHouses()])

        const guestHouseBookings = bookings.filter((b) => b.type === "guest-house")
        const carRentalBookings = bookings.filter((b) => b.type === "car-rental")
        const pendingBookings = bookings.filter((b) => b.status === "pending")

        setStats({
          totalBookings: bookings.length,
          guestHouseBookings: guestHouseBookings.length,
          carRentalBookings: carRentalBookings.length,
          totalCars: cars.length,
          totalGuestHouses: guestHouses.length,
          pendingBookings: pendingBookings.length,
        })

        // Get 5 most recent bookings
        const recent = bookings
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5)
        setRecentBookings(recent)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your booking system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingBookings} pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guest House Bookings</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.guestHouseBookings}</div>
            <p className="text-xs text-muted-foreground">{stats.totalGuestHouses} properties available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Car Rentals</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" /> {/* Renamed Car to BarChart3 */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.carRentalBookings}</div>
            <p className="text-xs text-muted-foreground">{stats.totalCars} vehicles available</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/guest-houses/create">
                <Plus className="mr-2 h-4 w-4" />
                Add New Guest House
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin/cars/create">
                <Plus className="mr-2 h-4 w-4" />
                Add New Car
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin/bookings">
                <Eye className="mr-2 h-4 w-4" />
                View All Bookings
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest reservation activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent bookings</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {booking.firstName} {booking.lastName}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={booking.type === "guest-house" ? "default" : "secondary"} className="text-xs">
                          {booking.type === "guest-house" ? "Guest House" : "Car Rental"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {booking.status || "pending"}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/bookings/${booking.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
