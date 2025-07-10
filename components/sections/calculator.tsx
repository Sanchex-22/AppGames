"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CalculatorIcon } from "lucide-react"

interface RoundData {
  round: number
  goal: number
  current: number
  missing: number
  idea: string
  completed: boolean
}

interface CalculatorProps {
  user: {
    username: string
    isAdmin: boolean
    isSuperAdmin: boolean
  }
}

const defaultBusinessIdeas = [
  "Vende café o empanadas",
  "Revende cargadores o accesorios",
  "Haz trabajos rápidos por encargo",
  "Ofrece clases o tutorías",
  "Vende productos por catálogo",
  "Crea diseños o currículums",
  "Revende ropa usada o reacondicionada",
]

export function CalculatorComponent({ user }: CalculatorProps) {
  const [capital, setCapital] = useState(10)
  const [percentage, setPercentage] = useState(100)
  const [rounds, setRounds] = useState(7)
  const [results, setResults] = useState<RoundData[]>([])
  const [businessIdeas, setBusinessIdeas] = useState<string[]>(defaultBusinessIdeas)

  useEffect(() => {
    // Cargar ideas de negocio guardadas
    const savedIdeas = localStorage.getItem("businessIdeas")
    if (savedIdeas) {
      setBusinessIdeas(JSON.parse(savedIdeas))
    }

    // Cargar progreso del usuario
    const savedProgress = localStorage.getItem(`progreso_${user.username}`)
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress)
      setCapital(progressData.capital)
      setPercentage(progressData.percentage)
      setRounds(progressData.rounds)
      setResults(progressData.results)
    }
  }, [user.username])

  const calculateInterest = () => {
    const newResults: RoundData[] = []
    let currentAmount = capital

    for (let i = 1; i <= rounds; i++) {
      const goal = currentAmount * (1 + percentage / 100)
      const idea = businessIdeas[(i - 1) % businessIdeas.length]

      newResults.push({
        round: i,
        goal: goal,
        current: 0,
        missing: goal,
        idea: idea,
        completed: false,
      })

      currentAmount = goal
    }

    setResults(newResults)
    saveProgress(newResults)
  }

  const updateCurrent = (index: number, value: number) => {
    const updatedResults = [...results]
    updatedResults[index].current = value
    updatedResults[index].missing = Math.max(updatedResults[index].goal - value, 0)
    setResults(updatedResults)
    saveProgress(updatedResults)
  }

  const toggleCompleted = (index: number) => {
    const updatedResults = [...results]
    const wasCompleted = updatedResults[index].completed
    updatedResults[index].completed = !updatedResults[index].completed

    if (!wasCompleted && updatedResults[index].completed) {
      updatedResults[index].current = updatedResults[index].goal
      updatedResults[index].missing = 0
    } else if (wasCompleted && !updatedResults[index].completed) {
      updatedResults[index].current = 0
      updatedResults[index].missing = updatedResults[index].goal
    }

    setResults(updatedResults)
    saveProgress(updatedResults)
  }

  const saveProgress = (resultsData: RoundData[]) => {
    const progressData = {
      capital,
      percentage,
      rounds,
      results: resultsData,
    }
    localStorage.setItem(`progreso_${user.username}`, JSON.stringify(progressData))
  }

  const totalGoal = results.length > 0 ? results[results.length - 1].goal : 0
  const totalCurrent = results.reduce((sum, round) => sum + round.current, 0)
  const completedRounds = results.filter((round) => round.completed).length

  return (
    <div className="space-y-4 lg:space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="bg-gray-800 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl text-white">
            <CalculatorIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            Área de Cálculo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="capital" className="text-gray-300 font-semibold text-sm lg:text-base">
                Capital inicial ($)
              </Label>
              <Input
                id="capital"
                type="number"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                min="1"
                className="bg-gray-800 border-gray-600 text-white touch-target"
              />
            </div>
            <div>
              <Label htmlFor="percentage" className="text-gray-300 font-semibold text-sm lg:text-base">
                Porcentaje por vuelta (%)
              </Label>
              <Input
                id="percentage"
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                min="1"
                className="bg-gray-800 border-gray-600 text-white touch-target"
              />
            </div>
            <div>
              <Label htmlFor="rounds" className="text-gray-300 font-semibold text-sm lg:text-base">
                Número de vueltas
              </Label>
              <Input
                id="rounds"
                type="number"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                min="1"
                max="20"
                className="bg-gray-800 border-gray-600 text-white touch-target"
              />
            </div>
            <Button onClick={calculateInterest} className="bg-white text-black hover:bg-gray-200 touch-target">
              ✨ Calcular
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="pt-4 lg:pt-6">
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold text-white mb-2">💰 ${totalGoal.toFixed(2)}</div>
                  <div className="text-xs lg:text-sm text-gray-400 font-semibold">Meta Final</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="pt-4 lg:pt-6">
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold text-white mb-2">💵 ${totalCurrent.toFixed(2)}</div>
                  <div className="text-xs lg:text-sm text-gray-400 font-semibold">Total Actual</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="pt-4 lg:pt-6">
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold text-white mb-2">
                    🎯 {completedRounds}/{results.length}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-400 font-semibold">Vueltas Completadas</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="bg-gray-800 border-b border-gray-700">
              <CardTitle className="text-lg lg:text-xl text-white">🚀 Tabla de Progreso</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 mobile-scroll">
                <div className="min-w-[800px] lg:min-w-0">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-700">
                        <th className="p-2 lg:p-4 text-left font-bold text-white text-sm lg:text-base">Vuelta</th>
                        <th className="p-2 lg:p-4 text-left font-bold text-white text-sm lg:text-base">Meta</th>
                        <th className="p-2 lg:p-4 text-left font-bold text-white text-sm lg:text-base">Lo que llevo</th>
                        <th className="p-2 lg:p-4 text-left font-bold text-white text-sm lg:text-base">Me falta</th>
                        <th className="p-2 lg:p-4 text-left font-bold text-white text-sm lg:text-base">
                          Idea sugerida
                        </th>
                        <th className="p-2 lg:p-4 text-center font-bold text-white text-sm lg:text-base">
                          ¿Completado?
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((round, index) => (
                        <tr
                          key={round.round}
                          className={`border-b border-gray-700 hover:bg-gray-800 transition-all duration-200 ${
                            round.completed ? "bg-gray-800" : ""
                          }`}
                        >
                          <td className="p-2 lg:p-4 font-bold text-white text-sm lg:text-base">{round.round}</td>
                          <td className="p-2 lg:p-4 font-bold text-white text-sm lg:text-base">
                            ${round.goal.toFixed(2)}
                          </td>
                          <td className="p-2 lg:p-4">
                            <Input
                              type="number"
                              value={round.current || ""}
                              onChange={(e) => updateCurrent(index, Number(e.target.value) || 0)}
                              className="w-20 lg:w-28 bg-gray-800 border-gray-600 text-white touch-target text-sm"
                              min="0"
                              disabled={round.completed}
                            />
                          </td>
                          <td className="p-2 lg:p-4 font-bold text-red-400 text-sm lg:text-base">
                            ${round.missing.toFixed(2)}
                          </td>
                          <td className="p-2 lg:p-4 text-xs lg:text-sm text-gray-300 font-medium">{round.idea}</td>
                          <td className="p-2 lg:p-4 text-center">
                            <Checkbox
                              checked={round.completed}
                              onCheckedChange={() => toggleCompleted(index)}
                              className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-gray-600 data-[state=checked]:bg-white data-[state=checked]:border-white touch-target"
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
