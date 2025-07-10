"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "./use-local-storage"

interface AppUser {
  username: string
  password: string
  isAdmin: boolean
  createdAt: Date
  lastLogin?: Date
  currentGroup?: string
}

export function useAuth() {
  const [users, setUsers] = useLocalStorage<AppUser[]>("appUsers", [])
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Initialize default users
  useEffect(() => {
    if (users.length === 0) {
      const defaultUsers: AppUser[] = [
        {
          username: "admin",
          password: "superder!!2",
          isAdmin: true,
          createdAt: new Date(),
        },
        {
          username: "jose",
          password: "clave1",
          isAdmin: false,
          createdAt: new Date(),
        },
        {
          username: "maria",
          password: "clave2",
          isAdmin: false,
          createdAt: new Date(),
        },
      ]
      setUsers(defaultUsers)
    }
  }, [users.length, setUsers])

  const login = (username: string, password: string) => {
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      setCurrentUser(user)
      setIsLoggedIn(true)

      // Update last login
      const updatedUsers = users.map((u) => (u.username === username ? { ...u, lastLogin: new Date() } : u))
      setUsers(updatedUsers)

      return { success: true, message: `¡Bienvenido, ${username}!` }
    }

    return { success: false, message: "Usuario o contraseña incorrectos." }
  }

  const register = (username: string, password: string) => {
    if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: "Este nombre de usuario ya está en uso." }
    }

    const newUser: AppUser = {
      username: username.trim(),
      password,
      isAdmin: false,
      createdAt: new Date(),
    }

    setUsers([...users, newUser])
    return { success: true, message: "¡Cuenta creada exitosamente!" }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
  }

  const isAdmin = currentUser?.isAdmin || false
  const isSuperAdmin = currentUser?.username === "admin" && currentUser?.password === "superder!!2"

  return {
    user: currentUser,
    users,
    isLoggedIn,
    isAdmin,
    isSuperAdmin,
    login,
    register,
    logout,
    setUsers,
  }
}
