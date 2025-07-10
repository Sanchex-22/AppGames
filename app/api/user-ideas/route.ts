import { type NextRequest, NextResponse } from "next/server"
import { userIdeaQueries, chatQueries } from "@/lib/database"
export const dynamic = 'force-static';

export async function GET() {
  try {
    const ideas = userIdeaQueries.getAllWithDetails.all()

    // Procesar los datos para el formato esperado por el frontend
    const processedIdeas = ideas.map((idea) => ({
      id: idea.id.toString(),
      idea: idea.idea_text,
      author: idea.author_name,
      timestamp: new Date(idea.created_at),
      likes: idea.likes_count || 0,
      likedBy: idea.liked_by_users ? idea.liked_by_users.split(",") : [],
    }))

    return NextResponse.json({ ideas: processedIdeas })
  } catch (error) {
    console.error("Error fetching user ideas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ideaText, authorId, authorName, category = "general" } = await request.json()

    // Crear la idea
    const result = userIdeaQueries.create.run(ideaText, authorId, category)

    // Crear mensaje en el chat
    chatQueries.create.run(null, "💡 Sistema", `${authorName} compartió una nueva idea: "${ideaText}"`, "system")

    return NextResponse.json({
      success: true,
      ideaId: result.lastInsertRowid,
      message: "Idea compartida exitosamente",
    })
  } catch (error) {
    console.error("Error creating user idea:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    userIdeaQueries.delete.run(id)

    return NextResponse.json({ success: true, message: "Idea eliminada exitosamente" })
  } catch (error) {
    console.error("Error deleting user idea:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
