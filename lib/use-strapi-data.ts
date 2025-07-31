"use client"

import { useState, useEffect } from "react"
import type { GuestHouse, Car, Booking } from "./types"

// Custom hooks for client-side data fetching from Strapi
export function useGuestHouses() {
  const [guestHouses, setGuestHouses] = useState<GuestHouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGuestHouses() {
      try {
        setLoading(true)
        const response = await fetch("/api/guest-houses")
        if (!response.ok) throw new Error("Failed to fetch guest houses")
        const data = await response.json()
        setGuestHouses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchGuestHouses()
  }, [])

  return { guestHouses, loading, error }
}

export function useCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true)
        const response = await fetch("/api/cars")
        if (!response.ok) throw new Error("Failed to fetch cars")
        const data = await response.json()
        setCars(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  return { cars, loading, error }
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true)
        const response = await fetch("/api/bookings")
        if (!response.ok) throw new Error("Failed to fetch bookings")
        const data = await response.json()
        setBookings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  return { bookings, loading, error }
}
