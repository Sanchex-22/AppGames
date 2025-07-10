import { type NextRequest, NextResponse } from "next/server"
import { transactions } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { ideaId, userId } = await request.json()

    // Toggle like usando transacción
    const likeAdded = transactions.toggleIdeaLike(Number.parseInt(ideaId), userId)

    return NextResponse.json({
      success: true,
      likeAdded,
      message: likeAdded ? "Like agregado" : "Like removido",
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
