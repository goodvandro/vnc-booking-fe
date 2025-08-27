import { notFound } from "next/navigation"
import { strapiAPI } from "@/lib/strapi-api"
import CarForm from "../../form"

interface EditCarPageProps {
  params: {
    id: string
  }
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const car = await strapiAPI.getCarById(params.id)

  if (!car) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Car</h1>
        <p className="text-muted-foreground">Update car information</p>
      </div>

      <CarForm car={car} />
    </div>
  )
}
