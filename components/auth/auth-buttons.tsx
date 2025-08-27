"use client"

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { User, LogIn } from "lucide-react"

interface AuthButtonsProps {
  t: any
}

export default function AuthButtons({ t }: AuthButtonsProps) {
  const { isSignedIn, user } = useUser()

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {t.welcome || "Welcome"}, {user.firstName || user.emailAddresses[0]?.emailAddress}
        </span>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm">
          <LogIn className="h-4 w-4 mr-2" />
          {t.signIn || "Sign In"}
        </Button>
      </SignInButton>

      <SignUpButton mode="modal">
        <Button size="sm">
          <User className="h-4 w-4 mr-2" />
          {t.signUp || "Sign Up"}
        </Button>
      </SignUpButton>
    </div>
  )
}
