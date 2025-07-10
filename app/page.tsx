"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Calculator,
  TrendingUp,
  Lightbulb,
  Heart,
  User,
  CheckCircle,
  XCircle,
  LogOut,
  X,
  MessageCircle,
  Send,
  Users,
  Shield,
  Trash2,
  Edit,
  Plus,
  Save,
  Crown,
  Copy,
  UserPlus,
  Hash,
  Eye,
  EyeOff,
  Zap,
  Target,
  Star,
  Trophy,
} from "lucide-react"

const defaultBusinessIdeas = [
  "Vende café o empanadas",
  "Revende cargadores o accesorios",
  "Haz trabajos rápidos por encargo",
  "Ofrece clases o tutorías",
  "Vende productos por catálogo",
  "Crea diseños o currículums",
  "Revende ropa usada o reacondicionada",
]

const defaultMotivationalQuotes = [
  "El éxito es la suma de pequeños esfuerzos repetidos cada día.",
  "No te detengas, estás más cerca de lo que crees.",
  "Todo logro empieza con la decisión de intentarlo.",
  "Cuando sientas que vas a rendirte, recuerda por qué empezaste.",
  "La disciplina es el puente entre metas y logros.",
  "Cada día es una nueva oportunidad para crecer.",
  "Los pequeños pasos diarios llevan a grandes cambios.",
  "Tu futuro se crea por lo que haces hoy, no mañana.",
  "El dinero que no arriesgas, no puede multiplicarse.",
  "La paciencia y la perseverancia tienen un efecto mágico.",
  "No esperes el momento perfecto, toma el momento y hazlo perfecto.",
  "El interés compuesto es la octava maravilla del mundo.",
  "Invierte en ti mismo, es la mejor inversión que puedes hacer.",
  "Cada peso ahorrado es un paso hacia tu libertad financiera.",
  "Los ricos invierten su dinero y gastan lo que sobra, los pobres gastan su dinero e invierten lo que sobra.",
  "No trabajes por dinero, haz que el dinero trabaje para ti.",
  "La riqueza no se mide por lo que ganas, sino por lo que conservas e inviertes.",
  "Empieza donde estás, usa lo que tienes, haz lo que puedas.",
  "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.",
  "No se trata de cuánto ganas, sino de cuánto guardas y cómo lo haces crecer.",
]

interface RoundData {
  round: number
  goal: number
  current: number
  missing: number
  idea: string
  completed: boolean
}

interface UserProgress {
  capital: number
  percentage: number
  rounds: number
  results: RoundData[]
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  groupId: string
}

interface AppUser {
  username: string
  password: string
  isAdmin: boolean
  createdAt: Date
  lastLogin?: Date
  currentGroup?: string
}

interface ChatGroup {
  id: string
  name: string
  code: string
  createdBy: string
  createdAt: Date
  members: string[]
  isPrivate: boolean
}

export default function CompoundInterestClub() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [activeSection, setActiveSection] = useState("calculadora")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [capital, setCapital] = useState(10)
  const [percentage, setPercentage] = useState(100)
  const [rounds, setRounds] = useState(7)
  const [results, setResults] = useState<RoundData[]>([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginMessage, setLoginMessage] = useState("")
  const [currentQuote, setCurrentQuote] = useState("")
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [businessIdeas, setBusinessIdeas] = useState<string[]>(defaultBusinessIdeas)
  const [motivationalQuotes, setMotivationalQuotes] = useState<string[]>(defaultMotivationalQuotes)
  const [appUsers, setAppUsers] = useState<AppUser[]>([])

  // Admin form states
  const [newIdeaText, setNewIdeaText] = useState("")
  const [newQuoteText, setNewQuoteText] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false)
  const [editingIdea, setEditingIdea] = useState<number | null>(null)
  const [editingQuote, setEditingQuote] = useState<number | null>(null)
  const [editIdeaText, setEditIdeaText] = useState("")
  const [editQuoteText, setEditQuoteText] = useState("")

  // User ideas states
  const [userIdeas, setUserIdeas] = useState<
    Array<{ id: string; idea: string; author: string; timestamp: Date; likes: number; likedBy: string[] }>
  >([])
  const [newUserIdea, setNewUserIdea] = useState("")

  // New states for groups and registration
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([])
  const [currentGroup, setCurrentGroup] = useState<string>("")
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showJoinGroup, setShowJoinGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupPrivate, setNewGroupPrivate] = useState(false)
  const [joinGroupCode, setJoinGroupCode] = useState("")
  const [showRegister, setShowRegister] = useState(false)
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [registerMessage, setRegisterMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Generate random group code
  const generateGroupCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    setQuoteIndex(randomIndex)
    setCurrentQuote(motivationalQuotes[randomIndex])
  }

  // Initialize data in localStorage
  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setIsLoggedIn(true)
      setLoggedInUser(userData.username)
      setIsAdmin(userData.isAdmin)
      setIsSuperAdmin(userData.isSuperAdmin)
    }

    // Initialize default admin user
    const defaultUsers: AppUser[] = [
      {
        username: "admin",
        password: "superder!!2",
        isAdmin: true,
        createdAt: new Date(),
        lastLogin: undefined,
        currentGroup: undefined,
      },
      {
        username: "jose",
        password: "clave1",
        isAdmin: false,
        createdAt: new Date(),
        lastLogin: undefined,
        currentGroup: undefined,
      },
      {
        username: "maria",
        password: "clave2",
        isAdmin: false,
        createdAt: new Date(),
        lastLogin: undefined,
        currentGroup: undefined,
      },
    ]

    const savedUsers = localStorage.getItem("appUsers")
    if (!savedUsers) {
      localStorage.setItem("appUsers", JSON.stringify(defaultUsers))
      setAppUsers(defaultUsers)
    } else {
      setAppUsers(JSON.parse(savedUsers))
    }

    // Load business ideas
    const savedIdeas = localStorage.getItem("businessIdeas")
    if (savedIdeas) {
      setBusinessIdeas(JSON.parse(savedIdeas))
    } else {
      localStorage.setItem("businessIdeas", JSON.stringify(defaultBusinessIdeas))
    }

    // Load motivational quotes
    const savedQuotes = localStorage.getItem("motivationalQuotes")
    if (savedQuotes) {
      setMotivationalQuotes(JSON.parse(savedQuotes))
    } else {
      localStorage.setItem("motivationalQuotes", JSON.stringify(defaultMotivationalQuotes))
    }

    // Load chat messages
    const savedMessages = localStorage.getItem("chatMessages")
    if (savedMessages) {
      setChatMessages(JSON.parse(savedMessages))
    }

    // Load online users
    const savedOnlineUsers = localStorage.getItem("onlineUsers")
    if (savedOnlineUsers) {
      setOnlineUsers(JSON.parse(savedOnlineUsers))
    }

    // Load user shared ideas
    const savedUserIdeas = localStorage.getItem("userSharedIdeas")
    if (savedUserIdeas) {
      setUserIdeas(JSON.parse(savedUserIdeas))
    }

    // Load chat groups
    const savedGroups = localStorage.getItem("chatGroups")
    if (savedGroups) {
      const groups = JSON.parse(savedGroups)
      setChatGroups(groups)
      // Set default group if exists
      if (groups.length > 0) {
        setCurrentGroup(groups[0].id)
      }
    } else {
      // Create default general group
      const defaultGroup: ChatGroup = {
        id: "general",
        name: "General",
        code: "GENERAL",
        createdBy: "admin",
        createdAt: new Date(),
        members: [],
        isPrivate: false,
      }
      setChatGroups([defaultGroup])
      setCurrentGroup("general")
      localStorage.setItem("chatGroups", JSON.stringify([defaultGroup]))
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Update online users when login status changes
  useEffect(() => {
    if (isLoggedIn && loggedInUser) {
      const currentOnline = JSON.parse(localStorage.getItem("onlineUsers") || "[]")
      if (!currentOnline.includes(loggedInUser)) {
        const updatedOnline = [...currentOnline, loggedInUser]
        setOnlineUsers(updatedOnline)
        localStorage.setItem("onlineUsers", JSON.stringify(updatedOnline))
      }
    }
  }, [isLoggedIn, loggedInUser])

  useEffect(() => {
    if (motivationalQuotes.length > 0) {
      getRandomQuote()
    }
  }, [motivationalQuotes])

  useEffect(() => {
    if (activeSection === "motivacion" && motivationalQuotes.length > 0) {
      getRandomQuote()
    }
  }, [activeSection, motivationalQuotes])

  const calculateInterest = () => {
    const newResults: RoundData[] = []
    let currentAmount = capital

    for (let i = 1; i <= rounds; i++) {
      const goal = currentAmount * (1 + percentage / 100)
      const idea = businessIdeas[(i - 1) % businessIdeas.length]

      newResults.push({
        round: i,
        goal: goal,
        current: 0,
        missing: goal,
        idea: idea,
        completed: false,
      })

      currentAmount = goal
    }

    setResults(newResults)

    if (isLoggedIn && loggedInUser) {
      const progressData: UserProgress = {
        capital,
        percentage,
        rounds,
        results: newResults,
      }
      localStorage.setItem(`progreso_${loggedInUser}`, JSON.stringify(progressData))
    }
  }

  const updateCurrent = (index: number, value: number) => {
    const updatedResults = [...results]
    updatedResults[index].current = value
    updatedResults[index].missing = Math.max(updatedResults[index].goal - value, 0)
    setResults(updatedResults)

    const totalGoalAmount = updatedResults.reduce((sum, round) => sum + round.goal, 0)
    const totalCurrentAmount = updatedResults.reduce((sum, round) => sum + round.current, 0)
    const progressPercentage = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0
    setOverallProgress(progressPercentage)

    if (isLoggedIn && loggedInUser) {
      const progressData: UserProgress = {
        capital,
        percentage,
        rounds,
        results: updatedResults,
      }
      localStorage.setItem(`progreso_${loggedInUser}`, JSON.stringify(progressData))
    }
  }

  const toggleCompleted = (index: number) => {
    const updatedResults = [...results]
    const wasCompleted = updatedResults[index].completed
    updatedResults[index].completed = !updatedResults[index].completed

    if (!wasCompleted && updatedResults[index].completed) {
      updatedResults[index].current = updatedResults[index].goal
      updatedResults[index].missing = 0

      if (isLoggedIn && loggedInUser && currentGroup) {
        const celebrationMessage: ChatMessage = {
          id: Date.now().toString(),
          user: "🎉 Sistema",
          message: `¡${loggedInUser} completó la vuelta ${updatedResults[index].round} y alcanzó $${updatedResults[index].goal.toFixed(2)}! 🚀💰`,
          timestamp: new Date(),
          groupId: currentGroup,
        }
        const updatedMessages = [...chatMessages, celebrationMessage]
        setChatMessages(updatedMessages)
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages))
      }
    } else if (wasCompleted && !updatedResults[index].completed) {
      updatedResults[index].current = 0
      updatedResults[index].missing = updatedResults[index].goal
    }

    setResults(updatedResults)

    const totalGoalAmount = updatedResults.reduce((sum, round) => sum + round.goal, 0)
    const totalCurrentAmount = updatedResults.reduce((sum, round) => sum + round.current, 0)
    const progressPercentage = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0
    setOverallProgress(progressPercentage)

    if (isLoggedIn && loggedInUser) {
      const progressData: UserProgress = {
        capital,
        percentage,
        rounds,
        results: updatedResults,
      }
      localStorage.setItem(`progreso_${loggedInUser}`, JSON.stringify(progressData))
    }
  }

  const handleRegister = () => {
    if (!registerUsername.trim()) {
      setRegisterMessage("Por favor ingresa un nombre de usuario.")
      return
    }

    if (registerUsername.length < 3) {
      setRegisterMessage("El nombre de usuario debe tener al menos 3 caracteres.")
      return
    }

    if (!registerPassword.trim()) {
      setRegisterMessage("Por favor ingresa una contraseña.")
      return
    }

    if (registerPassword.length < 4) {
      setRegisterMessage("La contraseña debe tener al menos 4 caracteres.")
      return
    }

    if (registerPassword !== confirmPassword) {
      setRegisterMessage("Las contraseñas no coinciden.")
      return
    }

    // Check if user already exists
    const userExists = appUsers.find((u) => u.username.toLowerCase() === registerUsername.toLowerCase())
    if (userExists) {
      setRegisterMessage("Este nombre de usuario ya está en uso.")
      return
    }

    // Create new user
    const newUser: AppUser = {
      username: registerUsername.trim(),
      password: registerPassword,
      isAdmin: false,
      createdAt: new Date(),
      lastLogin: undefined,
      currentGroup: undefined,
    }

    const updatedUsers = [...appUsers, newUser]
    setAppUsers(updatedUsers)
    localStorage.setItem("appUsers", JSON.stringify(updatedUsers))

    setRegisterMessage("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.")
    setShowRegister(false)
    setRegisterUsername("")
    setRegisterPassword("")
    setConfirmPassword("")

    // Auto login
    setTimeout(() => {
      setUsername(newUser.username)
      setPassword(newUser.password)
      handleLoginFormSubmit()
    }, 1000)
  }

  const handleLoginFormSubmit = () => {
    const user = appUsers.find((u) => u.username === username && u.password === password)

    if (user) {
      setLoginMessage("¡Bienvenido, " + username + "!")
      setIsLoggedIn(true)
      setLoggedInUser(username)
      setIsAdmin(user.isAdmin)
      setIsSuperAdmin(user.username === "admin" && user.password === "superder!!2")
      loadProgress(username)
      setActiveSection("calculadora")

      // Guardar sesión
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          username: user.username,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.username === "admin" && user.password === "superder!!2",
        }),
      )

      // Update last login
      const updatedUsers = appUsers.map((u) => (u.username === username ? { ...u, lastLogin: new Date() } : u))
      setAppUsers(updatedUsers)
      localStorage.setItem("appUsers", JSON.stringify(updatedUsers))

      // Join user to current group if not already a member
      if (currentGroup) {
        joinUserToGroup(currentGroup, username)
      }

      if (currentGroup) {
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          user: "🌟 Sistema",
          message: `¡${username} se unió al grupo! ${user.isAdmin ? "👑 (Administrador)" : "👋"}`,
          timestamp: new Date(),
          groupId: currentGroup,
        }
        const updatedMessages = [...chatMessages, welcomeMessage]
        setChatMessages(updatedMessages)
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages))
      }
    } else {
      setLoginMessage("Usuario o contraseña incorrectos.")
      setIsLoggedIn(false)
    }
  }

  const loadProgress = (user: string) => {
    const savedProgress = localStorage.getItem(`progreso_${user}`)
    if (savedProgress) {
      const progressData: UserProgress = JSON.parse(savedProgress)
      setCapital(progressData.capital)
      setPercentage(progressData.percentage)
      setRounds(progressData.rounds)
      setResults(progressData.results)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setLoggedInUser("")
    setIsAdmin(false)
    setIsSuperAdmin(false)
    localStorage.removeItem("currentUser")

    const currentOnline = JSON.parse(localStorage.getItem("onlineUsers") || "[]")
    const updatedOnline = currentOnline.filter((user: string) => user !== loggedInUser)
    setOnlineUsers(updatedOnline)
    localStorage.setItem("onlineUsers", JSON.stringify(updatedOnline))

    setUsername("")
    setPassword("")
    setLoginMessage("")
    setResults([])
    setCapital(10)
    setPercentage(100)
    setRounds(7)
  }

  const sendMessage = () => {
    if (newMessage.trim() && isLoggedIn && currentGroup) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: loggedInUser,
        message: newMessage.trim(),
        timestamp: new Date(),
        groupId: currentGroup,
      }
      const updatedMessages = [...chatMessages, message]
      setChatMessages(updatedMessages)
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages))
      setNewMessage("")
    }
  }

  // Group management functions
  const createGroup = () => {
    if (!newGroupName.trim()) return

    const newGroup: ChatGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      code: generateGroupCode(),
      createdBy: loggedInUser,
      createdAt: new Date(),
      members: [loggedInUser],
      isPrivate: newGroupPrivate,
    }

    const updatedGroups = [...chatGroups, newGroup]
    setChatGroups(updatedGroups)
    localStorage.setItem("chatGroups", JSON.stringify(updatedGroups))

    setCurrentGroup(newGroup.id)
    setShowCreateGroup(false)
    setNewGroupName("")
    setNewGroupPrivate(false)

    // Create welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "🎉 Sistema",
      message: `¡Grupo "${newGroup.name}" creado por ${loggedInUser}! Código: ${newGroup.code}`,
      timestamp: new Date(),
      groupId: newGroup.id,
    }
    const updatedMessages = [...chatMessages, welcomeMessage]
    setChatMessages(updatedMessages)
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages))
  }

  const joinGroup = () => {
    if (!joinGroupCode.trim()) return

    const group = chatGroups.find((g) => g.code.toUpperCase() === joinGroupCode.toUpperCase())
    if (!group) {
      alert("Código de grupo no válido")
      return
    }

    if (group.members.includes(loggedInUser)) {
      setCurrentGroup(group.id)
      setShowJoinGroup(false)
      setJoinGroupCode("")
      return
    }

    joinUserToGroup(group.id, loggedInUser)
    setCurrentGroup(group.id)
    setShowJoinGroup(false)
    setJoinGroupCode("")

    // Create join message
    const joinMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "👋 Sistema",
      message: `¡${loggedInUser} se unió al grupo!`,
      timestamp: new Date(),
      groupId: group.id,
    }
    const updatedMessages = [...chatMessages, joinMessage]
    setChatMessages(updatedMessages)
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages))
  }

  const joinUserToGroup = (groupId: string, username: string) => {
    const updatedGroups = chatGroups.map((group) => {
      if (group.id === groupId && !group.members.includes(username)) {
        return { ...group, members: [...group.members, username] }
      }
      return group
    })
    setChatGroups(updatedGroups)
    localStorage.setItem("chatGroups", JSON.stringify(updatedGroups))
  }

  const leaveGroup = (groupId: string) => {
    const updatedGroups = chatGroups.map((group) => {
      if (group.id === groupId) {
        return { ...group, members: group.members.filter((member) => member !== loggedInUser) }
      }
      return group
    })
    setChatGroups(updatedGroups)
    localStorage.setItem("chatGroups", JSON.stringify(updatedGroups))

    // Switch to another group if available
    const availableGroups = updatedGroups.filter((g) => g.members.includes(loggedInUser))
    if (availableGroups.length > 0) {
      setCurrentGroup(availableGroups[0].id)
    } else {
      setCurrentGroup("")
    }
  }

  const copyGroupCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert("¡Código copiado al portapapeles!")
  }

  // Admin functions
  const addBusinessIdea = () => {
    if (newIdeaText.trim()) {
      const updatedIdeas = [...businessIdeas, newIdeaText.trim()]
      setBusinessIdeas(updatedIdeas)
      localStorage.setItem("businessIdeas", JSON.stringify(updatedIdeas))
      setNewIdeaText("")
    }
  }

  const editBusinessIdea = (index: number) => {
    setEditingIdea(index)
    setEditIdeaText(businessIdeas[index])
  }

  const saveEditIdea = () => {
    if (editingIdea !== null && editIdeaText.trim()) {
      const updatedIdeas = [...businessIdeas]
      updatedIdeas[editingIdea] = editIdeaText.trim()
      setBusinessIdeas(updatedIdeas)
      localStorage.setItem("businessIdeas", JSON.stringify(updatedIdeas))
      setEditingIdea(null)
      setEditIdeaText("")
    }
  }

  const deleteBusinessIdea = (index: number) => {
    const updatedIdeas = businessIdeas.filter((_, i) => i !== index)
    setBusinessIdeas(updatedIdeas)
    localStorage.setItem("businessIdeas", JSON.stringify(updatedIdeas))
  }

  const addMotivationalQuote = () => {
    if (newQuoteText.trim()) {
      const updatedQuotes = [...motivationalQuotes, newQuoteText.trim()]
      setMotivationalQuotes(updatedQuotes)
      localStorage.setItem("motivationalQuotes", JSON.stringify(updatedQuotes))
      setNewQuoteText("")
    }
  }

  const editMotivationalQuote = (index: number) => {
    setEditingQuote(index)
    setEditQuoteText(motivationalQuotes[index])
  }

  const saveEditQuote = () => {
    if (editingQuote !== null && editQuoteText.trim()) {
      const updatedQuotes = [...motivationalQuotes]
      updatedQuotes[editingQuote] = editQuoteText.trim()
      setMotivationalQuotes(updatedQuotes)
      localStorage.setItem("motivationalQuotes", JSON.stringify(updatedQuotes))
      setEditingQuote(null)
      setEditQuoteText("")
    }
  }

  const deleteMotivationalQuote = (index: number) => {
    const updatedQuotes = motivationalQuotes.filter((_, i) => i !== index)
    setMotivationalQuotes(updatedQuotes)
    localStorage.setItem("motivationalQuotes", JSON.stringify(updatedQuotes))
  }

  const addUser = () => {
    if (newUsername.trim() && newUserPassword.trim() && isSuperAdmin) {
      const newUser: AppUser = {
        username: newUsername.trim(),
        password: newUserPassword.trim(),
        isAdmin: newUserIsAdmin,
        createdAt: new Date(),
        lastLogin: undefined,
        currentGroup: undefined,
      }
      const updatedUsers = [...appUsers, newUser]
      setAppUsers(updatedUsers)
      localStorage.setItem("appUsers", JSON.stringify(updatedUsers))
      setNewUsername("")
      setNewUserPassword("")
      setNewUserIsAdmin(false)
    }
  }

  const deleteUser = (username: string) => {
    if (username !== "admin") {
      // Protect admin user
      const updatedUsers = appUsers.filter((u) => u.username !== username)
      setAppUsers(updatedUsers)
      localStorage.setItem("appUsers", JSON.stringify(updatedUsers))
    }
  }

  // User ideas functions
  const shareUserIdea = () => {
    if (newUserIdea.trim() && isLoggedIn) {
      const idea = {
        id: Date.now().toString(),
        idea: newUserIdea.trim(),
        author: loggedInUser,
        timestamp: new Date(),
        likes: 0,
        likedBy: [],
      }
      const updatedUserIdeas = [idea, ...userIdeas]
      setUserIdeas(updatedUserIdeas)
      localStorage.setItem("userSharedIdeas", JSON.stringify(updatedUserIdeas))
      setNewUserIdea("")

      // Notificar en el chat
      if (currentGroup) {
        const shareMessage = {
          id: Date.now().toString() + "_share",
          user: "💡 Sistema",
          message: `${loggedInUser} compartió una nueva idea: "${newUserIdea.trim()}"`,
          timestamp: new Date(),
          groupId: currentGroup,
        }
        const updatedMessages = [...chatMessages, shareMessage]
        setChatMessages(updatedMessages)
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages))
      }
    }
  }

  const likeUserIdea = (ideaId: string) => {
    if (!isLoggedIn) return

    const updatedUserIdeas = userIdeas.map((idea) => {
      if (idea.id === ideaId) {
        const hasLiked = idea.likedBy.includes(loggedInUser)
        if (hasLiked) {
          return {
            ...idea,
            likes: idea.likes - 1,
            likedBy: idea.likedBy.filter((user) => user !== loggedInUser),
          }
        } else {
          return {
            ...idea,
            likes: idea.likes + 1,
            likedBy: [...idea.likedBy, loggedInUser],
          }
        }
      }
      return idea
    })

    setUserIdeas(updatedUserIdeas)
    localStorage.setItem("userSharedIdeas", JSON.stringify(updatedUserIdeas))
  }

  const deleteUserIdea = (ideaId: string, author: string) => {
    if (loggedInUser === author || isAdmin) {
      const updatedUserIdeas = userIdeas.filter((idea) => idea.id !== ideaId)
      setUserIdeas(updatedUserIdeas)
      localStorage.setItem("userSharedIdeas", JSON.stringify(updatedUserIdeas))
    }
  }

  const totalGoal = results.length > 0 ? results[results.length - 1].goal : 0
  const totalCurrent = results.reduce((sum, round) => sum + round.current, 0)
  const completedRounds = results.filter((round) => round.completed).length

  const currentGroupData = chatGroups.find((g) => g.id === currentGroup)
  const currentGroupMessages = chatMessages.filter((msg) => msg.groupId === currentGroup)
  const currentGroupOnlineUsers = onlineUsers.filter((user) => currentGroupData?.members.includes(user))

  const sidebarItems = [
    { id: "calculadora", label: "Calculadora", icon: Calculator, color: "bg-blue-500", emoji: "🧮" },
    { id: "progreso", label: "Progreso", icon: TrendingUp, color: "bg-green-500", emoji: "📈" },
    { id: "ideas", label: "Ideas", icon: Lightbulb, color: "bg-yellow-500", emoji: "💡" },
    { id: "motivacion", label: "Motivación", icon: Heart, color: "bg-pink-500", emoji: "💖" },
    { id: "chat", label: "Chat", icon: MessageCircle, color: "bg-purple-500", emoji: "💬" },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: Shield, color: "bg-red-500", emoji: "👑" }] : []),
  ]

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl">
            <TrendingUp className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Club de Interés Compuesto</h1>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    )
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
              <TrendingUp className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Club de Interés Compuesto</h1>
            <p className="text-blue-100">Tu camino hacia la libertad financiera 🚀</p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-gray-800 text-xl">
                {showRegister ? "🎉 Crear Cuenta" : "👋 Iniciar Sesión"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showRegister ? (
                <>
                  {/* Login Form */}
                  <div>
                    <Label htmlFor="username" className="text-gray-700 font-semibold">
                      👤 Usuario
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingresa tu usuario"
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-gray-700 font-semibold">
                      🔒 Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        className="mt-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleLoginFormSubmit}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    ✨ Entrar
                  </Button>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-3">¿No tienes cuenta?</p>
                    <Button
                      onClick={() => setShowRegister(true)}
                      variant="outline"
                      className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      🎯 Crear Cuenta Nueva
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Register Form */}
                  <div>
                    <Label htmlFor="registerUsername" className="text-gray-700 font-semibold">
                      👤 Nombre de Usuario
                    </Label>
                    <Input
                      id="registerUsername"
                      type="text"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      placeholder="Elige tu nombre de usuario"
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="registerPassword" className="text-gray-700 font-semibold">
                      🔒 Contraseña
                    </Label>
                    <Input
                      id="registerPassword"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Crea una contraseña"
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">
                      ✅ Confirmar Contraseña
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirma tu contraseña"
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12"
                    />
                  </div>
                  <Button
                    onClick={handleRegister}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    🎉 Crear Mi Cuenta
                  </Button>
                  <div className="text-center">
                    <Button
                      onClick={() => setShowRegister(false)}
                      variant="link"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ← Volver al Login
                    </Button>
                  </div>
                </>
              )}

              {/* Messages */}
              {(loginMessage || registerMessage) && (
                <Alert
                  className={
                    loginMessage.includes("Bienvenido") || registerMessage.includes("exitosamente")
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }
                >
                  <div className="flex items-center gap-2">
                    {loginMessage.includes("Bienvenido") || registerMessage.includes("exitosamente") ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription
                      className={
                        loginMessage.includes("Bienvenido") || registerMessage.includes("exitosamente")
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {loginMessage || registerMessage}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Demo Users */}
              {!showRegister && (
                <div className="text-center text-xs text-gray-500 mt-4 p-4 bg-gray-50 rounded-xl border">
                  <p className="font-bold mb-2 text-gray-700">👥 Usuarios de prueba:</p>
                  <div className="space-y-1">
                    <p>
                      👑 <code className="bg-gray-200 px-2 py-1 rounded">admin</code> /{" "}
                      <code className="bg-gray-200 px-2 py-1 rounded">superder!!2</code>
                    </p>
                    <p>
                      👤 <code className="bg-gray-200 px-2 py-1 rounded">jose</code> /{" "}
                      <code className="bg-gray-200 px-2 py-1 rounded">clave1</code>
                    </p>
                    <p>
                      👤 <code className="bg-gray-200 px-2 py-1 rounded">maria</code> /{" "}
                      <code className="bg-gray-200 px-2 py-1 rounded">clave2</code>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 gap-1 p-2">
          {sidebarItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? `${item.color} text-white shadow-lg transform scale-105`
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.emoji}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 shadow-lg">
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Club Interés</h2>
                <p className="text-xs text-gray-500">Compuesto</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    activeSection === item.id
                      ? `${item.color} text-white shadow-lg transform scale-105`
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeSection === item.id ? "bg-white/20" : "bg-gray-100"}`}>
                    <Icon className={`h-4 w-4 ${activeSection === item.id ? "text-white" : "text-gray-600"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs opacity-75">{item.emoji}</div>
                  </div>
                  {item.id === "admin" && <Crown className="h-4 w-4 text-yellow-400" />}
                  {item.id === "chat" && currentGroupOnlineUsers.length > 0 && (
                    <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                      {currentGroupOnlineUsers.length}
                    </Badge>
                  )}
                </button>
              )
            })}
          </nav>

          {/* User Info */}
          {isLoggedIn && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {loggedInUser.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm flex items-center gap-1">
                    {loggedInUser}
                    {isSuperAdmin && <Crown className="h-3 w-3 text-yellow-500" />}
                  </div>
                  <div className="text-xs text-gray-500">En línea</div>
                </div>
              </div>
              {isSuperAdmin && <Badge className="bg-yellow-500 text-black mb-2 text-xs">SUPER ADMIN</Badge>}
              {isAdmin && !isSuperAdmin && <Badge className="bg-gray-600 text-white mb-2 text-xs">Admin</Badge>}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg bg-transparent"
              >
                <LogOut className="h-3 w-3 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pb-20 lg:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg lg:hidden">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                    {sidebarItems.find((item) => item.id === activeSection)?.emoji}{" "}
                    {sidebarItems.find((item) => item.id === activeSection)?.label}
                  </h1>
                  <p className="text-sm text-gray-500 hidden lg:block">
                    {activeSection === "calculadora" && "Calcula tu crecimiento financiero"}
                    {activeSection === "progreso" && "Revisa tu avance personal"}
                    {activeSection === "ideas" && "Descubre nuevas oportunidades"}
                    {activeSection === "motivacion" && "Mantente inspirado"}
                    {activeSection === "chat" && "Conecta con la comunidad"}
                    {activeSection === "admin" && "Panel de administración"}
                  </p>
                </div>
              </div>
              {isLoggedIn && (
                <div className="hidden lg:flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">{loggedInUser}</div>
                    <div className="text-xs text-gray-500">
                      {completedRounds > 0 ? `${completedRounds} vueltas completadas` : "¡Comienza tu viaje!"}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {loggedInUser.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {/* Calculator Section */}
          {activeSection === "calculadora" && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Calculator className="h-5 w-5" />
                    🧮 Calculadora de Interés Compuesto
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <Label htmlFor="capital" className="text-gray-700 font-semibold flex items-center gap-1">
                        💰 Capital inicial ($)
                      </Label>
                      <Input
                        id="capital"
                        type="number"
                        value={capital}
                        onChange={(e) => setCapital(Number(e.target.value))}
                        min="1"
                        className="mt-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="percentage" className="text-gray-700 font-semibold flex items-center gap-1">
                        📊 Porcentaje por vuelta (%)
                      </Label>
                      <Input
                        id="percentage"
                        type="number"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        min="1"
                        className="mt-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rounds" className="text-gray-700 font-semibold flex items-center gap-1">
                        🔄 Número de vueltas
                      </Label>
                      <Input
                        id="rounds"
                        type="number"
                        value={rounds}
                        onChange={(e) => setRounds(Number(e.target.value))}
                        min="1"
                        max="20"
                        className="mt-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12"
                      />
                    </div>
                    <Button
                      onClick={calculateInterest}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 h-12"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      ✨ Calcular
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {results.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-gray-800 mb-2">
                          💰 ${totalGoal.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">Meta Final</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-gray-800 mb-2">
                          💵 ${totalCurrent.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">Total Actual</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-gray-800 mb-2">
                          🎯 {completedRounds}/{results.length}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">Vueltas Completadas</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-white border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                      <CardTitle className="text-xl">🚀 Tabla de Progreso</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Vuelta</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Meta</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Progreso</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Falta</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Idea</th>
                              <th className="px-4 py-3 text-center font-semibold text-gray-700 text-sm">✅</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.map((round, index) => (
                              <tr
                                key={round.round}
                                className={`border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                                  round.completed ? "bg-green-50" : ""
                                }`}
                              >
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                      round.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
                                    }`}>
                                      {round.completed ? "✅" : round.round}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 font-semibold text-gray-800">
                                  ${round.goal.toFixed(2)}
                                </td>
                                <td className="px-4 py-4">
                                  <Input
                                    type="number"
                                    value={round.current || ""}
                                    onChange={(e) => updateCurrent(index, Number(e.target.value) || 0)}
                                    className="w-24 h-8 text-sm border-gray-200 rounded-lg"
                                    min="0"
                                    disabled={round.completed}
                                  />
                                </td>
                                <td className="px-4 py-4 font-semibold text-red-500">
                                  ${round.missing.toFixed(2)}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                                  💡 {round.idea}
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <Checkbox
                                    checked={round.completed}
                                    onCheckedChange={() => toggleCompleted(index)}
                                    className="w-5 h-5 border-2 border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* Progress Section */}
          {activeSection === "progreso" && (
            <div className="space-y-6">
              {results.length > 0 ? (
                <>
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <TrendingUp className="h-5 w-5" />
                        📈 Tu Plan: {rounds} Vueltas - ${capital} Inicial
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Trophy className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-gray-800">{completedRounds}</div>
                          <div className="text-xs text-gray-600 font-semibold">Completadas</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-gray-800">${totalCurrent.toFixed(2)}</div>
                          <div className="text-xs text-gray-600 font-semibold">Acumulado</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-gray-800">${totalGoal.toFixed(2)}</div>
                          <div className="text-xs text-gray-600 font-semibold">Meta Final</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Star className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-gray-800">{overallProgress.toFixed(1)}%</div>
                          <div className="text-xs text-gray-600 font-semibold">Progreso</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-700 mb-2 font-semibold">
                          <span>🚀 Progreso General</span>
                          <span>{overallProgress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${Math.min(overallProgress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                      <CardTitle className="text-xl">📊 Progreso Detallado</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {results.map((round) => {
                          const roundProgress = round.goal > 0 ? (round.current / round.goal) * 100 : 0
                          const isCompleted = round.completed
                          const isInProgress = round.current > 0 && !isCompleted

                          return (
                            <div
                              key={round.round}
                              className={`p-4 border rounded-xl transition-all duration-300 ${
                                isCompleted
                                  ? "bg-green-50 border-green-200"
                                  : isInProgress
                                    ? "bg-blue-50 border-blue-200"
                                    : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                                      isCompleted
                                        ? "bg-green-500 text-white"
                                        : isInProgress
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-300 text-gray-700"
                                    }`}
                                  >
                                    {isCompleted ? "✅" : round.round}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-800">🎯 Vuelta {round.round}</h4>
                                    <p className="text-sm text-gray-600">💡 {round.idea}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-lg text-gray-800">${round.goal.toFixed(2)}</div>
                                  <div className="text-sm text-gray-600">Meta</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex-1">
                                  <div className="flex justify-between text-sm text-gray-700 mb-2 font-semibold">
                                    <span>💵 ${round.current.toFixed(2)} de ${round.goal.toFixed(2)}</span>
                                    <span>{roundProgress.toFixed(1)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                                    <div
                                      className={`h-3 rounded-full transition-all duration-500 ${
                                        isCompleted
                                          ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                          : isInProgress
                                            ? "bg-gradient-to-r from-blue-400 to-cyan-500"
                                            : "bg-gray-300"
                                      }`}
                                      style={{ width: `${Math.min(roundProgress, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                {round.missing > 0 && (
                                  <div className="text-right">
                                    <div className="text-sm font-bold text-red-500">
                                      ❌ ${round.missing.toFixed(2)}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {isCompleted && (
                                <div className="flex items-center gap-2 text-green-700 text-sm font-bold bg-green-100 p-3 rounded-lg">
                                  <CheckCircle className="h-4 w-4" />
                                  🎉 ¡Vuelta completada! ¡Excelente trabajo!
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">🚀 ¡Comienza tu viaje!</h3>
                    <p className="text-gray-600 mb-6">
                      Ve a la calculadora para crear tu plan de inversión personalizado
                    </p>
                    <Button
                      onClick={() => setActiveSection("calculadora")}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      ✨ Crear Plan
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Ideas Section */}
          {activeSection === "ideas" && (
            <div className="space-y-6">
              {/* Ideas Predeterminadas */}
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Lightbulb className="h-5 w-5" />
                    💡 Ideas de Negocio Sugeridas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {businessIdeas.map((idea, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            {index + 1}
                          </div>
                          <span className="text-gray-800 font-semibold">{idea}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Compartir Ideas */}
              {isLoggedIn && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Plus className="h-5 w-5" />
                      🚀 Comparte tu Idea
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-700 font-semibold mb-2 block">
                          💭 ¿Tienes una idea de negocio? ¡Compártela!
                        </Label>
                        <Textarea
                          value={newUserIdea}
                          onChange={(e) => setNewUserIdea(e.target.value)}
                          placeholder="Describe tu idea aquí... Por ejemplo: 'Vender postres caseros por WhatsApp'"
                          className="border-2 border-gray-200 focus:border-green-500 rounded-xl min-h-[100px]"
                          rows={4}
                        />
                      </div>
                      <Button
                        onClick={shareUserIdea}
                        disabled={!newUserIdea.trim()}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        ✨ Compartir Idea
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ideas de la Comunidad */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-5 w-5" />
                    👥 Ideas de la Comunidad ({userIdeas.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {userIdeas.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {userIdeas.map((userIdea) => (
                        <div
                          key={userIdea.id}
                          className="p-4 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                {userIdea.author.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">{userIdea.author}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(userIdea.timestamp).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {(loggedInUser === userIdea.author || isAdmin) && (
                              <Button
                                onClick={() => deleteUserIdea(userIdea.id, userIdea.author)}
                                size="sm"
                                variant="destructive"
                                className="opacity-70 hover:opacity-100"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-700 font-medium leading-relaxed">💡 "{userIdea.idea}"</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <Button
                              onClick={() => likeUserIdea(userIdea.id)}
                              variant="outline"
                              size="sm"
                              className={`flex items-center gap-2 ${
                                isLoggedIn && userIdea.likedBy.includes(loggedInUser)
                                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                              }`}
                              disabled={!isLoggedIn}
                            >
                              <Heart
                                className={`h-3 w-3 ${
                                  isLoggedIn && userIdea.likedBy.includes(loggedInUser)
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }`}
                              />
                              {userIdea.likes} Me gusta
                            </Button>

                            {userIdea.likes > 0 && (
                              <div className="text-xs text-gray-500">
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
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lightbulb className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">🌟 ¡Sé el primero!</h3>
                      <p className="text-gray-600">Aún no hay ideas compartidas por la comunidad.</p>
                      {!isLoggedIn && (
                        <p className="text-sm text-gray-500 mt-2">
                          <Button
                            onClick={() => setActiveSection("login")}
                            variant="link"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            Inicia sesión
                          </Button>
                          para compartir tu primera idea.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mensaje para usuarios no logueados */}
              {!isLoggedIn && (
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">🔐 Únete a la Comunidad</h3>
                    <p className="text-gray-600 mb-4">
                      Inicia sesión para compartir tus ideas y ver las de otros miembros
                    </p>
                    <Button
                      onClick={() => setActiveSection("login")}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      🚀 Iniciar Sesión
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Motivation Section */}
          {activeSection === "motivacion" && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    <Heart className="h-5 w-5" />
                    💖 Frase del Día
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="max-w-2xl mx-auto text-center">
                    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-bold italic text-lg leading-relaxed mb-4">
                            "{currentQuote}"
                          </p>
                          <div className="text-sm text-gray-500 mb-4">
                            ✨ Frase {quoteIndex + 1} de {motivationalQuotes.length}
                          </div>
                          <Button
                            onClick={getRandomQuote}
                            className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            🎲 Nueva Motivación
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-center text-xl">💡 Consejos Financieros</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mb-3">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">🎯 Metas Claras</h4>
                      <p className="text-sm text-gray-600">
                        Define objetivos específicos y fechas límite para tus inversiones.
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-3">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">📊 Diversifica</h4>
                      <p className="text-sm text-gray-600">
                        No dependas de una sola fuente de ingresos, crea múltiples flujos.
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">💰 Reinvierte</h4>
                      <p className="text-sm text-gray-600">
                        El poder del interés compuesto se maximiza reinvirtiendo las ganancias.
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-3">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">📚 Edúcate</h4>
                      <p className="text-sm text-gray-600">
                        Invierte tiempo en aprender sobre finanzas e inversiones.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chat Section */}
          {activeSection === "chat" && (
            <div className="space-y-6">
              {isLoggedIn ? (
                <>
                  {/* Group Management */}
                  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="h-5 w-5" />
                        👥 Gestión de Grupos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Button
                          onClick={() => setShowCreateGroup(true)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 rounded-xl"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Grupo
                        </Button>
                        <Button
                          onClick={() => setShowJoinGroup(true)}
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-2 rounded-xl"
                        >
                          <Hash className="h-4 w-4 mr-2" />
                          Unirse
                        </Button>
                        {currentGroupData && (
                          <Button
                            onClick={() => copyGroupCode(currentGroupData.code)}
                            variant="outline"
                            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Código
                          </Button>
                        )}
                      </div>

                      {/* Create Group Modal */}
                      {showCreateGroup && (
                        <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                          <h4 className="font-bold text-green-800 mb-3">🆕 Crear Nuevo Grupo</h4>
                          <div className="space-y-3">
                            <Input
                              value={newGroupName}
                              onChange={(e) => setNewGroupName(e.target.value)}
                              placeholder="Nombre del grupo..."
                              className="border-2 border-green-200 focus:border-green-500 rounded-xl"
                            />
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={newGroupPrivate}
                                onCheckedChange={(checked) => setNewGroupPrivate(checked as boolean)}
                                className="border-2 border-green-300"
                              />
                              <Label className="text-sm text-green-800">Grupo privado</Label>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={createGroup}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                              >
                                Crear
                              </Button>
                              <Button
                                onClick={() => setShowCreateGroup(false)}
                                variant="outline"
                                className="border-green-300 text-green-700 hover:bg-green-50 rounded-xl"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Join Group Modal */}
                      {showJoinGroup && (
                        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                          <h4 className="font-bold text-blue-800 mb-3">🔗 Unirse a Grupo</h4>
                          <div className="space-y-3">
                            <Input
                              value={joinGroupCode}
                              onChange={(e) => setJoinGroupCode(e.target.value)}
                              placeholder="Código del grupo (ej: ABC123)"
                              className="border-2 border-blue-200 focus:border-blue-500 rounded-xl"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={joinGroup}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                              >
                                Unirse
                              </Button>
                              <Button
                                onClick={() => setShowJoinGroup(false)}
                                variant="outline"
                                className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Groups List */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-gray-800 mb-2">📋 Mis Grupos:</h4>
                        {chatGroups
                          .filter((group) => group.members.includes(loggedInUser))
                          .map((group) => (
                            <div
                              key={group.id}
                              className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                currentGroup === group.id
                                  ? "bg-purple-50 border-purple-300"
                                  : "bg-white border-gray-200 hover:border-purple-300"
                              }`}
                              onClick={() => setCurrentGroup(group.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-gray-800">{group.name}</div>
                                  <div className="text-xs text-gray-500">
                                    Código: {group.code} | {group.members.length} miembros
                                    {group.isPrivate && " | 🔒 Privado"}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {currentGroup === group.id && (
                                    <Badge className="bg-purple-500 text-white text-xs">Activo</Badge>
                                  )}
                                  {group.createdBy !== loggedInUser && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        leaveGroup(group.id)
                                      }}
                                      size="sm"
                                      variant="destructive"
                                      className="h-6 w-6 p-0"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chat Interface */}
                  {currentGroupData ? (
                    <>
                      <Card className="bg-white border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                          <CardTitle className="flex items-center gap-2 text-xl">
                            <MessageCircle className="h-5 w-5" />
                            💬 {currentGroupData.name}
                            <div className="ml-auto flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">{currentGroupOnlineUsers.length} en línea</span>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {currentGroupMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-xl shadow-sm text-sm ${
                                  msg.user === loggedInUser
                                    ? "bg-blue-500 text-white ml-8"
                                    : msg.user.includes("Sistema")
                                      ? "bg-yellow-100 text-yellow-800 text-center mx-4"
                                      : "bg-white text-gray-800 mr-8 border border-gray-200"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    {!msg.user.includes("Sistema") && (
                                      <div
                                        className={`text-xs font-bold mb-1 ${
                                          msg.user === loggedInUser ? "text-blue-100" : "text-gray-500"
                                        }`}
                                      >
                                        {msg.user === loggedInUser ? "Tú" : msg.user}
                                      </div>
                                    )}
                                    <div>{msg.message}</div>
                                  </div>
                                  <div
                                    className={`text-xs ml-2 ${
                                      msg.user === loggedInUser
                                        ? "text-blue-100"
                                        : msg.user.includes("Sistema")
                                          ? "text-yellow-600"
                                          : "text-gray-400"
                                    }`}
                                  >
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div ref={chatEndRef} />
                          </div>
                          <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex gap-2">
                              <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                              />
                              <Button
                                onClick={sendMessage}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-4"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                          <CardTitle className="flex items-center gap-2 text-xl">
                            <Users className="h-5 w-5" />
                            👥 Miembros ({currentGroupData.members.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {currentGroupData.members.map((member, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200"
                              >
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    currentGroupOnlineUsers.includes(member)
                                      ? "bg-green-500 animate-pulse"
                                      : "bg-gray-400"
                                  }`}
                                ></div>
                                <span className="font-semibold text-gray-800 text-sm">{member}</span>
                                {currentGroupData.createdBy === member && <Crown className="h-3 w-3 text-yellow-500" />}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-0 shadow-lg">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">📱 No hay grupo seleccionado</h3>
                        <p className="text-gray-600 mb-4">
                          Crea un grupo nuevo o únete a uno existente para empezar a chatear
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => setShowCreateGroup(true)}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Grupo
                          </Button>
                          <Button
                            onClick={() => setShowJoinGroup(true)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl"
                          >
                            <Hash className="h-4 w-4 mr-2" />
                            Unirse
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">🔒 Acceso Restringido</h3>
                    <p className="text-gray-600 mb-4">Debes iniciar sesión para acceder al chat grupal</p>
                    <Button
                      onClick={() => setActiveSection("login")}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      🚀 Iniciar Sesión
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Admin Panel */}
          {activeSection === "admin" && isAdmin && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Crown className="h-5 w-5" />
                    👑 Panel de Administración
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{appUsers.length}</div>
                      <div className="text-sm text-gray-600">Usuarios Totales</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Lightbulb className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{businessIdeas.length}</div>
                      <div className="text-sm text-gray-600">Ideas de Negocio</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{motivationalQuotes.length}</div>
                      <div className="text-sm text-gray-600">Frases Motivacionales</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Manage Business Ideas */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Lightbulb className="h-5 w-5" />
                    Gestionar Ideas de Negocio
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4 flex flex-col sm:flex-row gap-2">
                    <Input
                      value={newIdeaText}
                      onChange={(e) => setNewIdeaText(e.target.value)}
                      placeholder="Nueva idea de negocio..."
                      className="flex-1 border-2 border-gray-200 focus:border-yellow-500 rounded-xl"
                    />
                    <Button
                      onClick={addBusinessIdea}
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {businessIdeas.map((idea, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        {editingIdea === index ? (
                          <>
                            <Input
                              value={editIdeaText}
                              onChange={(e) => setEditIdeaText(e.target.value)}
                              className="flex-1 border-2 border-gray-200 focus:border-green-500 rounded-lg"
                            />
                            <Button
                              onClick={saveEditIdea}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => setEditingIdea(null)}
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm text-gray-800">{idea}</span>
                            <Button
                              onClick={() => editBusinessIdea(index)}
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => deleteBusinessIdea(index)}
                              size="sm"
                              variant="destructive"
                              className="rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Manage Motivational Quotes */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Heart className="h-5 w-5" />
                    Gestionar Frases Motivacionales
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4 flex flex-col sm:flex-row gap-2">
                    <Textarea
                      value={newQuoteText}
                      onChange={(e) => setNewQuoteText(e.target.value)}
                      placeholder="Nueva frase motivacional..."
                      className="flex-1 border-2 border-gray-200 focus:border-pink-500 rounded-xl"
                      rows={2}
                    />
                    <Button
                      onClick={addMotivationalQuote}
                      className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {motivationalQuotes.map((quote, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        {editingQuote === index ? (
                          <>
                            <Textarea
                              value={editQuoteText}
                              onChange={(e) => setEditQuoteText(e.target.value)}
                              className="flex-1 border-2 border-gray-200 focus:border-green-500 rounded-lg"
                              rows={2}
                            />
                            <div className="flex flex-col gap-1">
                              <Button
                                onClick={saveEditQuote}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => setEditingQuote(null)}
                                size="sm"
                                variant="outline"
                                className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm italic text-gray-800">"{quote}"</span>
                            <div className="flex flex-col gap-1">
                              <Button
                                onClick={() => editMotivationalQuote(index)}
                                size="sm"
                                variant="outline"
                                className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => deleteMotivationalQuote(index)}
                                size="sm"
                                variant="destructive"
                                className="rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Manage Users - SOLO SUPER ADMIN */}
              {isSuperAdmin && (
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Crown className="h-5 w-5" />
                      👑 Gestionar Usuarios (SUPER ADMIN)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-4 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-xl">
                      <p className="text-sm font-bold text-yellow-800 mb-2">🔐 ACCESO EXCLUSIVO</p>
                      <p className="text-xs text-yellow-700">Solo el Super Administrador puede crear nuevos usuarios</p>
                    </div>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Nombre de usuario"
                        className="border-2 border-gray-200 focus:border-yellow-500 rounded-xl"
                      />
                      <Input
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="border-2 border-gray-200 focus:border-yellow-500 rounded-xl"
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={newUserIsAdmin}
                          onCheckedChange={(checked) => setNewUserIsAdmin(checked as boolean)}
                          className="border-2 border-gray-300"
                        />
                        <Label className="text-sm text-gray-700">Admin</Label>
                      </div>
                      <Button
                        onClick={addUser}
                        className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Usuario
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {appUsers.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800">{user.username}</span>
                              {user.isAdmin && <Crown className="h-4 w-4 text-yellow-500" />}
                              {user.username === "admin" && (
                                <Badge className="bg-yellow-500 text-black text-xs">SUPER ADMIN</Badge>
                              )}
                              {user.isAdmin && user.username !== "admin" && (
                                <Badge className="bg-gray-600 text-white text-xs">Admin</Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Creado: {new Date(user.createdAt).toLocaleDateString()}
                              {user.lastLogin && ` | Último acceso: ${new Date(user.lastLogin).toLocaleDateString()}`}
                            </div>
                          </div>
                          {user.username !== "admin" && (
                            <Button
                              onClick={() => deleteUser(user.username)}
                              size="sm"
                              variant="destructive"
                              className="rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                \
