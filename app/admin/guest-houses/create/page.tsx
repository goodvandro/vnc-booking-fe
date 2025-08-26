import GuestHouseForm from "../form"

export default function CreateGuestHousePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Guest House</h1>
        <p className="text-muted-foreground">Add a new guest house to your listings</p>
      </div>

      <GuestHouseForm />
    </div>
  )
}
