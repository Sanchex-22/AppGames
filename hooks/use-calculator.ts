"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "./use-local-storage"
import { useAuth } from "./use-auth"

interface RoundData {
  round: number
  goal: number
  current: number
  missing: number
  idea: string
  completed: boolean
}

interface UserProgress {
  capital: number
  percentage: number
  rounds: number
  results: RoundData[]
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

export function useCalculator() {
  const { user, isLoggedIn } = useAuth()
  const [businessIdeas] = useLocalStorage("businessIdeas", defaultBusinessIdeas)
  const [capital, setCapital] = useState(10)
  const [percentage, setPercentage] = useState(100)
  const [rounds, setRounds] = useState(7)
  const [results, setResults] = useState<RoundData[]>([])
  const [overallProgress, setOverallProgress] = useState(0)

  // Load user progress when logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      const savedProgress = localStorage.getItem(`progreso_${user.username}`)
      if (savedProgress) {
        const progressData: UserProgress = JSON.parse(savedProgress)
        setCapital(progressData.capital)
        setPercentage(progressData.percentage)
        setRounds(progressData.rounds)
        setResults(progressData.results)
      }
    }
  }, [isLoggedIn, user])

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

    const totalGoalAmount = updatedResults.reduce((sum, round) => sum + round.goal, 0)
    const totalCurrentAmount = updatedResults.reduce((sum, round) => sum + round.current, 0)
    const progressPercentage = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0
    setOverallProgress(progressPercentage)

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

    const totalGoalAmount = updatedResults.reduce((sum, round) => sum + round.goal, 0)
    const totalCurrentAmount = updatedResults.reduce((sum, round) => sum + round.current, 0)
    const progressPercentage = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0
    setOverallProgress(progressPercentage)

    saveProgress(updatedResults)
  }

  const saveProgress = (updatedResults: RoundData[]) => {
    if (isLoggedIn && user) {
      const progressData: UserProgress = {
        capital,
        percentage,
        rounds,
        results: updatedResults,
      }
      localStorage.setItem(`progreso_${user.username}`, JSON.stringify(progressData))
    }
  }

  const totalGoal = results.length > 0 ? results[results.length - 1].goal : 0
  const totalCurrent = results.reduce((sum, round) => sum + round.current, 0)
  const completedRounds = results.filter((round) => round.completed).length

  return {
    capital,
    setCapital,
    percentage,
    setPercentage,
    rounds,
    setRounds,
    results,
    overallProgress,
    calculateInterest,
    updateCurrent,
    toggleCompleted,
    totalGoal,
    totalCurrent,
    completedRounds,
  }
}
