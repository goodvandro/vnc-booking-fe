import CarForm from "../../form"
import { getCar } from "../../../actions"
import { notFound } from "next/navigation"

interface EditCarPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const { id } = await params

  const car = await getCar(id)

  if (!car) {
    notFound()
  }

  return <CarForm initialData={car} />
}
