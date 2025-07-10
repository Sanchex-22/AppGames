import { type NextRequest, NextResponse } from "next/server"
import { userQueries, sessionQueries } from "@/lib/database"
export const dynamic = 'force-static';
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Buscar usuario
    const user = userQueries.getByUsername.get(username)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Actualizar último login
    userQueries.updateLastLogin.run(user.id)

    // Crear/actualizar sesión activa
    sessionQueries.upsertSession.run(user.id, user.username)

    // Limpiar sesiones inactivas
    sessionQueries.cleanupInactive.run()

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin,
        isSuperAdmin: user.is_super_admin,
        email: user.email,
        fullName: user.full_name,
      },
    })
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
