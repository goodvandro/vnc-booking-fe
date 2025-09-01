import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { getGuestHouses, deleteGuestHouse } from "../actions";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { GuestHouseOutputDTO } from "@/lib/types";
import { deleteGuestHouseData, getGuestHousesData } from "@/lib/strapi-data";

export default async function GuestHousesPage() {
  const guestHouses = await getGuestHousesData();

  const handleSubmitDelete = (e: any, id: string) => {
    e.preventDefault();
    deleteGuestHouseData(id as string).then((result) => {
      if (result) {
        console.log("Guest house deleted successfully");
      } else {
        console.error("Failed to delete guest house");
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Guest Houses</CardTitle>
          <CardDescription>Manage your guest house listings.</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/guest-houses/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Guest House
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price/Night</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guestHouses.map((gh: GuestHouseOutputDTO) => {
              const thumb =
                Array.isArray(gh.images) && gh.images.length > 0
                  ? gh.images[0].url
                  : "/placeholder.svg?height=56&width=56";
              return (
                <TableRow key={gh.id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb || "/placeholder.svg"}
                      alt={`${gh.title || "Car"} thumbnail`}
                      className="h-14 w-14 rounded object-cover border"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{gh.title}</TableCell>
                  <TableCell>{gh.location}</TableCell>
                  <TableCell>
                    {typeof gh.price === "number" ? `$${gh.price}` : gh.price}
                  </TableCell>
                  <TableCell>{gh.rating}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="icon">
                        <Link
                          href={`/admin/guest-houses/${gh.documentId}/edit`}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <form
                        // action={handleSubmitDelete}
                      >
                        {/* <Button variant="destructive" size="icon" type="submit">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button> */}
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
