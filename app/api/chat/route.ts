import { type NextRequest, NextResponse } from "next/server"
import { chatQueries } from "@/lib/database"
export const dynamic = 'force-static';
export async function GET() {
  try {
    const messages = chatQueries.getRecent.all()

    // Procesar mensajes para el formato esperado
    const processedMessages = messages
      .map((msg) => ({
        id: msg.id.toString(),
        user: msg.username,
        message: msg.message,
        timestamp: new Date(msg.created_at),
      }))
      .reverse() // Orden cronológico

    return NextResponse.json({ messages: processedMessages })
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, username, message, messageType = "user" } = await request.json()

    const result = chatQueries.create.run(userId, username, message, messageType)

    // Limpiar mensajes antiguos ocasionalmente
    if (Math.random() < 0.1) {
      // 10% de probabilidad
      chatQueries.cleanup.run()
    }

    return NextResponse.json({
      success: true,
      messageId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error("Error creating chat message:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
