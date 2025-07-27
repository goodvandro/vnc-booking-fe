import { UserProfile } from "@clerk/nextjs"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <UserProfile
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-2xl",
          },
        }}
      />
    </div>
  )
}
