"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "@/components/auth/login-screen"
import { MainApp } from "@/components/main-app"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AppGames() {
  const { user, isLoggedIn, isLoading } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Simular inicialización de la app
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!isInitialized || isLoading) {
    return <LoadingSpinner />
  }

  // Si no está logueado, mostrar pantalla de login
  if (!isLoggedIn) {
    return <LoginScreen />
  }

  // Si está logueado, mostrar la app principal
  return <MainApp user={user} />
}
