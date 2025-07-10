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
import { Login } from "@/components/sections/login"
import { useAuth } from "@/hooks/use-auth"

export default function AppGames() {
  const [activeSection, setActiveSection] = useState("calculadora")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isLoggedIn, isAdmin, isSuperAdmin } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-lg border-2 border-gray-400 hover:border-blue-600 touch-target p-2 rounded-lg"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        <Header />

        <div className="p-4 lg:p-6 safe-area-inset mobile-scroll">
          {activeSection === "calculadora" && <Calculator />}
          {activeSection === "progreso" && <Progress />}
          {activeSection === "ideas" && <Ideas />}
          {activeSection === "motivacion" && <Motivation />}
          {activeSection === "chat" && <Chat />}
          {activeSection === "admin" && isAdmin && <AdminPanel />}
          {activeSection === "login" && <Login />}
        </div>
      </main>
    </div>
  )
}
