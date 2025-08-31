import { getGuestHouseByIdData } from "@/lib/strapi-data"
import GuestHouseForm from "../../form"
// import { getGuestHouse } from "../../../actions"
import { notFound } from "next/navigation"

interface EditGuestHousePageProps {
  params: Promise<{ id: string }>
}

export default async function EditGuestHousePage({ params }: EditGuestHousePageProps) {
  const { id } = await params
  const guestHouse = await getGuestHouseByIdData(id)

  if (!guestHouse) {
    notFound()
  }

  return <GuestHouseForm initialData={guestHouse} />
}
