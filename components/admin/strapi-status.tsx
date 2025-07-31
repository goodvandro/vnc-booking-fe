"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface StrapiStatus {
  status: "connected" | "error" | "checking"
  timestamp: string
  error?: string
}

export default function StrapiStatus() {
  const [status, setStatus] = useState<StrapiStatus>({
    status: "checking",
    timestamp: new Date().toISOString(),
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkStrapiHealth = async () => {
    setIsRefreshing(true)
    setStatus((prev) => ({ ...prev, status: "checking" }))

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
          timestamp: data.timestamp || new Date().toISOString(),
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
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "checking":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case "connected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "checking":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    }
  }

  const getStatusText = () => {
    switch (status.status) {
      case "connected":
        return "Connected"
      case "error":
        return "Disconnected"
      case "checking":
        return "Checking..."
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
          <CardDescription>Connection status to your Strapi CMS</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
          <Button variant="outline" size="sm" onClick={checkStrapiHealth} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          Last checked: {new Date(status.timestamp).toLocaleString()}
          {status.error && <div className="mt-1 text-red-600">Error: {status.error}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
