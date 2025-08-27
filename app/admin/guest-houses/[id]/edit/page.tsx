import { notFound } from "next/navigation"
import { strapiAPI } from "@/lib/strapi-api"
import GuestHouseForm from "../../form"

interface EditGuestHousePageProps {
  params: {
    id: string
  }
}

export default async function EditGuestHousePage({ params }: EditGuestHousePageProps) {
  const guestHouse = await strapiAPI.getGuestHouseById(params.id)

  if (!guestHouse) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Guest House</h1>
        <p className="text-muted-foreground">Update guest house information</p>
      </div>

      <GuestHouseForm guestHouse={guestHouse} />
    </div>
  )
}
