export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-white mb-2">Club de Interés Compuesto</h1>
        <p className="text-gray-400">Cargando...</p>
      </div>
    </div>
  )
}
