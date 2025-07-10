import { type NextRequest, NextResponse } from "next/server"
import { sessionQueries } from "@/lib/database"
export const dynamic = 'force-static';
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    // Remover sesión activa
    sessionQueries.removeSession.run(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error during logout:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
