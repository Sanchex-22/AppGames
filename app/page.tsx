"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  TrendingUp,
  Lightbulb,
  Heart,
  User,
  CheckCircle,
  XCircle,
  LogOut,
  Menu,
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
  const [activeSection, setActiveSection] = useState("calculadora")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [capital, setCapital] = useState(10)
  const [percentage, setPercentage] = useState(100)
  const [rounds, setRounds] = useState(7)
  const [results, setResults] = useState<RoundData[]>([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginMessage, setLoginMessage] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentQuote, setCurrentQuote] = useState("")
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [businessIdeas, setBusinessIdeas] = useState<string[]>(defaultBusinessIdeas)
  const [motivationalQuotes, setMotivationalQuotes] = useState<string[]>(defaultMotivationalQuotes)
  const [appUsers, setAppUsers] = useState<AppUser[]>([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

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
    // Initialize default admin user
    const defaultUsers: AppUser[] = [
      {
        username: "admin",
        password: "superder!!2",
        isAdmin: true,
        createdAt: new Date(),
      },
      {
        username: "jose",
        password: "clave1",
        isAdmin: false,
        createdAt: new Date(),
      },
      {
        username: "maria",
        password: "clave2",
        isAdmin: false,
        createdAt: new Date(),
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
      handleLogin()
    }, 1000)
  }

  const handleLogin = () => {
    const user = appUsers.find((u) => u.username === username && u.password === password)

    if (user) {
      setLoginMessage("¡Bienvenido, " + username + "!")
      setIsLoggedIn(true)
      setLoggedInUser(username)
      setIsAdmin(user.isAdmin)
      setIsSuperAdmin(user.username === "admin" && user.password === "superder!!2")
      loadProgress(username)
      setActiveSection("calculadora")

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
    const currentOnline = JSON.parse(localStorage.getItem("onlineUsers") || "[]")
    const updatedOnline = currentOnline.filter((user: string) => user !== loggedInUser)
    setOnlineUsers(updatedOnline)
    localStorage.setItem("onlineUsers", JSON.stringify(updatedOnline))

    setIsLoggedIn(false)
    setLoggedInUser("")
    setIsAdmin(false)
    setIsSuperAdmin(false)
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

  const clearChat = () => {
    setChatMessages([])
    localStorage.setItem("chatMessages", JSON.stringify([]))
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
    { id: "calculadora", label: "Calculadora", icon: Calculator },
    { id: "progreso", label: "Mi Progreso", icon: TrendingUp },
    { id: "ideas", label: "Ideas", icon: Lightbulb },
    { id: "motivacion", label: "Motivación", icon: Heart },
    { id: "chat", label: "Chat Grupal", icon: MessageCircle },
    ...(isAdmin ? [{ id: "admin", label: "Panel Admin", icon: Shield }] : []),
    { id: "login", label: "Usuario", icon: User },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-lg border-2 border-gray-400 hover:border-blue-600 touch-target"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 lg:w-64 bg-gradient-to-b from-black via-gray-900 to-slate-800 text-white transform transition-transform duration-300 ease-in-out shadow-2xl
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-4 lg:p-6 safe-area-inset">
          <div className="flex items-center gap-2 mb-6 lg:mb-8">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
            </div>
            <h2 className="text-base lg:text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Club Interés
            </h2>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 lg:px-4 lg:py-3 rounded-xl text-left transition-all duration-200 transform hover:scale-105 touch-target text-sm lg:text-base
                    ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                  {item.label}
                  {item.id === "admin" && <Crown className="h-3 w-3 lg:h-4 lg:w-4 ml-auto text-yellow-400" />}
                  {item.id === "chat" && currentGroupOnlineUsers.length > 0 && (
                    <span className="ml-auto bg-blue-500 text-xs px-2 py-1 rounded-full text-white font-bold">
                      {currentGroupOnlineUsers.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {isLoggedIn && (
            <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-700">
              <div className="text-xs lg:text-sm text-gray-400 mb-2">Sesión activa:</div>
              <div className="font-semibold text-white mb-1 bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2 text-sm lg:text-base">
                {loggedInUser}
                {isSuperAdmin && <Crown className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-400" />}
              </div>
              {isSuperAdmin && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white mb-3 text-xs">
                  SUPER ADMIN
                </Badge>
              )}
              {isAdmin && !isSuperAdmin && (
                <Badge variant="secondary" className="mb-3 text-xs">
                  Administrador
                </Badge>
              )}
              {currentGroupData && (
                <div className="mb-3 p-2 bg-gray-800 rounded-lg">
                  <div className="text-xs text-gray-400">Grupo actual:</div>
                  <div className="text-sm font-semibold text-blue-300">{currentGroupData.name}</div>
                  <div className="text-xs text-gray-500">Código: {currentGroupData.code}</div>
                </div>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 touch-target text-xs lg:text-sm"
              >
                <LogOut className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-gradient-to-r from-black via-gray-900 to-slate-800 text-white shadow-2xl">
          <div className="px-4 lg:px-6 py-4 lg:py-6 safe-area-inset">
            <div className="flex items-center justify-center gap-2 lg:gap-3 lg:ml-0 ml-12">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center animate-pulse">
                <TrendingUp className="h-5 w-5 lg:h-8 lg:w-8 text-white" />
              </div>
              <h1 className="text-lg lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                Club de Interés Compuesto
              </h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 safe-area-inset mobile-scroll">
          {/* Calculator Section */}
          {activeSection === "calculadora" && (
            <div className="space-y-4 lg:space-y-6">
              <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-white to-gray-100">
                <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <Calculator className="h-4 w-4 lg:h-5 lg:w-5" />
                    Área de Cálculo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                      <Label htmlFor="capital" className="text-gray-800 font-semibold text-sm lg:text-base">
                        Capital inicial ($)
                      </Label>
                      <Input
                        id="capital"
                        type="number"
                        value={capital}
                        onChange={(e) => setCapital(Number(e.target.value))}
                        min="1"
                        className="border-2 border-gray-400 focus:border-blue-600 touch-target"
                      />
                    </div>
                    <div>
                      <Label htmlFor="percentage" className="text-gray-800 font-semibold text-sm lg:text-base">
                        Porcentaje por vuelta (%)
                      </Label>
                      <Input
                        id="percentage"
                        type="number"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        min="1"
                        className="border-2 border-gray-400 focus:border-blue-600 touch-target"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rounds" className="text-gray-800 font-semibold text-sm lg:text-base">
                        Número de vueltas
                      </Label>
                      <Input
                        id="rounds"
                        type="number"
                        value={rounds}
                        onChange={(e) => setRounds(Number(e.target.value))}
                        min="1"
                        max="20"
                        className="border-2 border-gray-400 focus:border-blue-600 touch-target"
                      />
                    </div>
                    <Button
                      onClick={calculateInterest}
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
                    >
                      ✨ Calcular
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {results.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-gray-50 to-slate-200">
                      <CardContent className="pt-4 lg:pt-6">
                        <div className="text-center">
                          <div className="text-xl lg:text-3xl font-bold text-blue-700 mb-2">
                            💰 ${totalGoal.toFixed(2)}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-700 font-semibold">Meta Final</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-slate-50 to-gray-200">
                      <CardContent className="pt-4 lg:pt-6">
                        <div className="text-center">
                          <div className="text-xl lg:text-3xl font-bold text-blue-700 mb-2">
                            💵 ${totalCurrent.toFixed(2)}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-700 font-semibold">Total Actual</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-gray-100 to-slate-300">
                      <CardContent className="pt-4 lg:pt-6">
                        <div className="text-center">
                          <div className="text-xl lg:text-3xl font-bold text-black mb-2">
                            🎯 {completedRounds}/{results.length}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-700 font-semibold">Vueltas Completadas</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
                    <CardHeader className="bg-gradient-to-r from-gray-900 to-black text-white rounded-t-lg">
                      <CardTitle className="text-lg lg:text-xl">🚀 Tabla de Progreso</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 lg:p-6">
                      <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 mobile-scroll">
                        <div className="min-w-[800px] lg:min-w-0">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b-2 bg-gradient-to-r from-gray-200 to-slate-300">
                                <th className="p-2 lg:p-4 text-left font-bold text-black text-sm lg:text-base">
                                  Vuelta
                                </th>
                                <th className="p-2 lg:p-4 text-left font-bold text-black text-sm lg:text-base">Meta</th>
                                <th className="p-2 lg:p-4 text-left font-bold text-black text-sm lg:text-base">
                                  Lo que llevo
                                </th>
                                <th className="p-2 lg:p-4 text-left font-bold text-black text-sm lg:text-base">
                                  Me falta
                                </th>
                                <th className="p-2 lg:p-4 text-left font-bold text-black text-sm lg:text-base">
                                  Idea sugerida
                                </th>
                                <th className="p-2 lg:p-4 text-center font-bold text-black text-sm lg:text-base">
                                  ¿Completado?
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.map((round, index) => (
                                <tr
                                  key={round.round}
                                  className={`border-b-2 hover:bg-gradient-to-r transition-all duration-200 ${
                                    round.completed
                                      ? "bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300"
                                      : "hover:from-gray-100 hover:to-slate-200"
                                  }`}
                                >
                                  <td className="p-2 lg:p-4 font-bold text-black text-sm lg:text-base">
                                    {round.round}
                                  </td>
                                  <td className="p-2 lg:p-4 font-bold text-blue-700 text-sm lg:text-base">
                                    ${round.goal.toFixed(2)}
                                  </td>
                                  <td className="p-2 lg:p-4">
                                    <Input
                                      type="number"
                                      value={round.current || ""}
                                      onChange={(e) => updateCurrent(index, Number(e.target.value) || 0)}
                                      className="w-20 lg:w-28 border-2 border-gray-400 focus:border-blue-600 touch-target text-sm"
                                      min="0"
                                      disabled={round.completed}
                                    />
                                  </td>
                                  <td className="p-2 lg:p-4 font-bold text-red-600 text-sm lg:text-base">
                                    ${round.missing.toFixed(2)}
                                  </td>
                                  <td className="p-2 lg:p-4 text-xs lg:text-sm text-gray-800 font-medium">
                                    {round.idea}
                                  </td>
                                  <td className="p-2 lg:p-4 text-center">
                                    <Checkbox
                                      checked={round.completed}
                                      onCheckedChange={() => toggleCompleted(index)}
                                      className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 touch-target"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* Progress Section */}
          {activeSection === "progreso" && (
            <div className="space-y-4 lg:space-y-6">
              {results.length > 0 ? (
                <>
                  <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-white to-gray-100">
                    <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />🎯 Resumen de tu Plan: {rounds} Vueltas - $
                        {capital} Inicial
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 lg:p-6">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg border-2 border-blue-400">
                          <div className="text-xl lg:text-3xl font-bold text-blue-800 mb-2">🏆 {completedRounds}</div>
                          <div className="text-xs lg:text-sm text-blue-900 font-semibold">Vueltas Completadas</div>
                        </div>
                        <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-gray-100 to-slate-300 rounded-xl shadow-lg border-2 border-gray-500">
                          <div className="text-xl lg:text-3xl font-bold text-gray-800 mb-2">
                            💰 ${totalCurrent.toFixed(2)}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-900 font-semibold">Total Acumulado</div>
                        </div>
                        <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-slate-100 to-gray-300 rounded-xl shadow-lg border-2 border-slate-500">
                          <div className="text-xl lg:text-3xl font-bold text-slate-800 mb-2">
                            🎯 ${totalGoal.toFixed(2)}
                          </div>
                          <div className="text-xs lg:text-sm text-slate-900 font-semibold">Meta Final</div>
                        </div>
                        <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl shadow-lg border-2 border-blue-500">
                          <div className="text-xl lg:text-3xl font-bold text-blue-800 mb-2">
                            📊 {overallProgress.toFixed(1)}%
                          </div>
                          <div className="text-xs lg:text-sm text-blue-900 font-semibold">Progreso Total</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-800 mb-2 font-semibold">
                          <span>🚀 Progreso General</span>
                          <span>{overallProgress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-4 lg:h-6 shadow-inner">
                          <div
                            className="bg-gradient-to-r from-blue-600 via-blue-700 to-black h-4 lg:h-6 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${Math.min(overallProgress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
                    <CardHeader className="bg-gradient-to-r from-gray-900 to-black text-white rounded-t-lg">
                      <CardTitle className="text-lg lg:text-xl">📈 Progreso Detallado por Vuelta</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 lg:p-6">
                      <div className="space-y-4">
                        {results.map((round, index) => {
                          const roundProgress = round.goal > 0 ? (round.current / round.goal) * 100 : 0
                          const isCompleted = round.completed
                          const isInProgress = round.current > 0 && !isCompleted

                          return (
                            <div
                              key={round.round}
                              className={`p-4 lg:p-6 border-2 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-102 ${
                                isCompleted
                                  ? "bg-gradient-to-r from-blue-100 to-blue-200 border-blue-400"
                                  : isInProgress
                                    ? "bg-gradient-to-r from-gray-100 to-slate-300 border-gray-500"
                                    : "bg-gradient-to-r from-slate-100 to-gray-300 border-slate-400"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3 lg:gap-4">
                                  <div
                                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-base lg:text-lg shadow-lg ${
                                      isCompleted
                                        ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
                                        : isInProgress
                                          ? "bg-gradient-to-r from-gray-600 to-slate-800 text-white"
                                          : "bg-gradient-to-r from-slate-500 to-gray-700 text-white"
                                    }`}
                                  >
                                    {isCompleted ? "✅" : round.round}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-base lg:text-lg text-black">
                                      🎯 Vuelta {round.round}
                                    </h4>
                                    <p className="text-xs lg:text-sm text-gray-700 font-medium">💡 {round.idea}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-lg lg:text-xl text-blue-700">
                                    ${round.goal.toFixed(2)}
                                  </div>
                                  <div className="text-xs lg:text-sm text-gray-600 font-semibold">Meta</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex-1">
                                  <div className="flex justify-between text-xs lg:text-sm text-gray-800 mb-2 font-semibold">
                                    <span>
                                      💵 ${round.current.toFixed(2)} de ${round.goal.toFixed(2)}
                                    </span>
                                    <span>{roundProgress.toFixed(1)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-400 rounded-full h-3 lg:h-4 shadow-inner">
                                    <div
                                      className={`h-3 lg:h-4 rounded-full transition-all duration-500 shadow-lg ${
                                        isCompleted
                                          ? "bg-gradient-to-r from-blue-600 to-blue-800"
                                          : isInProgress
                                            ? "bg-gradient-to-r from-gray-600 to-slate-800"
                                            : "bg-gradient-to-r from-slate-500 to-gray-700"
                                      }`}
                                      style={{ width: `${Math.min(roundProgress, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                {round.missing > 0 && (
                                  <div className="text-right">
                                    <div className="text-xs lg:text-sm font-bold text-red-600">
                                      ❌ Faltan: ${round.missing.toFixed(2)}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {isCompleted && (
                                <div className="flex items-center gap-2 text-blue-800 text-xs lg:text-sm font-bold bg-blue-200 p-2 rounded-lg">
                                  <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />🎉 ¡Vuelta completada! ¡Excelente
                                  trabajo!
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
                <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-white to-gray-100">
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-700">
                      <TrendingUp className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg lg:text-xl font-bold mb-2">🚀 No hay plan activo</p>
                      <p className="text-gray-600 text-sm lg:text-base">
                        Ve a la sección "Calculadora" para crear tu plan de inversión
                      </p>
                      <Button
                        onClick={() => setActiveSection("calculadora")}
                        className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
                      >
                        ✨ Crear Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Chat Section */}
          {activeSection === "chat" && (
            <div className="space-y-4 lg:space-y-6">
              {isLoggedIn ? (
                <>
                  {/* Group Management */}
                  <Card className="border-2 border-purple-500 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <Users className="h-4 w-4 lg:h-5 lg:w-5" />👥 Gestión de Grupos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 lg:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Button
                          onClick={() => setShowCreateGroup(true)}
                          className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 touch-target"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Grupo
                        </Button>
                        <Button
                          onClick={() => setShowJoinGroup(true)}
                          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 touch-target"
                        >
                          <Hash className="h-4 w-4 mr-2" />
                          Unirse con Código
                        </Button>
                        {currentGroupData && (
                          <Button
                            onClick={() => copyGroupCode(currentGroupData.code)}
                            variant="outline"
                            className="touch-target"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Código
                          </Button>
                        )}
                      </div>

                      {/* Create Group Modal */}
                      {showCreateGroup && (
                        <div className="mb-4 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
                          <h4 className="font-bold text-green-900 mb-3">🆕 Crear Nuevo Grupo</h4>
                          <div className="space-y-3">
                            <Input
                              value={newGroupName}
                              onChange={(e) => setNewGroupName(e.target.value)}
                              placeholder="Nombre del grupo..."
                              className="touch-target"
                            />
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={newGroupPrivate}
                                onCheckedChange={(checked) => setNewGroupPrivate(checked as boolean)}
                                className="touch-target"
                              />
                              <Label className="text-sm">Grupo privado</Label>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={createGroup} className="bg-green-600 hover:bg-green-700 touch-target">
                                Crear
                              </Button>
                              <Button
                                onClick={() => setShowCreateGroup(false)}
                                variant="outline"
                                className="touch-target"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Join Group Modal */}
                      {showJoinGroup && (
                        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
                          <h4 className="font-bold text-blue-900 mb-3">🔗 Unirse a Grupo</h4>
                          <div className="space-y-3">
                            <Input
                              value={joinGroupCode}
                              onChange={(e) => setJoinGroupCode(e.target.value)}
                              placeholder="Código del grupo (ej: ABC123)"
                              className="touch-target"
                            />
                            <div className="flex gap-2">
                              <Button onClick={joinGroup} className="bg-blue-600 hover:bg-blue-700 touch-target">
                                Unirse
                              </Button>
                              <Button
                                onClick={() => setShowJoinGroup(false)}
                                variant="outline"
                                className="touch-target"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Groups List */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-purple-900 mb-2">📋 Mis Grupos:</h4>
                        {chatGroups
                          .filter((group) => group.members.includes(loggedInUser))
                          .map((group) => (
                            <div
                              key={group.id}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                currentGroup === group.id
                                  ? "bg-purple-200 border-purple-500"
                                  : "bg-white border-gray-300 hover:border-purple-400"
                              }`}
                              onClick={() => setCurrentGroup(group.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-purple-900">{group.name}</div>
                                  <div className="text-xs text-gray-600">
                                    Código: {group.code} | {group.members.length} miembros
                                    {group.isPrivate && " | 🔒 Privado"}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {currentGroup === group.id && (
                                    <Badge className="bg-purple-600 text-white text-xs">Activo</Badge>
                                  )}
                                  {group.createdBy !== loggedInUser && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        leaveGroup(group.id)
                                      }}
                                      size="sm"
                                      variant="destructive"
                                      className="touch-target"
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
                      <Card className="border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
                        <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                            <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5" />💬 {currentGroupData.name}
                            <div className="ml-auto flex items-center gap-2">
                              <Users className="h-3 w-3 lg:h-4 lg:w-4" />
                              <span className="text-xs lg:text-sm">{currentGroupOnlineUsers.length} en línea</span>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="h-64 sm:h-80 lg:h-96 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-slate-100 mobile-scroll">
                            {currentGroupMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-lg shadow-md text-sm lg:text-base ${
                                  msg.user === loggedInUser
                                    ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white ml-4 lg:ml-8"
                                    : msg.user.includes("Sistema")
                                      ? "bg-gradient-to-r from-gray-700 to-black text-white text-center mx-2 lg:mx-4"
                                      : "bg-white border-2 border-gray-400 mr-4 lg:mr-8"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    {!msg.user.includes("Sistema") && (
                                      <div
                                        className={`text-xs font-bold mb-1 ${
                                          msg.user === loggedInUser ? "text-blue-200" : "text-gray-600"
                                        }`}
                                      >
                                        {msg.user === loggedInUser ? "Tú" : msg.user}
                                      </div>
                                    )}
                                    <div
                                      className={`${
                                        msg.user === loggedInUser
                                          ? "text-white"
                                          : msg.user.includes("Sistema")
                                            ? "text-white font-bold"
                                            : "text-gray-800"
                                      }`}
                                    >
                                      {msg.message}
                                    </div>
                                  </div>
                                  <div
                                    className={`text-xs ml-2 ${
                                      msg.user === loggedInUser
                                        ? "text-blue-300"
                                        : msg.user.includes("Sistema")
                                          ? "text-gray-300"
                                          : "text-gray-500"
                                    }`}
                                  >
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div ref={chatEndRef} />
                          </div>
                          <div className="p-4 border-t-2 border-gray-400 bg-gradient-to-r from-gray-100 to-slate-200">
                            <div className="flex gap-2">
                              <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 border-2 border-gray-400 focus:border-blue-600 touch-target"
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                              />
                              <Button
                                onClick={sendMessage}
                                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg touch-target"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
                        <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                            <Users className="h-4 w-4 lg:h-5 lg:w-5" />👥 Miembros del Grupo (
                            {currentGroupData.members.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {currentGroupData.members.map((member, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-3 bg-gradient-to-r from-gray-100 to-slate-300 rounded-lg border-2 border-gray-400"
                              >
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    currentGroupOnlineUsers.includes(member)
                                      ? "bg-green-500 animate-pulse"
                                      : "bg-gray-400"
                                  }`}
                                ></div>
                                <span className="font-semibold text-gray-800 text-sm lg:text-base">{member}</span>
                                {currentGroupData.createdBy === member && <Crown className="h-3 w-3 text-yellow-500" />}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
                      <CardContent className="pt-6">
                        <div className="text-center text-gray-700">
                          <MessageCircle className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg lg:text-xl font-bold mb-2">📱 No hay grupo seleccionado</p>
                          <p className="text-gray-600 mb-4 text-sm lg:text-base">
                            Crea un grupo nuevo o únete a uno existente para empezar a chatear
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button
                              onClick={() => setShowCreateGroup(true)}
                              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 touch-target"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Crear Grupo
                            </Button>
                            <Button
                              onClick={() => setShowJoinGroup(true)}
                              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 touch-target"
                            >
                              <Hash className="h-4 w-4 mr-2" />
                              Unirse
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-700">
                      <MessageCircle className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg lg:text-xl font-bold mb-2">🔒 Acceso Restringido</p>
                      <p className="text-gray-600 mb-4 text-sm lg:text-base">
                        Debes iniciar sesión para acceder al chat grupal
                      </p>
                      <Button
                        onClick={() => setActiveSection("login")}
                        className="bg-gradient-to-r from-gray-600 to-black hover:from-gray-700 hover:to-gray-900 shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
                      >
                        🚀 Iniciar Sesión
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Ideas Section */}
          {activeSection === "ideas" && (
            <div className="space-y-4 lg:space-y-6">
              {/* Ideas Predeterminadas del Sistema */}
              <Card className="border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
                <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <Lightbulb className="h-4 w-4 lg:h-5 lg:w-5" />💡 Ideas de Negocio Sugeridas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {businessIdeas.map((idea, index) => (
                      <div
                        key={index}
                        className="p-4 lg:p-6 bg-gradient-to-r from-gray-100 to-slate-300 border-2 border-gray-500 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full flex items-center justify-center font-bold text-base lg:text-lg shadow-lg">
                            {index + 1}
                          </div>
                          <span className="text-gray-800 font-bold text-sm lg:text-lg">{idea}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Área para Compartir Ideas de Usuarios */}
              {isLoggedIn && (
                <Card className="border-2 border-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <Plus className="h-4 w-4 lg:h-5 lg:w-5" />🚀 Comparte tu Idea de Negocio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-blue-900 font-semibold mb-2 block text-sm lg:text-base">
                          💭 ¿Tienes una idea de negocio? ¡Compártela con la comunidad!
                        </Label>
                        <Textarea
                          value={newUserIdea}
                          onChange={(e) => setNewUserIdea(e.target.value)}
                          placeholder="Describe tu idea de negocio aquí... Por ejemplo: 'Vender postres caseros por WhatsApp' o 'Ofrecer servicios de limpieza los fines de semana'"
                          className="border-2 border-blue-400 focus:border-blue-600 min-h-[100px] touch-target"
                          rows={4}
                        />
                      </div>
                      <Button
                        onClick={shareUserIdea}
                        disabled={!newUserIdea.trim()}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
                      >
                        <Plus className="h-4 w-4 mr-2" />✨ Compartir Mi Idea
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ideas Compartidas por la Comunidad */}
              <Card className="border-2 border-green-500 shadow-xl bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5" />👥 Ideas Compartidas por la Comunidad ({userIdeas.length}
                    )
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  {userIdeas.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto mobile-scroll">
                      {userIdeas.map((userIdea) => (
                        <div
                          key={userIdea.id}
                          className="p-4 lg:p-6 bg-white border-2 border-green-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                                {userIdea.author.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-green-900 text-sm lg:text-base">{userIdea.author}</div>
                                <div className="text-xs text-gray-600">
                                  {new Date(userIdea.timestamp).toLocaleDateString()} a las{" "}
                                  {new Date(userIdea.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                            {(loggedInUser === userIdea.author || isAdmin) && (
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
                            <p className="text-gray-800 font-medium text-sm lg:text-lg leading-relaxed">
                              💡 "{userIdea.idea}"
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <Button
                              onClick={() => likeUserIdea(userIdea.id)}
                              variant="outline"
                              size="sm"
                              className={`flex items-center gap-2 touch-target text-xs lg:text-sm ${
                                isLoggedIn && userIdea.likedBy.includes(loggedInUser)
                                  ? "bg-red-100 border-red-400 text-red-700 hover:bg-red-200"
                                  : "hover:bg-gray-100"
                              }`}
                              disabled={!isLoggedIn}
                            >
                              <Heart
                                className={`h-3 w-3 lg:h-4 lg:w-4 ${
                                  isLoggedIn && userIdea.likedBy.includes(loggedInUser)
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }`}
                              />
                              {userIdea.likes} Me gusta
                            </Button>

                            {userIdea.likes > 0 && (
                              <div className="text-xs text-gray-600">
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
                      <Lightbulb className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg lg:text-xl font-bold text-gray-700 mb-2">🌟 ¡Sé el primero!</p>
                      <p className="text-gray-600 text-sm lg:text-base">
                        Aún no hay ideas compartidas por la comunidad.
                      </p>
                      {!isLoggedIn && (
                        <p className="text-xs lg:text-sm text-gray-500 mt-2">
                          <Button
                            onClick={() => setActiveSection("login")}
                            variant="link"
                            className="text-blue-600 hover:text-blue-800"
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
                <Card className="border-2 border-yellow-500 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100">
                  <CardContent className="p-4 lg:p-6">
                    <div className="text-center">
                      <User className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 text-yellow-600" />
                      <p className="text-lg lg:text-xl font-bold text-yellow-800 mb-2">🔐 Únete a la Comunidad</p>
                      <p className="text-yellow-700 mb-4 text-sm lg:text-base">
                        Inicia sesión para compartir tus ideas de negocio y ver las ideas de otros miembros
                      </p>
                      <Button
                        onClick={() => setActiveSection("login")}
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
                      >
                        🚀 Iniciar Sesión
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Motivation Section */}
          {activeSection === "motivacion" && (
            <div className="space-y-4 lg:space-y-6">
              <Card className="text-center border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
                <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-center gap-2 text-lg lg:text-xl">
                    <Heart className="h-5 w-5 lg:h-6 lg:w-6" />💖 Frase de Motivación del Día
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-6 lg:py-8">
                  <div className="max-w-2xl mx-auto">
                    <div className="p-6 lg:p-8 bg-gradient-to-r from-gray-100 to-slate-300 border-2 border-gray-500 rounded-xl shadow-2xl">
                      <div className="flex items-start gap-3 lg:gap-4">
                        <Heart className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600 mt-2 flex-shrink-0 animate-pulse" />
                        <div className="flex-1">
                          <p className="text-gray-800 font-bold italic text-lg lg:text-2xl leading-relaxed mb-4 lg:mb-6">
                            "{currentQuote}"
                          </p>
                          <div className="text-xs lg:text-sm text-gray-700 mb-4 font-semibold">
                            ✨ Frase {quoteIndex + 1} de {motivationalQuotes.length}
                          </div>
                          <Button
                            onClick={getRandomQuote}
                            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
                          >
                            <Heart className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />🎲 Nueva Motivación
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
                <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                  <CardTitle className="text-center text-lg lg:text-xl">💡 Consejos Financieros</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 lg:p-6 bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-400 rounded-xl shadow-lg">
                      <h4 className="font-bold text-blue-900 mb-3 text-base lg:text-lg">🎯 Establece Metas Claras</h4>
                      <p className="text-xs lg:text-sm text-gray-800 font-medium">
                        Define objetivos específicos y fechas límite para tus inversiones.
                      </p>
                    </div>
                    <div className="p-4 lg:p-6 bg-gradient-to-r from-gray-100 to-slate-300 border-2 border-gray-500 rounded-xl shadow-lg">
                      <h4 className="font-bold text-gray-900 mb-3 text-base lg:text-lg">📊 Diversifica tus Ingresos</h4>
                      <p className="text-xs lg:text-sm text-gray-800 font-medium">
                        No dependas de una sola fuente de ingresos, crea múltiples flujos.
                      </p>
                    </div>
                    <div className="p-4 lg:p-6 bg-gradient-to-r from-slate-100 to-gray-300 border-2 border-slate-500 rounded-xl shadow-lg">
                      <h4 className="font-bold text-slate-900 mb-3 text-base lg:text-lg">
                        💰 Reinvierte tus Ganancias
                      </h4>
                      <p className="text-xs lg:text-sm text-gray-800 font-medium">
                        El poder del interés compuesto se maximiza reinvirtiendo las ganancias.
                      </p>
                    </div>
                    <div className="p-4 lg:p-6 bg-gradient-to-r from-blue-100 to-blue-300 border-2 border-blue-500 rounded-xl shadow-lg">
                      <h4 className="font-bold text-blue-900 mb-3 text-base lg:text-lg">📚 Edúcate Constantemente</h4>
                      <p className="text-xs lg:text-sm text-gray-800 font-medium">
                        Invierte tiempo en aprender sobre finanzas e inversiones.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Admin Panel */}
          {activeSection === "admin" && isAdmin && (
            <div className="space-y-4 lg:space-y-6">
              <Card className="border-2 border-yellow-400 shadow-xl bg-gradient-to-br from-white to-yellow-50">
                <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <Crown className="h-4 w-4 lg:h-5 lg:w-5" />👑 Panel de Administración
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl border-2 border-blue-400">
                      <Users className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 text-blue-700" />
                      <div className="text-xl lg:text-2xl font-bold text-blue-800">{appUsers.length}</div>
                      <div className="text-xs lg:text-sm text-blue-700">Usuarios Totales</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl border-2 border-green-400">
                      <Lightbulb className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 text-green-700" />
                      <div className="text-xl lg:text-2xl font-bold text-green-800">{businessIdeas.length}</div>
                      <div className="text-xs lg:text-sm text-green-700">Ideas de Negocio</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl border-2 border-purple-400">
                      <Heart className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 text-purple-700" />
                      <div className="text-xl lg:text-2xl font-bold text-purple-800">{motivationalQuotes.length}</div>
                      <div className="text-xs lg:text-sm text-purple-700">Frases Motivacionales</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Manage Business Ideas */}
              <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-white to-gray-100">
                <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <Lightbulb className="h-4 w-4 lg:h-5 lg:w-5" />
                    Gestionar Ideas de Negocio
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="mb-4 flex flex-col sm:flex-row gap-2">
                    <Input
                      value={newIdeaText}
                      onChange={(e) => setNewIdeaText(e.target.value)}
                      placeholder="Nueva idea de negocio..."
                      className="flex-1 touch-target"
                    />
                    <Button onClick={addBusinessIdea} className="bg-blue-600 hover:bg-blue-700 touch-target">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto mobile-scroll">
                    {businessIdeas.map((idea, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                        {editingIdea === index ? (
                          <>
                            <Input
                              value={editIdeaText}
                              onChange={(e) => setEditIdeaText(e.target.value)}
                              className="flex-1 touch-target"
                            />
                            <Button
                              onClick={saveEditIdea}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 touch-target"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => setEditingIdea(null)}
                              size="sm"
                              variant="outline"
                              className="touch-target"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-xs lg:text-sm">{idea}</span>
                            <Button
                              onClick={() => editBusinessIdea(index)}
                              size="sm"
                              variant="outline"
                              className="touch-target"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => deleteBusinessIdea(index)}
                              size="sm"
                              variant="destructive"
                              className="touch-target"
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
              <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-white to-gray-100">
                <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <Heart className="h-4 w-4 lg:h-5 lg:w-5" />
                    Gestionar Frases Motivacionales
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="mb-4 flex flex-col sm:flex-row gap-2">
                    <Textarea
                      value={newQuoteText}
                      onChange={(e) => setNewQuoteText(e.target.value)}
                      placeholder="Nueva frase motivacional..."
                      className="flex-1 touch-target"
                      rows={2}
                    />
                    <Button onClick={addMotivationalQuote} className="bg-blue-600 hover:bg-blue-700 touch-target">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto mobile-scroll">
                    {motivationalQuotes.map((quote, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border">
                        {editingQuote === index ? (
                          <>
                            <Textarea
                              value={editQuoteText}
                              onChange={(e) => setEditQuoteText(e.target.value)}
                              className="flex-1 touch-target"
                              rows={2}
                            />
                            <div className="flex flex-col gap-1">
                              <Button
                                onClick={saveEditQuote}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 touch-target"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => setEditingQuote(null)}
                                size="sm"
                                variant="outline"
                                className="touch-target"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-xs lg:text-sm italic">"{quote}"</span>
                            <div className="flex flex-col gap-1">
                              <Button
                                onClick={() => editMotivationalQuote(index)}
                                size="sm"
                                variant="outline"
                                className="touch-target"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => deleteMotivationalQuote(index)}
                                size="sm"
                                variant="destructive"
                                className="touch-target"
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
                <Card className="border-2 border-yellow-400 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100">
                  <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <Crown className="h-4 w-4 lg:h-5 lg:w-5" />👑 Gestionar Usuarios (SOLO SUPER ADMIN)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    <div className="mb-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-200 border-2 border-yellow-400 rounded-lg">
                      <p className="text-xs lg:text-sm font-bold text-yellow-800 mb-2">🔐 ACCESO EXCLUSIVO</p>
                      <p className="text-xs text-yellow-700">Solo el Super Administrador puede crear nuevos usuarios</p>
                    </div>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Nombre de usuario"
                        className="touch-target"
                      />
                      <Input
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="touch-target"
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={newUserIsAdmin}
                          onCheckedChange={(checked) => setNewUserIsAdmin(checked as boolean)}
                          className="touch-target"
                        />
                        <Label className="text-xs lg:text-sm">Admin</Label>
                      </div>
                      <Button
                        onClick={addUser}
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 touch-target"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Usuario
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto mobile-scroll">
                      {appUsers.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-yellow-300"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm lg:text-base">{user.username}</span>
                              {user.isAdmin && <Crown className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-500" />}
                              {user.username === "admin" && (
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                                  SUPER ADMIN
                                </Badge>
                              )}
                              {user.isAdmin && user.username !== "admin" && (
                                <Badge variant="secondary" className="text-xs">
                                  Admin
                                </Badge>
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
                              className="touch-target"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mensaje para admins normales */}
              {isAdmin && !isSuperAdmin && (
                <Card className="border-2 border-gray-400 shadow-xl bg-gradient-to-br from-gray-100 to-slate-200">
                  <CardHeader className="bg-gradient-to-r from-gray-600 to-slate-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <Shield className="h-4 w-4 lg:h-5 lg:w-5" />🔒 Gestión de Usuarios Restringida
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    <div className="text-center">
                      <Crown className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-base lg:text-lg font-bold text-gray-700 mb-2">Acceso Limitado</p>
                      <p className="text-xs lg:text-sm text-gray-600">
                        Solo el Super Administrador puede crear nuevos usuarios
                      </p>
                      <div className="mt-4 p-3 bg-gray-200 rounded-lg">
                        <p className="text-xs text-gray-700">
                          <strong>Usuarios actuales:</strong> {appUsers.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Login Section */}
          {activeSection === "login" && (
            <Card className="border-2 border-gray-500 shadow-xl bg-gradient-to-br from-white to-gray-100">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                  <User className="h-4 w-4 lg:h-5 lg:w-5" />👤 Área de Usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                {!isLoggedIn ? (
                  <div className="max-w-md mx-auto space-y-4">
                    {!showRegister ? (
                      <>
                        {/* Login Form */}
                        <div>
                          <Label htmlFor="username" className="text-gray-800 font-semibold text-sm lg:text-base">
                            Usuario
                          </Label>
                          <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingresa tu usuario"
                            className="border-2 border-gray-400 focus:border-blue-600 touch-target"
                          />
                        </div>
                        <div>
                          <Label htmlFor="password" className="text-gray-800 font-semibold text-sm lg:text-base">
                            Contraseña
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Ingresa tu contraseña"
                              className="border-2 border-gray-400 focus:border-blue-600 touch-target pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                          onClick={handleLogin}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
                        >
                          🚀 Entrar
                        </Button>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">¿No tienes cuenta?</p>
                          <Button
                            onClick={() => setShowRegister(true)}
                            variant="outline"
                            className="w-full border-2 border-green-500 text-green-700 hover:bg-green-50 touch-target"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Crear Cuenta Nueva
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Register Form */}
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">🆕 Crear Cuenta Nueva</h3>
                          <p className="text-sm text-gray-600">Únete al Club de Interés Compuesto</p>
                        </div>
                        <div>
                          <Label
                            htmlFor="registerUsername"
                            className="text-gray-800 font-semibold text-sm lg:text-base"
                          >
                            Nombre de Usuario
                          </Label>
                          <Input
                            id="registerUsername"
                            type="text"
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                            placeholder="Elige tu nombre de usuario"
                            className="border-2 border-gray-400 focus:border-green-600 touch-target"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="registerPassword"
                            className="text-gray-800 font-semibold text-sm lg:text-base"
                          >
                            Contraseña
                          </Label>
                          <div className="relative">
                            <Input
                              id="registerPassword"
                              type={showPassword ? "text" : "password"}
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              placeholder="Crea una contraseña"
                              className="border-2 border-gray-400 focus:border-green-600 touch-target pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                        <div>
                          <Label htmlFor="confirmPassword" className="text-gray-800 font-semibold text-sm lg:text-base">
                            Confirmar Contraseña
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirma tu contraseña"
                              className="border-2 border-gray-400 focus:border-green-600 touch-target pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <Button
                          onClick={handleRegister}
                          className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 shadow-lg transform hover:scale-105 transition-all duration-200 touch-target"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />🎉 Crear Mi Cuenta
                        </Button>
                        <div className="text-center">
                          <Button
                            onClick={() => setShowRegister(false)}
                            variant="link"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ← Volver al Login
                          </Button>
                        </div>
                      </>
                    )}

                    {(loginMessage || registerMessage) && (
                      <Alert
                        className={
                          loginMessage.includes("Bienvenido") || registerMessage.includes("exitosamente")
                            ? "border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200"
                            : "border-red-400 bg-gradient-to-r from-red-100 to-pink-200"
                        }
                      >
                        <div className="flex items-center gap-2">
                          {loginMessage.includes("Bienvenido") || registerMessage.includes("exitosamente") ? (
                            <CheckCircle className="h-4 w-4 text-blue-700" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <AlertDescription
                            className={
                              loginMessage.includes("Bienvenido") || registerMessage.includes("exitosamente")
                                ? "text-blue-900 font-semibold text-sm lg:text-base"
                                : "text-red-800 font-semibold text-sm lg:text-base"
                            }
                          >
                            {loginMessage || registerMessage}
                          </AlertDescription>
                        </div>
                      </Alert>
                    )}

                    {!showRegister && (
                      <div className="text-center text-xs lg:text-sm text-gray-700 mt-4 p-4 bg-gradient-to-r from-gray-200 to-slate-300 rounded-lg border-2 border-gray-500">
                        <p className="font-bold mb-3 text-black">👥 Usuarios de prueba disponibles:</p>
                        <div className="space-y-2">
                          <p className="bg-gradient-to-r from-yellow-100 to-orange-200 p-2 rounded border-2 border-yellow-400">
                            👑 <code className="bg-yellow-200 px-2 py-1 rounded font-bold">admin</code> /{" "}
                            <code className="bg-yellow-200 px-2 py-1 rounded font-bold">superder!!2</code>
                            <span className="text-xs text-yellow-700 ml-2">(SUPER ADMIN)</span>
                          </p>
                          <p className="bg-white p-2 rounded border">
                            👤 <code className="bg-gray-200 px-2 py-1 rounded font-bold">jose</code> /{" "}
                            <code className="bg-gray-200 px-2 py-1 rounded font-bold">clave1</code>
                          </p>
                          <p className="bg-white p-2 rounded border">
                            👤 <code className="bg-gray-200 px-2 py-1 rounded font-bold">maria</code> /{" "}
                            <code className="bg-gray-200 px-2 py-1 rounded font-bold">clave2</code>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-blue-700">
                      <CheckCircle className="h-8 w-8 lg:h-10 lg:w-10" />
                      <h3 className="text-2xl lg:text-3xl font-bold">🎉 ¡Sesión Iniciada!</h3>
                    </div>
                    <p className="text-gray-800 text-base lg:text-lg font-semibold">
                      Bienvenido de vuelta, {loggedInUser}
                    </p>
                    {isAdmin && <Badge className="bg-yellow-500 text-black">👑 Administrador</Badge>}
                    <p className="text-xs lg:text-sm text-gray-700 font-medium">
                      Tu progreso se guarda automáticamente
                    </p>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="border-2 border-gray-500 text-gray-700 hover:bg-gray-100 bg-transparent touch-target"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
