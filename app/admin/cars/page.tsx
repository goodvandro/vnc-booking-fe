import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCars, deleteCar } from "../actions"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { CarOutputDTO } from "@/lib/types"

export default async function CarsPage() {
  const cars = await getCars()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Cars</CardTitle>
          <CardDescription>Manage your car rental listings.</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/cars/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Car
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Transmission</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car: CarOutputDTO) => {
              const thumb =
                Array.isArray(car.images) && car.images.length > 0
                  ? car.images[0].url
                  : "/placeholder.svg?height=56&width=56"
              return (
                <TableRow key={car.id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb || "/placeholder.svg"}
                      alt={`${car.title || "Car"} thumbnail`}
                      className="h-14 w-14 rounded object-cover border"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{car.title}</TableCell>
                  <TableCell>{car.seats}</TableCell>
                  <TableCell>{car.transmission}</TableCell>
                  <TableCell>{typeof car.price === "number" ? `€${car.price}` : car.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="icon">
                        <Link href={`/admin/cars/${car.documentId}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <form action={deleteCar.bind(null, car.documentId || "")}>
                        <Button variant="destructive" size="icon" type="submit">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
