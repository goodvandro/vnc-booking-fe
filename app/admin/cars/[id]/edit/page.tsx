import { getCarByIdData } from "@/lib/strapi-data"
import CarForm from "../../form"
// import { getCar } from "../../../actions"
import { notFound } from "next/navigation"

interface EditCarPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const { id } = await params

  // The id parameter here is actually the documentId from the cars table
  const car = await getCarByIdData(id)

  if (!car) {
    notFound()
  }

  return <CarForm initialData={car} />
}
