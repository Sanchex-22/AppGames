"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CalculatorIcon } from "lucide-react"
import { useCalculator } from "@/hooks/use-calculator"

export function Calculator() {
  const {
    capital,
    setCapital,
    percentage,
    setPercentage,
    rounds,
    setRounds,
    results,
    calculateInterest,
    updateCurrent,
    toggleCompleted,
    totalGoal,
    totalCurrent,
    completedRounds,
  } = useCalculator()

  return (
    <div className="space-y-4 lg:space-y-6">
      <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-white to-gray-100">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
            <CalculatorIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            Área de Cálculo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="capital" className="text-gray-800 font-semibold text-sm lg:text-base">
                Capital inicial ($)
              </Label>
              <Input
                id="capital"
                type="number"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                min="1"
                className="border-2 border-gray-400 focus:border-blue-600 touch-target"
              />
            </div>
            <div>
              <Label htmlFor="percentage" className="text-gray-800 font-semibold text-sm lg:text-base">
                Porcentaje por vuelta (%)
              </Label>
              <Input
                id="percentage"
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                min="1"
                className="border-2 border-gray-400 focus:border-blue-600 touch-target"
              />
            </div>
            <div>
              <Label htmlFor="rounds" className="text-gray-800 font-semibold text-sm lg:text-base">
                Número de vueltas
              </Label>
              <Input
                id="rounds"
                type="number"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                min="1"
                max="20"
                className="border-2 border-gray-400 focus:border-blue-600 touch-target"
              />
            </div>
            <Button
              onClick={calculateInterest}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
            >
              ✨ Calcular
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-gray-50 to-slate-200">
              <CardContent className="pt-4 lg:pt-6">
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold text-blue-700 mb-2">💰 ${totalGoal.toFixed(2)}</div>
                  <div className="text-xs lg:text-sm text-gray-700 font-semibold">Meta Final</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-slate-50 to-gray-200">
              <CardContent className="pt-4 lg:pt-6">
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold text-blue-700 mb-2">💵 ${totalCurrent.toFixed(2)}</div>
                  <div className="text-xs lg:text-sm text-gray-700 font-semibold">Total Actual</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-gray-100 to-slate-300">
              <CardContent className="pt-4 lg:pt-6">
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold text-black mb-2">
                    🎯 {completedRounds}/{results.length}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-700 font-semibold">Vueltas Completadas</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
            <CardHeader className="bg-gradient-to-r from-gray-900 to-black text-white rounded-t-lg">
              <CardTitle className="text-lg lg:text-xl">🚀 Tabla de Progreso</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 mobile-scroll">
                <div className="min-w-[800px] lg:min-w-0">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 bg-gradient-to-r from-gray-200 to-slate-300">
                        <th className="p-2 lg:p-4 text-left font-bold text-black text-sm lg:text-base">Vuelta</th>
                        <th className="p-2 lg:p-4 text-left font-bold text-black text-sm lg:text-base">Meta</th>
                        <th className="p-2 lg:p-4 text-left font-bold text-black text-sm lg:text-base">Lo que llevo</th>
                        <th className="p-2 lg:p-4 text-left font-bold text-black text-sm lg:text-base">Me falta</th>
                        <th className="p-2 lg:p-4 text-left font-bold text-black text-sm lg:text-base">
                          Idea sugerida
                        </th>
                        <th className="p-2 lg:p-4 text-center font-bold text-black text-sm lg:text-base">
                          ¿Completado?
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((round, index) => (
                        <tr
                          key={round.round}
                          className={`border-b-2 hover:bg-gradient-to-r transition-all duration-200 ${
                            round.completed
                              ? "bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300"
                              : "hover:from-gray-100 hover:to-slate-200"
                          }`}
                        >
                          <td className="p-2 lg:p-4 font-bold text-black text-sm lg:text-base">{round.round}</td>
                          <td className="p-2 lg:p-4 font-bold text-blue-700 text-sm lg:text-base">
                            ${round.goal.toFixed(2)}
                          </td>
                          <td className="p-2 lg:p-4">
                            <Input
                              type="number"
                              value={round.current || ""}
                              onChange={(e) => updateCurrent(index, Number(e.target.value) || 0)}
                              className="w-20 lg:w-28 border-2 border-gray-400 focus:border-blue-600 touch-target text-sm"
                              min="0"
                              disabled={round.completed}
                            />
                          </td>
                          <td className="p-2 lg:p-4 font-bold text-red-600 text-sm lg:text-base">
                            ${round.missing.toFixed(2)}
                          </td>
                          <td className="p-2 lg:p-4 text-xs lg:text-sm text-gray-800 font-medium">{round.idea}</td>
                          <td className="p-2 lg:p-4 text-center">
                            <Checkbox
                              checked={round.completed}
                              onCheckedChange={() => toggleCompleted(index)}
                              className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 touch-target"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
