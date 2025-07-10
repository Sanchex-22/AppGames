"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, User, UserPlus, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function LoginScreen() {
  const { login, register } = useAuth()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("error")

  // Login form
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Register form
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullName: "",
  })
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setMessage("Por favor completa todos los campos")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    try {
      const result = await login(username, password)
      if (result.success) {
        setMessage(result.message)
        setMessageType("success")
      } else {
        setMessage(result.message)
        setMessageType("error")
      }
    } catch (error) {
      setMessage("Error de conexión. Intenta nuevamente.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!registerData.username.trim()) {
      setMessage("El nombre de usuario es requerido")
      setMessageType("error")
      return
    }

    if (registerData.username.length < 3) {
      setMessage("El nombre de usuario debe tener al menos 3 caracteres")
      setMessageType("error")
      return
    }

    if (!registerData.password.trim()) {
      setMessage("La contraseña es requerida")
      setMessageType("error")
      return
    }

    if (registerData.password.length < 4) {
      setMessage("La contraseña debe tener al menos 4 caracteres")
      setMessageType("error")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setMessage("Las contraseñas no coinciden")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    try {
      const result = await register(registerData)
      if (result.success) {
        setMessage(result.message)
        setMessageType("success")
        // Auto switch to login after successful registration
        setTimeout(() => {
          setIsRegisterMode(false)
          setUsername(registerData.username)
          setPassword(registerData.password)
          setMessage("")
        }, 2000)
      } else {
        setMessage(result.message)
        setMessageType("error")
      }
    } catch (error) {
      setMessage("Error de conexión. Intenta nuevamente.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center animate-pulse mb-4 mx-auto">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Club de Interés Compuesto
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            {isRegisterMode ? "Crea tu cuenta para comenzar" : "Inicia sesión para continuar"}
          </p>
        </div>

        <Card className="border-2 border-gray-400 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl justify-center">
              {isRegisterMode ? (
                <>
                  <UserPlus className="h-5 w-5" />
                  Crear Cuenta
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  Iniciar Sesión
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {!isRegisterMode ? (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-gray-800 font-semibold">
                    Usuario
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingresa tu usuario"
                    className="border-2 border-gray-300 focus:border-blue-600 touch-target"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-800 font-semibold">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      className="border-2 border-gray-300 focus:border-blue-600 touch-target pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Iniciando...
                    </div>
                  ) : (
                    "🚀 Entrar"
                  )}
                </Button>
              </form>
            ) : (
              // Register Form
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="registerUsername" className="text-gray-800 font-semibold">
                    Nombre de Usuario *
                  </Label>
                  <Input
                    id="registerUsername"
                    type="text"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    placeholder="Elige tu nombre de usuario"
                    className="border-2 border-gray-300 focus:border-green-600 touch-target"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="fullName" className="text-gray-800 font-semibold">
                    Nombre Completo
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    placeholder="Tu nombre completo (opcional)"
                    className="border-2 border-gray-300 focus:border-green-600 touch-target"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-800 font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="tu@email.com (opcional)"
                    className="border-2 border-gray-300 focus:border-green-600 touch-target"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="registerPassword" className="text-gray-800 font-semibold">
                    Contraseña *
                  </Label>
                  <div className="relative">
                    <Input
                      id="registerPassword"
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="Crea una contraseña"
                      className="border-2 border-gray-300 focus:border-green-600 touch-target pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      disabled={isLoading}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-800 font-semibold">
                    Confirmar Contraseña *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="Confirma tu contraseña"
                      className="border-2 border-gray-300 focus:border-green-600 touch-target pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creando cuenta...
                    </div>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />🎉 Crear Mi Cuenta
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Toggle between login/register */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                {isRegisterMode ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
              </p>
              <Button
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode)
                  setMessage("")
                  setUsername("")
                  setPassword("")
                  setRegisterData({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    email: "",
                    fullName: "",
                  })
                }}
                variant="link"
                className="text-blue-600 hover:text-blue-800 font-semibold"
                disabled={isLoading}
              >
                {isRegisterMode ? "← Iniciar Sesión" : "Crear Cuenta Nueva →"}
              </Button>
            </div>

            {/* Message Alert */}
            {message && (
              <Alert
                className={
                  messageType === "success"
                    ? "border-green-400 bg-gradient-to-r from-green-100 to-green-200"
                    : "border-red-400 bg-gradient-to-r from-red-100 to-pink-200"
                }
              >
                <div className="flex items-center gap-2">
                  {messageType === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-700" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription
                    className={
                      messageType === "success" ? "text-green-900 font-semibold" : "text-red-800 font-semibold"
                    }
                  >
                    {message}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Demo users info - only show in login mode */}
            {!isRegisterMode && (
              <div className="text-center text-xs text-gray-700 mt-4 p-4 bg-gradient-to-r from-gray-100 to-slate-200 rounded-lg border-2 border-gray-300">
                <p className="font-bold mb-3 text-black">👥 Usuarios de prueba:</p>
                <div className="space-y-2">
                  <p className="bg-gradient-to-r from-yellow-100 to-orange-200 p-2 rounded border-2 border-yellow-400">
                    👑 <code className="bg-yellow-200 px-2 py-1 rounded font-bold">admin</code> /{" "}
                    <code className="bg-yellow-200 px-2 py-1 rounded font-bold">admin123</code>
                    <span className="text-xs text-yellow-700 ml-2">(SUPER ADMIN)</span>
                  </p>
                  <p className="bg-white p-2 rounded border">
                    👤 <code className="bg-gray-200 px-2 py-1 rounded font-bold">jose</code> /{" "}
                    <code className="bg-gray-200 px-2 py-1 rounded font-bold">jose123</code>
                  </p>
                  <p className="bg-white p-2 rounded border">
                    👤 <code className="bg-gray-200 px-2 py-1 rounded font-bold">maria</code> /{" "}
                    <code className="bg-gray-200 px-2 py-1 rounded font-bold">maria123</code>
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
