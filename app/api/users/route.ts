import { type NextRequest, NextResponse } from "next/server"
import { userQueries } from "@/lib/database"
export const dynamic = 'force-static';
export async function GET() {
  try {
    const users = userQueries.getAll.all()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, isAdmin, email, fullName } = await request.json()

    // Verificar si el usuario ya existe
    const existingUser = userQueries.getByUsername.get(username)
    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 })
    }

    // Crear nuevo usuario
    const result = userQueries.create.run(username, password, isAdmin || false, email || null, fullName || null)

    return NextResponse.json({
      success: true,
      userId: result.lastInsertRowid,
      message: "Usuario creado exitosamente",
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
