import GuestHouseForm from "../../form"
import { getGuestHouse } from "../../../actions"
import { notFound } from "next/navigation"

export default async function EditGuestHousePage({ params }: { params: { id: string } }) {
  const guestHouse = await getGuestHouse(params.id)

  if (!guestHouse) {
    notFound()
  }

  return <GuestHouseForm initialData={guestHouse} />
}
