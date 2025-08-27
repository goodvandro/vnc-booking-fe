import { strapiAPI } from "@/lib/strapi-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Car, Plus, Edit, Users } from "lucide-react"
import Link from "next/link"

export default async function CarsPage() {
  const { cars } = await strapiAPI.getCars()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cars Management</h1>
          <p className="text-muted-foreground">Manage your car rental fleet</p>
        </div>
        <Link href="/admin/cars/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            All Cars ({cars.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cars.length === 0 ? (
            <div className="text-center py-8">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No cars found. Add your first car to get started.</p>
              <Link href="/admin/cars/create">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Car
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Car</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={car.images?.[0] || "/placeholder.svg?height=40&width=60"}
                          alt={car.name}
                          className="w-15 h-10 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{car.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {car.make} {car.model} ({car.year})
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="h-3 w-3" />
                          {car.seats} seats
                        </div>
                        <div>
                          {car.transmission} • {car.fuelType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${car.pricePerDay}/day</TableCell>
                    <TableCell>{car.location}</TableCell>
                    <TableCell>
                      <Badge variant={car.available ? "default" : "secondary"}>
                        {car.available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/cars/${car.id}/edit`}>
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
