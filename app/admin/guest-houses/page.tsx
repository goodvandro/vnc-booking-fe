import { strapiAPI } from "@/lib/strapi-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Home, Plus, Edit, Star, Users } from "lucide-react"
import Link from "next/link"

export default async function GuestHousesPage() {
  const { guestHouses } = await strapiAPI.getGuestHouses()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Guest Houses Management</h1>
          <p className="text-muted-foreground">Manage your guest house listings</p>
        </div>
        <Link href="/admin/guest-houses/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Guest House
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            All Guest Houses ({guestHouses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {guestHouses.length === 0 ? (
            <div className="text-center py-8">
              <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No guest houses found. Add your first guest house to get started.</p>
              <Link href="/admin/guest-houses/create">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Guest House
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guestHouses.map((guestHouse) => (
                  <TableRow key={guestHouse.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={guestHouse.images?.[0] || "/placeholder.svg?height=40&width=60"}
                          alt={guestHouse.name}
                          className="w-15 h-10 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{guestHouse.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{guestHouse.location}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="h-3 w-3" />
                          Up to {guestHouse.maxGuests} guests
                        </div>
                        <div>
                          {guestHouse.bedrooms} bed • {guestHouse.bathrooms} bath
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${guestHouse.pricePerNight}/night</TableCell>
                    <TableCell>
                      {guestHouse.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{guestHouse.rating}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={guestHouse.available ? "default" : "secondary"}>
                        {guestHouse.available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/guest-houses/${guestHouse.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
