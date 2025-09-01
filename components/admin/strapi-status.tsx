"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface StrapiStatus {
  status: "connected" | "error" | "loading"
  timestamp: string
  error?: string
}

export function StrapiStatus() {
  const [status, setStatus] = useState<StrapiStatus>({
    status: "loading",
    timestamp: new Date().toISOString(),
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [formattedTime, setFormattedTime] = useState("")

useEffect(() => {
  setFormattedTime(new Date(status.timestamp).toLocaleTimeString())
}, [status.timestamp])

  const checkStrapiHealth = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/strapi-health")
      const data = await response.json()

      if (response.ok && data.status === "connected") {
        setStatus({
          status: "connected",
          timestamp: data.timestamp,
        })
      } else {
        setStatus({
          status: "error",
          timestamp: data.timestamp,
          error: data.error || "Connection failed",
        })
      }
    } catch (error) {
      setStatus({
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Network error",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkStrapiHealth()
  }, [])

  const getStatusIcon = () => {
    switch (status.status) {
      case "connected":
        return <CheckCircle className="h-4 w-4" />
      case "error":
        return <XCircle className="h-4 w-4" />
      case "loading":
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusVariant = () => {
    switch (status.status) {
      case "connected":
        return "default" as const
      case "error":
        return "destructive" as const
      case "loading":
        return "secondary" as const
    }
  }

  const getStatusText = () => {
    switch (status.status) {
      case "connected":
        return "Connected"
      case "error":
        return "Disconnected"
      case "loading":
        return "Checking..."
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusVariant()} className="flex items-center gap-1">
        {getStatusIcon()}
        Service: {getStatusText()}
      </Badge>

      <Button
        variant="outline"
        size="sm"
        onClick={checkStrapiHealth}
        disabled={isRefreshing}
        className="h-6 px-2 bg-transparent"
      >
        <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
      </Button>

      {status.error && (
        <div className="text-xs text-muted-foreground max-w-xs truncate" title={status.error}>
          Error: {status.error}
        </div>
      )}

      <div className="text-xs text-muted-foreground">Last check: {formattedTime}</div>
    </div>
  )
}
