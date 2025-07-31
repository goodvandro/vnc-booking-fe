"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface StrapiStatus {
  status: "connected" | "error" | "loading"
  message: string
  timestamp?: string
  error?: string
}

export default function StrapiStatus() {
  const [status, setStatus] = useState<StrapiStatus>({ status: "loading", message: "Checking connection..." })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkStrapiHealth = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/strapi-health")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        status: "error",
        message: "Failed to check Strapi connection",
        error: error instanceof Error ? error.message : "Unknown error",
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
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "loading":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case "connected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "loading":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {getStatusIcon()}
            Strapi Backend Status
          </CardTitle>
          <CardDescription>Connection status to Strapi CMS</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={checkStrapiHealth} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Badge className={getStatusColor()}>{status.status.charAt(0).toUpperCase() + status.status.slice(1)}</Badge>
          <p className="text-sm text-muted-foreground">{status.message}</p>
          {status.error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">Error: {status.error}</p>}
          {status.timestamp && (
            <p className="text-xs text-muted-foreground">Last checked: {new Date(status.timestamp).toLocaleString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
