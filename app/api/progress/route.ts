import { type NextRequest, NextResponse } from "next/server"
import { progressQueries, roundQueries, transactions } from "@/lib/database"
export const dynamic = 'force-static';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID requerido" }, { status: 400 })
    }

    // Obtener progreso activo
    const progress = progressQueries.getActiveByUserId.get(Number.parseInt(userId))

    if (!progress) {
      return NextResponse.json({ progress: null })
    }

    // Obtener rondas
    const rounds = roundQueries.getByProgressId.all(progress.id)

    return NextResponse.json({
      progress: {
        capital: progress.capital,
        percentage: progress.percentage,
        rounds: progress.rounds,
        results: rounds.map((round) => ({
          round: round.round_number,
          goal: round.goal_amount,
          current: round.current_amount,
          missing: round.missing_amount,
          idea: round.suggested_idea,
          completed: round.is_completed,
        })),
      },
    })
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, capital, percentage, rounds, results } = await request.json()

    // Crear progreso con rondas usando transacción
    const progressId = transactions.createProgressWithRounds(userId, capital, percentage, rounds, results)

    return NextResponse.json({
      success: true,
      progressId,
      message: "Progreso guardado exitosamente",
    })
  } catch (error) {
    console.error("Error saving progress:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
