"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, TrendingUp, UserPlus, CheckCircle, XCircle } from "lucide-react"

interface LoginScreenProps {
  onLogin: (userData: any) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")
  const [showRegister, setShowRegister] = useState(false)
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [registerMessage, setRegisterMessage] = useState("")

  // Usuarios por defecto
  const defaultUsers = [
    { username: "admin", password: "superder!!2", isAdmin: true, isSuperAdmin: true },
    { username: "jose", password: "clave1", isAdmin: false, isSuperAdmin: false },
    { username: "maria", password: "clave2", isAdmin: false, isSuperAdmin: false },
  ]

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setLoginMessage("Por favor completa todos los campos.")
      return
    }

    // Obtener usuarios guardados
    const savedUsers = JSON.parse(localStorage.getItem("appUsers") || "[]")
    const allUsers = savedUsers.length > 0 ? savedUsers : defaultUsers

    const user = allUsers.find((u: any) => u.username === username && u.password === password)

    if (user) {
      setLoginMessage("¡Bienvenido, " + username + "!")
      setTimeout(() => {
        onLogin({
          username: user.username,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin || (user.username === "admin" && user.password === "superder!!2"),
        })
      }, 1000)
    } else {
      setLoginMessage("Usuario o contraseña incorrectos.")
    }
  }

  const handleRegister = () => {
    if (!registerUsername.trim()) {
      setRegisterMessage("Por favor ingresa un nombre de usuario.")
      return
    }

    if (registerUsername.length < 3) {
      setRegisterMessage("El nombre de usuario debe tener al menos 3 caracteres.")
      return
    }

    if (!registerPassword.trim()) {
      setRegisterMessage("Por favor ingresa una contraseña.")
      return
    }

    if (registerPassword.length < 4) {
      setRegisterMessage("La contraseña debe tener al menos 4 caracteres.")
      return
    }

    if (registerPassword !== confirmPassword) {
      setRegisterMessage("Las contraseñas no coinciden.")
      return
    }

    // Verificar si el usuario ya existe
    const savedUsers = JSON.parse(localStorage.getItem("appUsers") || "[]")
    const allUsers = savedUsers.length > 0 ? savedUsers : defaultUsers

    const userExists = allUsers.find((u: any) => u.username.toLowerCase() === registerUsername.toLowerCase())
    if (userExists) {
      setRegisterMessage("Este nombre de usuario ya está en uso.")
      return
    }

    // Crear nuevo usuario
    const newUser = {
      username: registerUsername.trim(),
      password: registerPassword,
      isAdmin: false,
      isSuperAdmin: false,
      createdAt: new Date().toISOString(),
    }

    const updatedUsers = [...allUsers, newUser]
    localStorage.setItem("appUsers", JSON.stringify(updatedUsers))

    setRegisterMessage("¡Cuenta creada exitosamente!")
    setTimeout(() => {
      setShowRegister(false)
      setUsername(newUser.username)
      setPassword(newUser.password)
      setRegisterUsername("")
      setRegisterPassword("")
      setConfirmPassword("")
      setRegisterMessage("")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Club de Interés Compuesto</h1>
          <p className="text-gray-400">Tu camino hacia la libertad financiera</p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">{showRegister ? "Crear Cuenta" : "Iniciar Sesión"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showRegister ? (
              <>
                {/* Login Form */}
                <div>
                  <Label htmlFor="username" className="text-gray-300">
                    Usuario
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingresa tu usuario"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 touch-target"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-300">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 touch-target pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button onClick={handleLogin} className="w-full bg-white text-black hover:bg-gray-200 touch-target">
                  Entrar
                </Button>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">¿No tienes cuenta?</p>
                  <Button
                    onClick={() => setShowRegister(true)}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 touch-target"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Crear Cuenta Nueva
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Register Form */}
                <div>
                  <Label htmlFor="registerUsername" className="text-gray-300">
                    Nombre de Usuario
                  </Label>
                  <Input
                    id="registerUsername"
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder="Elige tu nombre de usuario"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 touch-target"
                  />
                </div>
                <div>
                  <Label htmlFor="registerPassword" className="text-gray-300">
                    Contraseña
                  </Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Crea una contraseña"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 touch-target"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Confirmar Contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu contraseña"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 touch-target"
                  />
                </div>
                <Button onClick={handleRegister} className="w-full bg-white text-black hover:bg-gray-200 touch-target">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Mi Cuenta
                </Button>
                <div className="text-center">
                  <Button
                    onClick={() => setShowRegister(false)}
                    variant="link"
                    className="text-gray-400 hover:text-white"
                  >
                    ← Volver al Login
                  </Button>
                </div>
              </>
            )}

            {/* Messages */}
            {(loginMessage || registerMessage) && (
              <Alert
                className={
                  loginMessage.includes("Bienvenido") || registerMessage.includes("exitosamente")
                    ? "border-green-600 bg-green-900/20"
                    : "border-red-600 bg-red-900/20"
                }
              >
                <div className="flex items-center gap-2">
                  {loginMessage.includes("Bienvenido") || registerMessage.includes("exitosamente") ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                  <AlertDescription
                    className={
                      loginMessage.includes("Bienvenido") || registerMessage.includes("exitosamente")
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {loginMessage || registerMessage}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Demo Users */}
            {!showRegister && (
              <div className="text-center text-xs text-gray-500 mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <p className="font-bold mb-2 text-gray-300">👥 Usuarios de prueba:</p>
                <div className="space-y-1">
                  <p>
                    👑 <code className="bg-gray-700 px-2 py-1 rounded">admin</code> /{" "}
                    <code className="bg-gray-700 px-2 py-1 rounded">superder!!2</code>
                  </p>
                  <p>
                    👤 <code className="bg-gray-700 px-2 py-1 rounded">jose</code> /{" "}
                    <code className="bg-gray-700 px-2 py-1 rounded">clave1</code>
                  </p>
                  <p>
                    👤 <code className="bg-gray-700 px-2 py-1 rounded">maria</code> /{" "}
                    <code className="bg-gray-700 px-2 py-1 rounded">clave2</code>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
