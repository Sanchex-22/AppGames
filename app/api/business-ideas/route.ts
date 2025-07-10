import { type NextRequest, NextResponse } from "next/server"
import { businessIdeaQueries } from "@/lib/database"
export const dynamic = 'force-static';
export async function GET() {
  try {
    const ideas = businessIdeaQueries.getAll.all()
    return NextResponse.json({ ideas })
  } catch (error) {
    console.error("Error fetching business ideas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ideaText, createdBy } = await request.json()

    const result = businessIdeaQueries.create.run(ideaText, createdBy)

    return NextResponse.json({
      success: true,
      ideaId: result.lastInsertRowid,
      message: "Idea creada exitosamente",
    })
  } catch (error) {
    console.error("Error creating business idea:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ideaText } = await request.json()

    businessIdeaQueries.update.run(ideaText, id)

    return NextResponse.json({ success: true, message: "Idea actualizada exitosamente" })
  } catch (error) {
    console.error("Error updating business idea:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    businessIdeaQueries.delete.run(id)

    return NextResponse.json({ success: true, message: "Idea eliminada exitosamente" })
  } catch (error) {
    console.error("Error deleting business idea:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
