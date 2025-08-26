import { UserProfile } from "@clerk/nextjs"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">User Profile</h1>
          <div className="bg-white rounded-lg shadow-sm">
            <UserProfile
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
