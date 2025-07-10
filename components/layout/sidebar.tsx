"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, Lightbulb, Heart, MessageCircle, Shield, User, Crown, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: any
}

export function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, user }: SidebarProps) {
  const { logout } = useAuth()

  const sidebarItems = [
    { id: "calculadora", label: "Calculadora", icon: Calculator },
    { id: "progreso", label: "Mi Progreso", icon: TrendingUp },
    { id: "ideas", label: "Ideas", icon: Lightbulb },
    { id: "motivacion", label: "Motivación", icon: Heart },
    { id: "chat", label: "Chat Grupal", icon: MessageCircle },
    ...(user?.isAdmin ? [{ id: "admin", label: "Panel Admin", icon: Shield }] : []),
    { id: "perfil", label: "Mi Perfil", icon: User },
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 lg:w-64 bg-gradient-to-b from-black via-gray-900 to-slate-800 text-white transform transition-transform duration-300 ease-in-out shadow-2xl
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="p-4 lg:p-6 safe-area-inset h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 lg:mb-8">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
            <TrendingUp className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
          </div>
          <h2 className="text-base lg:text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
            Club Interés
          </h2>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 lg:px-4 lg:py-3 rounded-xl text-left transition-all duration-200 transform hover:scale-105 touch-target text-sm lg:text-base
                  ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                {item.label}
                {item.id === "admin" && <Crown className="h-3 w-3 lg:h-4 lg:w-4 ml-auto text-yellow-400" />}
              </button>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="text-xs lg:text-sm text-gray-400 mb-2">Sesión activa:</div>
          <div className="font-semibold text-white mb-1 flex items-center gap-2 text-sm lg:text-base">
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              {user?.username}
            </span>
            {user?.isSuperAdmin && <Crown className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-400" />}
          </div>

          {user?.isSuperAdmin && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white mb-3 text-xs">
              SUPER ADMIN
            </Badge>
          )}
          {user?.isAdmin && !user?.isSuperAdmin && (
            <Badge variant="secondary" className="mb-3 text-xs">
              Administrador
            </Badge>
          )}

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 touch-target text-xs lg:text-sm"
          >
            <LogOut className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </aside>
  )
}
