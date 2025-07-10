"use client"

import { useState, useEffect } from "react"

const defaultMotivationalQuotes = [
  "El éxito es la suma de pequeños esfuerzos repetidos cada día.",
  "No te detengas, estás más cerca de lo que crees.",
  "Todo logro empieza con la decisión de intentarlo.",
  "Cuando sientas que vas a rendirte, recuerda por qué empezaste.",
  "La disciplina es el puente entre metas y logros.",
  "Cada día es una nueva oportunidad para crecer.",
  "Los pequeños pasos diarios llevan a grandes cambios.",
  "Tu futuro se crea por lo que haces hoy, no mañana.",
  "El dinero que no arriesgas, no puede multiplicarse.",
  "La paciencia y la perseverancia tienen un efecto mágico.",
  "No esperes el momento perfecto, toma el momento y hazlo perfecto.",
  "El interés compuesto es la octava maravilla del mundo.",
  "Invierte en ti mismo, es la mejor inversión que puedes hacer.",
  "Cada peso ahorrado es un paso hacia tu libertad financiera.",
  "Los ricos invierten su dinero y gastan lo que sobra, los pobres gastan su dinero e invierten lo que sobra.",
  "No trabajes por dinero, haz que el dinero trabaje para ti.",
  "La riqueza no se mide por lo que ganas, sino por lo que conservas e inviertes.",
  "Empieza donde estás, usa lo que tienes, haz lo que puedas.",
  "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.",
  "No se trata de cuánto ganas, sino de cuánto guardas y cómo lo haces crecer.",
]

export function Motivation() {
  const [currentQuote, setCurrentQuote] = useState("")
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [motivationalQuotes, setMotivationalQuotes] = useState<string[]>(defaultMotivationalQuotes)

  useEffect(() => {
    // Cargar frases guardadas
    const savedQuotes = localStorage.getItem("motivationalQuotes")
    if (savedQuotes) {
      setMotivationalQuotes(JSON.parse(savedQuotes))
    }
  }, [])

  useEffect(() => {
    if (motivationalQuotes.length > 0) {
      getRandomQuote()
    }
  }, [motivationalQuotes])

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    setQuoteIndex(randomIndex)
    setCurrentQuote(motivationalQuotes[randomIndex\
