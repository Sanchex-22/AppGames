"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Lightbulb, Plus, Users, Heart, Trash2 } from "lucide-react"

interface IdeasProps {
  user: {
    username: string
    isAdmin: boolean
    isSuperAdmin: boolean
  }
}

const defaultBusinessIdeas = [
  "Vende café o empanadas",
  "Revende cargadores o accesorios",
  "Haz trabajos rápidos por encargo",
  "Ofrece clases o tutorías",
  "Vende productos por catálogo",
  "Crea diseños o currículums",
  "Revende ropa usada o reacondicionada",
]

export function Ideas({ user }: IdeasProps) {
  const [businessIdeas, setBusinessIdeas] = useState<string[]>(defaultBusinessIdeas)
  const [userIdeas, setUserIdeas] = useState<
    Array<{ id: string; idea: string; author: string; timestamp: Date; likes: number; likedBy: string[] }>
  >([])
  const [newUserIdea, setNewUserIdea] = useState("")

  useEffect(() => {
    // Cargar ideas de negocio
    const savedIdeas = localStorage.getItem("businessIdeas")
    if (savedIdeas) {
      setBusinessIdeas(JSON.parse(savedIdeas))
    }

    // Cargar ideas compartidas por usuarios
    const savedUserIdeas = localStorage.getItem("userSharedIdeas")
    if (savedUserIdeas) {
      setUserIdeas(JSON.parse(savedUserIdeas))
    }
  }, [])

  const shareUserIdea = () => {
    if (newUserIdea.trim()) {
      const idea = {
        id: Date.now().toString(),
        idea: newUserIdea.trim(),
        author: user.username,
        timestamp: new Date(),
        likes: 0,
        likedBy: [],
      }
      const updatedUserIdeas = [idea, ...userIdeas]
      setUserIdeas(updatedUserIdeas)
      localStorage.setItem("userSharedIdeas", JSON.stringify(updatedUserIdeas))
      setNewUserIdea("")
    }
  }

  const likeUserIdea = (ideaId: string) => {
    const updatedUserIdeas = userIdeas.map((idea) => {
      if (idea.id === ideaId) {
        const hasLiked = idea.likedBy.includes(user.username)
        if (hasLiked) {
          return {
            ...idea,
            likes: idea.likes - 1,
            likedBy: idea.likedBy.filter((username) => username !== user.username),
          }
        } else {
          return {
            ...idea,
            likes: idea.likes + 1,
            likedBy: [...idea.likedBy, user.username],
          }
        }
      }
      return idea
    })

    setUserIdeas(updatedUserIdeas)
    localStorage.setItem("userSharedIdeas", JSON.stringify(updatedUserIdeas))
  }

  const deleteUserIdea = (ideaId: string, author: string) => {
    if (user.username === author || user.isAdmin) {
      const updatedUserIdeas = userIdeas.filter((idea) => idea.id !== ideaId)
      setUserIdeas(updatedUserIdeas)
      localStorage.setItem("userSharedIdeas", JSON.stringify(updatedUserIdeas))
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Ideas Predeterminadas del Sistema */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="bg-gray-800 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl text-white">
            <Lightbulb className="h-4 w-4 lg:h-5 lg:w-5" />💡 Ideas de Negocio Sugeridas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessIdeas.map((idea, index) => (
              <div
                key={index}
                className="p-4 lg:p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-300"
              >
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-base lg:text-lg">
                    {index + 1}
                  </div>
                  <span className="text-white font-bold text-sm lg:text-lg">{idea}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Área para Compartir Ideas de Usuarios */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="bg-gray-800 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl text-white">
            <Plus className="h-4 w-4 lg:h-5 lg:w-5" />🚀 Comparte tu Idea de Negocio
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 font-semibold mb-2 block text-sm lg:text-base">
                💭 ¿Tienes una idea de negocio? ¡Compártela con la comunidad!
              </Label>
              <Textarea
                value={newUserIdea}
                onChange={(e) => setNewUserIdea(e.target.value)}
                placeholder="Describe tu idea de negocio aquí... Por ejemplo: 'Vender postres caseros por WhatsApp' o 'Ofrecer servicios de limpieza los fines de semana'"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-[100px] touch-target"
                rows={4}
              />
            </div>
            <Button
              onClick={shareUserIdea}
              disabled={!newUserIdea.trim()}
              className="w-full bg-white text-black hover:bg-gray-200 touch-target"
            >
              <Plus className="h-4 w-4 mr-2" />✨ Compartir Mi Idea
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ideas Compartidas por la Comunidad */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="bg-gray-800 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl text-white">
            <Users className="h-4 w-4 lg:h-5 lg:w-5" />👥 Ideas Compartidas por la Comunidad ({userIdeas.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          {userIdeas.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto mobile-scroll">
              {userIdeas.map((userIdea) => (
                <div key={userIdea.id} className="p-4 lg:p-6 bg-gray-800 border border-gray-700 rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white text-black rounded-full flex items-center justify-center font-bold">
                        {userIdea.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm lg:text-base">{userIdea.author}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(userIdea.timestamp).toLocaleDateString()} a las{" "}
                          {new Date(userIdea.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    {(user.username === userIdea.author || user.isAdmin) && (
                      <Button
                        onClick={() => deleteUserIdea(userIdea.id, userIdea.author)}
                        size="sm"
                        variant="destructive"
                        className="opacity-70 hover:opacity-100 touch-target"
                      >
                        <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 font-medium text-sm lg:text-lg leading-relaxed">💡 "{userIdea.idea}"</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => likeUserIdea(userIdea.id)}
                      variant="outline"
                      size="sm"
                      className={`flex items-center gap-2 touch-target text-xs lg:text-sm ${
                        userIdea.likedBy.includes(user.username)
                          ? "bg-red-900 border-red-600 text-red-300 hover:bg-red-800"
                          : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <Heart
                        className={`h-3 w-3 lg:h-4 lg:w-4 ${
                          userIdea.likedBy.includes(user.username) ? "fill-red-400 text-red-400" : ""
                        }`}
                      />
                      {userIdea.likes} Me gusta
                    </Button>

                    {userIdea.likes > 0 && (
                      <div className="text-xs text-gray-400">
                        👥 {userIdea.likedBy.slice(0, 3).join(", ")}
                        {userIdea.likedBy.length > 3 && ` y ${userIdea.likedBy.length - 3} más`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 text-gray-600" />
              <p className="text-lg lg:text-xl font-bold text-white mb-2">🌟 ¡Sé el primero!</p>
              <p className="text-gray-400 text-sm lg:text-base">Aún no hay ideas compartidas por la comunidad.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
