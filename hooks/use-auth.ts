"use client"

import { useState, useEffect } from "react"

interface User {
  id: number
  username: string
  isAdmin: boolean
  isSuperAdmin: boolean
  email?: string
  fullName?: string
}

interface RegisterData {
  username: string
  password: string
  confirmPassword: string
  email: string
  fullName: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if there's a stored session or token
        const storedUser = localStorage.getItem("currentUser")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        const userData = data.user
        setUser(userData)
        setIsLoggedIn(true)

        // Store user data locally
        localStorage.setItem("currentUser", JSON.stringify(userData))

        return { success: true, message: `¡Bienvenido, ${userData.username}!` }
      } else {
        return { success: false, message: data.error || "Error al iniciar sesión" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Error de conexión. Intenta nuevamente." }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          email: registerData.email || null,
          fullName: registerData.fullName || null,
          isAdmin: false,
        }),
      })

      const data = await response.json()

      if (data.success) {
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.error || "Error al crear la cuenta" }
      }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, message: "Error de conexión. Intenta nuevamente." }
    }
  }

  const logout = async () => {
    try {
      if (user) {
        await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setIsLoggedIn(false)
      localStorage.removeItem("currentUser")
    }
  }

  return {
    user,
    isLoggedIn,
    isLoading,
    login,
    register,
    logout,
  }
}
