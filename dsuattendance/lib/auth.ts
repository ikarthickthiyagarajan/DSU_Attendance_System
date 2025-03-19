"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000

export type AuthSession = {
  authenticated: boolean
  email: string
  lastActivity: number
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null

  const sessionData = localStorage.getItem("dsu-auth")
  if (!sessionData) return null

  try {
    return JSON.parse(sessionData) as AuthSession
  } catch (error) {
    console.error("Failed to parse session data:", error)
    return null
  }
}

export function setSession(session: AuthSession): void {
  if (typeof window === "undefined") return
  localStorage.setItem("dsu-auth", JSON.stringify(session))
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("dsu-auth")
}

export function updateSessionActivity(): void {
  const session = getSession()
  if (session) {
    session.lastActivity = Date.now()
    setSession(session)
  }
}

export function isSessionExpired(): boolean {
  const session = getSession()
  if (!session) return true

  const now = Date.now()
  const lastActivity = session.lastActivity || 0
  return now - lastActivity > SESSION_TIMEOUT
}

export function useAuthGuard(requireAuth = true) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Function to check authentication
    const checkAuth = () => {
      const session = getSession()
      const isAuthenticated = session?.authenticated === true

      // Check if session is expired
      if (isAuthenticated && isSessionExpired()) {
        clearSession()
        router.push("/?expired=true")
        return
      }

      // Update last activity timestamp
      if (isAuthenticated) {
        updateSessionActivity()
      }

      // Redirect based on auth state
      if (requireAuth && !isAuthenticated) {
        // Redirect to login if auth is required but user is not authenticated
        router.push("/")
      } else if (!requireAuth && isAuthenticated && pathname === "/") {
        // Redirect to dashboard if user is already authenticated and trying to access login
        router.push("/dashboard")
      }
    }

    // Check auth on initial load
    checkAuth()

    // Set up interval to periodically check session
    const interval = setInterval(checkAuth, 60000) // Check every minute

    // Set up activity listeners
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"]
    const handleActivity = () => {
      updateSessionActivity()
    }

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Clean up
    return () => {
      clearInterval(interval)
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [router, pathname, requireAuth])
}

