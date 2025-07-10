"use client"

import { TrendingUp } from "lucide-react"

export function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-700 text-white">
      <div className="px-4 lg:px-6 py-4 lg:py-6 safe-area-inset">
        <div className="flex items-center justify-center gap-2 lg:gap-3 lg:ml-0 ml-12">
          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
            <TrendingUp className="h-5 w-5 lg:h-8 lg:w-8 text-black" />
          </div>
          <h1 className="text-lg lg:text-3xl font-bold text-white">Club de Interés Compuesto</h1>
        </div>
      </div>
    </header>
  )
}
