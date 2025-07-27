"use client"

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { User, LogIn, UserPlus } from "lucide-react"

interface AuthButtonsProps {
  t: any // Translation object
  mobile?: boolean
}

export default function AuthButtons({ t, mobile = false }: AuthButtonsProps) {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className={`${mobile ? "flex flex-col space-y-2" : "flex items-center gap-2"}`}>
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <div className={`${mobile ? "flex flex-col items-start space-y-2" : "flex items-center gap-2"}`}>
        {mobile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Welcome, {user.firstName || user.emailAddresses[0].emailAddress}</span>
          </div>
        )}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
              userButtonPopoverCard: "shadow-lg",
            },
          }}
          userProfileProps={{
            appearance: {
              elements: {
                rootBox: "mx-auto",
                card: "shadow-2xl",
              },
            },
          }}
        />
        {!mobile && (
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {user.firstName || user.emailAddresses[0].emailAddress.split("@")[0]}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`${mobile ? "flex flex-col space-y-2" : "flex items-center gap-2"}`}>
      <SignInButton mode="modal">
        <Button variant="ghost" size={mobile ? "default" : "sm"} className={mobile ? "w-full justify-start" : ""}>
          <LogIn className="h-4 w-4 mr-2" />
          {t.login}
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button size={mobile ? "default" : "sm"} className={mobile ? "w-full" : ""}>
          <UserPlus className="h-4 w-4 mr-2" />
          {t.signUp}
        </Button>
      </SignUpButton>
    </div>
  )
}
