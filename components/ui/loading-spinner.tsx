"use client"

import { TrendingUp } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center animate-pulse mb-4 mx-auto">
          <TrendingUp className="h-8 w-8 lg:h-10 lg:w-10 text-white animate-bounce" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Club de Interés Compuesto</h2>
        <p className="text-gray-600 text-sm lg:text-base">Cargando aplicación...</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  )
}
