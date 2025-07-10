import { NextResponse } from "next/server"
import { sessionQueries } from "@/lib/database"
export const dynamic = 'force-static';
export async function GET() {
  try {
    // Limpiar sesiones inactivas primero
    sessionQueries.cleanupInactive.run()

    // Obtener usuarios en línea
    const onlineUsers = sessionQueries.getOnlineUsers.all()
    const usernames = onlineUsers.map((user) => user.username)

    return NextResponse.json({ onlineUsers: usernames })
  } catch (error) {
    console.error("Error fetching online users:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
