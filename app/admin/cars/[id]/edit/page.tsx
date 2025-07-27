import CarForm from "../../form"
import { getCar } from "../../../actions"
import { notFound } from "next/navigation"

export default async function EditCarPage({ params }: { params: { id: string } }) {
  const car = await getCar(params.id)

  if (!car) {
    notFound()
  }

  return <CarForm initialData={car} />
}
