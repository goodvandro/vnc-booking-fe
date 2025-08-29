"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle } from "lucide-react"

export function StrapiStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkStrapiHealth = async () => {
    try {
      const response = await fetch("/api/strapi-health")
      if (response.ok) {
        setStatus("connected")
      } else {
        setStatus("disconnected")
      }
    } catch (error) {
      setStatus("disconnected")
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setStatus("checking")
    await checkStrapiHealth()
    setIsRefreshing(false)
  }

  useEffect(() => {
    checkStrapiHealth()
    // Check every 30 seconds
    const interval = setInterval(checkStrapiHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          variant: "default" as const,
          icon: <CheckCircle className="h-3 w-3" />,
          text: "Strapi Connected",
        }
      case "disconnected":
        return {
          variant: "destructive" as const,
          icon: <XCircle className="h-3 w-3" />,
          text: "Strapi Disconnected",
        }
      default:
        return {
          variant: "secondary" as const,
          icon: <RefreshCw className="h-3 w-3 animate-spin" />,
          text: "Checking...",
        }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <div className="flex items-center gap-2">
      <Badge variant={statusConfig.variant} className="flex items-center gap-1">
        {statusConfig.icon}
        {statusConfig.text}
      </Badge>
      <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-6 w-6 p-0">
        <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}
