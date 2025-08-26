import CarForm from "../form"

export default function CreateCarPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Car</h1>
        <p className="text-muted-foreground">Add a new car to the rental fleet</p>
      </div>

      <CarForm />
    </div>
  )
}
