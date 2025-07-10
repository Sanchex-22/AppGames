"use client"

import { TrendingUp } from "lucide-react"

export function Header() {
  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-slate-800 text-white shadow-2xl">
      <div className="px-4 lg:px-6 py-4 lg:py-6 safe-area-inset">
        <div className="flex items-center justify-center gap-2 lg:gap-3 lg:ml-0 ml-12">
          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center animate-pulse">
            <TrendingUp className="h-5 w-5 lg:h-8 lg:w-8 text-white" />
          </div>
          <h1 className="text-lg lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
            Club de Interés Compuesto
          </h1>
        </div>
      </div>
    </header>
  )
}
