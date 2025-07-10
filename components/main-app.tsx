"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Calculator } from "@/components/sections/calculator"
import { Progress } from "@/components/sections/progress"
import { Ideas } from "@/components/sections/ideas"
import { Motivation } from "@/components/sections/motivation"
import { Chat } from "@/components/sections/chat"
import { AdminPanel } from "@/components/sections/admin-panel"
import { Menu, X } from "lucide-react"

interface MainAppProps {
  user: {
    username: string
    isAdmin: boolean
    isSuperAdmin: boolean
  }
  onLogout: () => void
}

export function MainApp({ user, onLogout }: MainAppProps) {
  const [activeSection, setActiveSection] = useState("calculadora")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gray-900 border border-gray-700 hover:border-white touch-target p-2 rounded-lg text-white"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={onLogout}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        <Header />

        <div className="p-4 lg:p-6 safe-area-inset mobile-scroll">
          {activeSection === "calculadora" && <Calculator user={user} />}
          {activeSection === "progreso" && <Progress user={user} />}
          {activeSection === "ideas" && <Ideas user={user} />}
          {activeSection === "motivacion" && <Motivation />}
          {activeSection === "chat" && <Chat user={user} />}
          {activeSection === "admin" && user.isAdmin && <AdminPanel user={user} />}
        </div>
      </main>
    </div>
  )
}
