"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"

interface StrapiStatus {
  status: "connected" | "error" | "loading"
  url: string
  error?: string
  timestamp?: string
}

export default function StrapiStatus() {
  const [status, setStatus] = useState<StrapiStatus>({ status: "loading", url: "" })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkStatus = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/strapi-health")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        status: "error",
        url: "Unknown",
        error: "Failed to check status",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkStatus()
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status.status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "loading":
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "loading":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Strapi Status</span>
        <Button variant="ghost" size="sm" onClick={checkStatus} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <Badge className={getStatusColor()}>{status.status}</Badge>
      </div>

      <div className="text-xs text-muted-foreground">
        <div>URL: {status.url}</div>
        {status.error && <div>Error: {status.error}</div>}
        {status.timestamp && <div>Last checked: {new Date(status.timestamp).toLocaleTimeString()}</div>}
      </div>
    </div>
  )
}
