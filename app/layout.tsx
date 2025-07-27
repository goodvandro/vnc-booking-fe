import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "V0 Booking - Guest Houses & Car Rentals",
  description: "Discover cozy guest houses and convenient car rentals for your next adventure.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "hsl(var(--primary))",
          colorBackground: "hsl(var(--background))",
          colorInputBackground: "hsl(var(--background))",
          colorInputText: "hsl(var(--foreground))",
        },
        elements: {
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
          card: "bg-card text-card-foreground shadow-lg",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
