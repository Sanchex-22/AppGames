"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, CheckCircle } from "lucide-react"

interface RoundData {
  round: number
  goal: number
  current: number
  missing: number
  idea: string
  completed: boolean
}

interface ProgressProps {
  user: {
    username: string
    isAdmin: boolean
    isSuperAdmin: boolean
  }
}

export function Progress({ user }: ProgressProps) {
  const [results, setResults] = useState<RoundData[]>([])
  const [capital, setCapital] = useState(10)
  const [percentage, setPercentage] = useState(100)
  const [rounds, setRounds] = useState(7)
  const [overallProgress, setOverallProgress] = useState(0)

  useEffect(() => {
    const savedProgress = localStorage.getItem(`progreso_${user.username}`)
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress)
      setCapital(progressData.capital)
      setPercentage(progressData.percentage)
      setRounds(progressData.rounds)
      setResults(progressData.results)

      // Calcular progreso general
      const totalGoalAmount = progressData.results.reduce((sum: number, round: RoundData) => sum + round.goal, 0)
      const totalCurrentAmount = progressData.results.reduce((sum: number, round: RoundData) => sum + round.current, 0)
      const progressPercentage = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0
      setOverallProgress(progressPercentage)
    }
  }, [user.username])

  const totalGoal = results.length > 0 ? results[results.length - 1].goal : 0
  const totalCurrent = results.reduce((sum, round) => sum + round.current, 0)
  const completedRounds = results.filter((round) => round.completed).length

  if (results.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">
            <TrendingUp className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg lg:text-xl font-bold mb-2 text-white">🚀 No hay plan activo</p>
            <p className="text-gray-400 text-sm lg:text-base">
              Ve a la sección "Calculadora" para crear tu plan de inversión
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="bg-gray-800 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl text-white">
            <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />🎯 Resumen de tu Plan: {rounds} Vueltas - ${capital} Inicial
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 lg:p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="text-xl lg:text-3xl font-bold text-white mb-2">🏆 {completedRounds}</div>
              <div className="text-xs lg:text-sm text-gray-400 font-semibold">Vueltas Completadas</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="text-xl lg:text-3xl font-bold text-white mb-2">💰 ${totalCurrent.toFixed(2)}</div>
              <div className="text-xs lg:text-sm text-gray-400 font-semibold">Total Acumulado</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="text-xl lg:text-3xl font-bold text-white mb-2">🎯 ${totalGoal.toFixed(2)}</div>
              <div className="text-xs lg:text-sm text-gray-400 font-semibold">Meta Final</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="text-xl lg:text-3xl font-bold text-white mb-2">📊 {overallProgress.toFixed(1)}%</div>
              <div className="text-xs lg:text-sm text-gray-400 font-semibold">Progreso Total</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2 font-semibold">
              <span>🚀 Progreso General</span>
              <span>{overallProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 lg:h-6">
              <div
                className="bg-white h-4 lg:h-6 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="bg-gray-800 border-b border-gray-700">
          <CardTitle className="text-lg lg:text-xl text-white">📈 Progreso Detallado por Vuelta</CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <div className="space-y-4">
            {results.map((round) => {
              const roundProgress = round.goal > 0 ? (round.current / round.goal) * 100 : 0
              const isCompleted = round.completed
              const isInProgress = round.current > 0 && !isCompleted

              return (
                <div
                  key={round.round}
                  className={`p-4 lg:p-6 border rounded-xl transition-all duration-300 ${
                    isCompleted
                      ? "bg-gray-800 border-gray-600"
                      : isInProgress
                        ? "bg-gray-800 border-gray-600"
                        : "bg-gray-900 border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-base lg:text-lg ${
                          isCompleted ? "bg-white text-black" : "bg-gray-700 text-white"
                        }`}
                      >
                        {isCompleted ? "✅" : round.round}
                      </div>
                      <div>
                        <h4 className="font-bold text-base lg:text-lg text-white">🎯 Vuelta {round.round}</h4>
                        <p className="text-xs lg:text-sm text-gray-400 font-medium">💡 {round.idea}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg lg:text-xl text-white">${round.goal.toFixed(2)}</div>
                      <div className="text-xs lg:text-sm text-gray-400 font-semibold">Meta</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs lg:text-sm text-gray-300 mb-2 font-semibold">
                        <span>
                          💵 ${round.current.toFixed(2)} de ${round.goal.toFixed(2)}
                        </span>
                        <span>{roundProgress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 lg:h-4">
                        <div
                          className="bg-white h-3 lg:h-4 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(roundProgress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    {round.missing > 0 && (
                      <div className="text-right">
                        <div className="text-xs lg:text-sm font-bold text-red-400">
                          ❌ Faltan: ${round.missing.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  {isCompleted && (
                    <div className="flex items-center gap-2 text-white text-xs lg:text-sm font-bold bg-gray-700 p-2 rounded-lg">
                      <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />🎉 ¡Vuelta completada! ¡Excelente trabajo!
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
