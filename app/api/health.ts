// Health check endpoint for Docker containers
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Check if application is healthy
  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "0.1.0",
    environment: process.env.NODE_ENV || "development",
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
  };

  // You can add more health checks here
  // For example, database connectivity, external API status, etc.

  try {
    // Add your health checks here
    // Example: await checkDatabaseConnection();
    // Example: await checkExternalAPIStatus();

    res.status(200).json(healthCheck);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Health check failed:", error);
      res.status(503).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    } else {
      console.error("Unknown error:", error);
      res.status(503).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Unknown error",
      });
    }
  }
}
