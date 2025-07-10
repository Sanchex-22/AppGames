"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Checkbox } from "./components/ui/checkbox"
import { Alert, AlertDescription } from "./components/ui/alert"
import { Textarea } from "./components/ui/textarea"
import { Badge } from "./components/ui/badge"
import {
  Calculator,
  TrendingUp,
  Lightbulb,
  Heart,
  User,
  CheckCircle,
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

export default function CompoundInterestClub() {
  const [activeSection, setActiveSection] = useState("calculadora")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [capital, setCapital] = useState(10)
  const [percentage, setPercentage] = useState(100)
  const [rounds, setRounds] = useState(7)
  const [results, setResults] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginMessage, setLoginMessage] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentQuote, setCurrentQuote] = useState("")
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState([])
  const [businessIdeas, setBusinessIdeas] = useState(defaultBusinessIdeas)
  const [motivationalQuotes, setMotivationalQuotes] = useState(defaultMotivationalQuotes)
  const [appUsers, setAppUsers] = useState([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  // Admin form states
  const [newIdeaText, setNewIdeaText] = useState("")
  const [newQuoteText, setNewQuoteText] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false)
  const [editingIdea, setEditingIdea] = useState(null)
  const [editingQuote, setEditingQuote] = useState(null)
  const [editIdeaText, setEditIdeaText] = useState("")
  const [editQuoteText, setEditQuoteText] = useState("")

  // User ideas states
  const [userIdeas, setUserIdeas] = useState([])
  const [newUserIdea, setNewUserIdea] = useState("")

  // New states for groups and registration
  const [chatGroups, setChatGroups] = useState([])
  const [currentGroup, setCurrentGroup] = useState("")
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

  const chatEndRef = useRef(null)

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
    const defaultUsers = [
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
      const defaultGroup = {
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
    const newResults = []
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
      const progressData = {
        capital,
        percentage,
        rounds,
        results: newResults,
      }
      localStorage.setItem(`progreso_${loggedInUser}`, JSON.stringify(progressData))
    }
  }

  const updateCurrent = (index, value) => {
    const updatedResults = [...results]
    updatedResults[index].current = value
    updatedResults[index].missing = Math.max(updatedResults[index].goal - value, 0)
    setResults(updatedResults)

    const totalGoalAmount = updatedResults.reduce((sum, round) => sum + round.goal, 0)
    const totalCurrentAmount = updatedResults.reduce((sum, round) => sum + round.current, 0)
    const progressPercentage = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0
    setOverallProgress(progressPercentage)

    if (isLoggedIn && loggedInUser) {
      const progressData = {
        capital,
        percentage,
        rounds,
        results: updatedResults,
      }
      localStorage.setItem(`progreso_${loggedInUser}`, JSON.stringify(progressData))
    }
  }

  const toggleCompleted = (index) => {
    const updatedResults = [...results]
    const wasCompleted = updatedResults[index].completed
    updatedResults[index].completed = !updatedResults[index].completed

    if (!wasCompleted && updatedResults[index].completed) {
      updatedResults[index].current = updatedResults[index].goal
      updatedResults[index].missing = 0

      if (isLoggedIn && loggedInUser && currentGroup) {
        const celebrationMessage = {
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
      const progressData = {
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
    const newUser = {
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
        const welcomeMessage = {
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

  const loadProgress = (user) => {
    const savedProgress = localStorage.getItem(`progreso_${user}`)
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress)
      setCapital(progressData.capital)
      setPercentage(progressData.percentage)
      setRounds(progressData.rounds)
      setResults(progressData.results)
    }
  }

  const handleLogout = () => {
    const currentOnline = JSON.parse(localStorage.getItem("onlineUsers") || "[]")
    const updatedOnline = currentOnline.filter((user) => user !== loggedInUser)
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
      const message = {
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

    const newGroup = {
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
    const welcomeMessage = {
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
    const joinMessage = {
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

  const joinUserToGroup = (groupId, username) => {
    const updatedGroups = chatGroups.map((group) => {
      if (group.id === groupId && !group.members.includes(username)) {
        return { ...group, members: [...group.members, username] }
      }
      return group
    })
    setChatGroups(updatedGroups)
    localStorage.setItem("chatGroups", JSON.stringify(updatedGroups))
  }

  const leaveGroup = (groupId) => {
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

  const copyGroupCode = (code) => {
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

  const editBusinessIdea = (index) => {
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

  const deleteBusinessIdea = (index) => {
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

  const editMotivationalQuote = (index) => {
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

  const deleteMotivationalQuote = (index) => {
    const updatedQuotes = motivationalQuotes.filter((_, i) => i !== index)
    setMotivationalQuotes(updatedQuotes)
    localStorage.setItem("motivationalQuotes", JSON.stringify(updatedQuotes))
  }

  const addUser = () => {
    if (newUsername.trim() && newUserPassword.trim() && isSuperAdmin) {
      const newUser = {
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

  const deleteUser = (username) => {
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

  const likeUserIdea = (ideaId) => {
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

  const deleteUserIdea = (ideaId, author) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 flex keyboard-adjust">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 safe-area-top">
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
        fixed lg:static inset-y-0 left-0 z-40 w-72 lg:w-64 bg-gradient-to-b from-black via-gray-900 to-slate-800 text-white transform transition-transform duration-300 ease-in-out shadow-2xl safe-area-inset
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-4 lg:p-6">
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
                  ADMIN
                </Badge>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 touch-target text-xs lg:text-sm"
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

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-0 safe-area-inset mobile-scroll">
        <div className="max-w-4xl mx-auto">
          {/* Login Section */}
          {activeSection === "login" && (
            <Card className="shadow-xl border-2 border-gray-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
                  <User className="h-5 w-5 lg:h-6 lg:w-6" />
                  {isLoggedIn ? "Mi Cuenta" : "Iniciar Sesión"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                {!isLoggedIn ? (
                  <div className="space-y-4 lg:space-y-6">
                    {!showRegister ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-sm lg:text-base">
                            Usuario
                          </Label>
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingresa tu usuario"
                            className="text-sm lg:text-base touch-target"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm lg:text-base">
                            Contraseña
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Ingresa tu contraseña"
                              className="text-sm lg:text-base touch-target pr-10"
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
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-sm lg:text-base touch-target"
                        >
                          Iniciar Sesión
                        </Button>
                        <div className="text-center">
                          <Button
                            variant="link"
                            onClick={() => setShowRegister(true)}
                            className="text-blue-600 hover:text-blue-800 text-sm lg:text-base"
                          >
                            ¿No tienes cuenta? Regístrate aquí
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="registerUsername" className="text-sm lg:text-base">
                            Nuevo Usuario
                          </Label>
                          <Input
                            id="registerUsername"
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                            placeholder="Elige un nombre de usuario"
                            className="text-sm lg:text-base touch-target"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registerPassword" className="text-sm lg:text-base">
                            Contraseña
                          </Label>
                          <div className="relative">
                            <Input
                              id="registerPassword"
                              type={showPassword ? "text" : "password"}
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              placeholder="Crea una contraseña"
                              className="text-sm lg:text-base touch-target pr-10"
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
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm lg:text-base">
                            Confirmar Contraseña
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirma tu contraseña"
                              className="text-sm lg:text-base touch-target pr-10"
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
                          className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-sm lg:text-base touch-target"
                        >
                          Crear Cuenta
                        </Button>
                        <div className="text-center">
                          <Button
                            variant="link"
                            onClick={() => setShowRegister(false)}
                            className="text-blue-600 hover:text-blue-800 text-sm lg:text-base"
                          >
                            ¿Ya tienes cuenta? Inicia sesión
                          </Button>
                        </div>
                      </>
                    )}
                    {(loginMessage || registerMessage) && (
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertDescription className="text-sm lg:text-base">
                          {loginMessage || registerMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-lg lg:text-xl font-semibold text-green-600">¡Sesión activa!</div>
                    <div className="text-sm lg:text-base text-gray-600">
                      Bienvenido, <strong>{loggedInUser}</strong>
                    </div>
                    {isSuperAdmin && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        SUPER ADMINISTRADOR
                      </Badge>
                    )}
                    {isAdmin && !isSuperAdmin && <Badge variant="secondary">ADMINISTRADOR</Badge>}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Calculator Section */}
          {activeSection === "calculadora" && (
            <Card className="shadow-xl border-2 border-gray-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
                  <Calculator className="h-5 w-5 lg:h-6 lg:w-6" />
                  Calculadora de Interés Compuesto
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="capital" className="text-sm lg:text-base">
                      Capital Inicial ($)
                    </Label>
                    <Input
                      id="capital"
                      type="number"
                      value={capital}
                      onChange={(e) => setCapital(Number(e.target.value))}
                      className="text-sm lg:text-base touch-target"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentage" className="text-sm lg:text-base">
                      Porcentaje de Ganancia (%)
                    </Label>
                    <Input
                      id="percentage"
                      type="number"
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                      className="text-sm lg:text-base touch-target"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rounds" className="text-sm lg:text-base">
                      Número de Vueltas
                    </Label>
                    <Input
                      id="rounds"
                      type="number"
                      value={rounds}
                      onChange={(e) => setRounds(Number(e.target.value))}
                      className="text-sm lg:text-base touch-target"
                    />
                  </div>
                </div>
                <Button
                  onClick={calculateInterest}
                  className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-sm lg:text-base touch-target"
                >
                  Calcular Interés Compuesto
                </Button>

                {results.length > 0 && (
                  <div className="mt-6 lg:mt-8 space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 lg:p-6 rounded-lg border border-blue-200">
                      <h3 className="text-lg lg:text-xl font-bold text-blue-800 mb-2">Resumen Final</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm lg:text-base">
                        <div>
                          <span className="font-semibold">Meta Final:</span>
                          <div className="text-lg lg:text-xl font-bold text-green-600">${totalGoal.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="font-semibold">Progreso Actual:</span>
                          <div className="text-lg lg:text-xl font-bold text-blue-600">${totalCurrent.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="font-semibold">Vueltas Completadas:</span>
                          <div className="text-lg lg:text-xl font-bold text-purple-600">
                            {completedRounds}/{results.length}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 lg:space-y-4">
                      {results.map((result, index) => (
                        <Card
                          key={index}
                          className={`border-2 transition-all duration-300 ${
                            result.completed
                              ? "border-green-400 bg-green-50 shadow-lg"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          <CardContent className="p-3 lg:p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                              <div className="flex items-center gap-2 lg:gap-3">
                                <Checkbox
                                  checked={result.completed}
                                  onCheckedChange={() => toggleCompleted(index)}
                                  className="touch-target"
                                />
                                <span className="font-bold text-blue-600 text-sm lg:text-base">
                                  Vuelta {result.round}
                                </span>
                              </div>

                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 text-xs lg:text-sm">
                                <div>
                                  <span className="font-semibold">Meta:</span>
                                  <div className="font-bold text-green-600">${result.goal.toFixed(2)}</div>
                                </div>
                                <div>
                                  <span className="font-semibold">Actual:</span>
                                  <Input
                                    type="number"
                                    value={result.current}
                                    onChange={(e) => updateCurrent(index, Number(e.target.value))}
                                    className="h-8 text-xs lg:text-sm touch-target"
                                    disabled={result.completed}
                                  />
                                </div>
                                <div>
                                  <span className="font-semibold">Falta:</span>
                                  <div className="font-bold text-red-600">${result.missing.toFixed(2)}</div>
                                </div>
                                <div>
                                  <span className="font-semibold">Idea:</span>
                                  <div className="text-gray-700 italic">{result.idea}</div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Progress Section */}
          {activeSection === "progreso" && (
            <Card className="shadow-xl border-2 border-gray-300">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
                  <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />
                  Mi Progreso
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                {!isLoggedIn ? (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-sm lg:text-base">
                      Debes iniciar sesión para ver tu progreso personalizado.
                    </AlertDescription>
                  </Alert>
                ) : results.length === 0 ? (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-sm lg:text-base">
                      Primero calcula tu interés compuesto para ver tu progreso.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4 lg:space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 lg:p-6 rounded-lg border border-purple-200">
                      <h3 className="text-lg lg:text-xl font-bold text-purple-800 mb-4">Progreso General</h3>
                      <div className="w-full bg-gray-200 rounded-full h-4 lg:h-6 mb-4">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-purple-800 h-4 lg:h-6 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(overallProgress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-center text-lg lg:text-xl font-bold text-purple-600">
                        {overallProgress.toFixed(1)}% Completado
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-3 lg:p-4 text-center">
                          <div className="text-lg lg:text-2xl font-bold text-green-600">{completedRounds}</div>
                          <div className="text-xs lg:text-sm text-green-700">Vueltas Completadas</div>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-3 lg:p-4 text-center">
                          <div className="text-lg lg:text-2xl font-bold text-blue-600">${totalCurrent.toFixed(0)}</div>
                          <div className="text-xs lg:text-sm text-blue-700">Capital Actual</div>
                        </CardContent>
                      </Card>
                      <Card className="border-purple-200 bg-purple-50">
                        <CardContent className="p-3 lg:p-4 text-center">
                          <div className="text-lg lg:text-2xl font-bold text-purple-600">${totalGoal.toFixed(0)}</div>
                          <div className="text-xs lg:text-sm text-purple-700">Meta Final</div>
                        </CardContent>
                      </Card>
                      <Card className="border-orange-200 bg-orange-50">
                        <CardContent className="p-3 lg:p-4 text-center">
                          <div className="text-lg lg:text-2xl font-bold text-orange-600">
                            ${(totalGoal - totalCurrent).toFixed(0)}
                          </div>
                          <div className="text-xs lg:text-sm text-orange-700">Por Alcanzar</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-2 lg:space-y-3">
                      <h4 className="text-base lg:text-lg font-semibold text-gray-800">Detalle por Vuelta:</h4>
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 rounded-lg border-2 ${
                            result.completed
                              ? "bg-green-100 border-green-300"
                              : result.current > 0
                                ? "bg-yellow-100 border-yellow-300"
                                : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 lg:gap-3 mb-2 sm:mb-0">
                            {result.completed ? (
                              <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-gray-400 rounded-full"></div>
                            )}
                            <span className="font-semibold text-sm lg:text-base">Vuelta {result.round}</span>
                          </div>
                          <div className="text-xs lg:text-sm text-gray-600">
                            ${result.current.toFixed(2)} / ${result.goal.toFixed(2)}
                          </div>
                          <div className="text-xs lg:text-sm italic text-gray-700 mt-1 sm:mt-0">{result.idea}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Ideas Section */}
          {activeSection === "ideas" && (
            <div className="space-y-4 lg:space-y-6">
              <Card className="shadow-xl border-2 border-gray-300">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
                    <Lightbulb className="h-5 w-5 lg:h-6 lg:w-6" />
                    Ideas de Negocio
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                    {businessIdeas.map((idea, index) => (
                      <Card
                        key={index}
                        className="border border-green-200 bg-green-50 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-3 lg:p-4">
                          <div className="flex items-start gap-2 lg:gap-3">
                            <Lightbulb className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 mt-1 flex-shrink-0" />
                            <span className="text-sm lg:text-base text-gray-800">{idea}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Shared Ideas */}
              <Card className="shadow-xl border-2 border-gray-300">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
                    <Users className="h-5 w-5 lg:h-6 lg:w-6" />
                    Ideas Compartidas por la Comunidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  {isLoggedIn && (
                    <div className="mb-4 lg:mb-6 space-y-3">
                      <Textarea
                        placeholder="Comparte tu idea de negocio con la comunidad..."
                        value={newUserIdea}
                        onChange={(e) => setNewUserIdea(e.target.value)}
                        className="text-sm lg:text-base touch-target"
                      />
                      <Button
                        onClick={shareUserIdea}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-sm lg:text-base touch-target"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Compartir Idea
                      </Button>
                    </div>
                  )}

                  {userIdeas.length === 0 ? (
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertDescription className="text-sm lg:text-base">
                        {isLoggedIn
                          ? "¡Sé el primero en compartir una idea de negocio!"
                          : "Inicia sesión para ver y compartir ideas de la comunidad."}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3 lg:space-y-4">
                      {userIdeas.map((idea) => (
                        <Card key={idea.id} className="border border-blue-200 bg-blue-50">
                          <CardContent className="p-3 lg:p-4">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 lg:gap-3">
                              <div className="flex-1">
                                <p className="text-sm lg:text-base text-gray-800 mb-2">{idea.idea}</p>
                                <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-600">
                                  <span className="font-semibold">Por: {idea.author}</span>
                                  <span>•</span>
                                  <span>{new Date(idea.timestamp).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isLoggedIn && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => likeUserIdea(idea.id)}
                                    className={`touch-target ${
                                      idea.likedBy.includes(loggedInUser) ? "text-red-600" : "text-gray-600"
                                    }`}
                                  >
                                    <Heart
                                      className={`h-4 w-4 mr-1 ${
                                        idea.likedBy.includes(loggedInUser) ? "fill-current" : ""
                                      }`}
                                    />
                                    {idea.likes}
                                  </Button>
                                )}
                                {(loggedInUser === idea.author || isAdmin) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteUserIdea(idea.id, idea.author)}
                                    className="text-red-600 hover:text-red-800 touch-target"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Motivation Section */}
          {activeSection === "motivacion" && (
            <Card className="shadow-xl border-2 border-gray-300">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
                  <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
                  Motivación Diaria
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <div className="text-center space-y-4 lg:space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 lg:p-8 rounded-lg border border-red-200">
                    <div className="text-lg lg:text-2xl font-bold text-red-800 mb-4 leading-relaxed">
                      "{currentQuote}"
                    </div>
                    <div className="text-sm lg:text-base text-red-600">
                      Frase {quoteIndex + 1} de {motivationalQuotes.length}
                    </div>
                  </div>
                  <Button
                    onClick={getRandomQuote}
                    className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-sm lg:text-base touch-target"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Nueva Frase Motivacional
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Section */}
          {activeSection === "chat" && (
            <Card className="shadow-xl border-2 border-gray-300">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-xl lg:text-2xl">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6" />
                    Chat Grupal
                    {currentGroupData && (
                      <Badge variant="secondary" className="ml-2 text-xs lg:text-sm">
                        {currentGroupData.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="text-sm lg:text-base">{currentGroupOnlineUsers.length}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                {!isLoggedIn ? (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-sm lg:text-base">
                      Debes iniciar sesión para participar en el chat grupal.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {/* Group Management */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreateGroup(true)}
                        className="text-xs lg:text-sm touch-target"
                      >
                        <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                        Crear Grupo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowJoinGroup(true)}
                        className="text-xs lg:text-sm touch-target"
                      >
                        <UserPlus className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                        Unirse a Grupo
                      </Button>
                      {currentGroupData && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyGroupCode(currentGroupData.code)}
                          className="text-xs lg:text-sm touch-target"
                        >
                          <Copy className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                          Copiar Código
                        </Button>
                      )}
                    </div>

                    {/* Create Group Modal */}
                    {showCreateGroup && (
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-3 lg:p-4 space-y-3">
                          <h4 className="font-semibold text-sm lg:text-base">Crear Nuevo Grupo</h4>
                          <Input
                            placeholder="Nombre del grupo"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="text-sm lg:text-base touch-target"
                          />
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="private"
                              checked={newGroupPrivate}
                              onCheckedChange={setNewGroupPrivate}
                              className="touch-target"
                            />
                            <Label htmlFor="private" className="text-xs lg:text-sm">
                              Grupo privado
                            </Label>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={createGroup}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-xs lg:text-sm touch-target"
                            >
                              Crear
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowCreateGroup(false)}
                              className="text-xs lg:text-sm touch-target"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Join Group Modal */}
                    {showJoinGroup && (
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-3 lg:p-4 space-y-3">
                          <h4 className="font-semibold text-sm lg:text-base">Unirse a Grupo</h4>
                          <Input
                            placeholder="Código del grupo"
                            value={joinGroupCode}
                            onChange={(e) => setJoinGroupCode(e.target.value.toUpperCase())}
                            className="text-sm lg:text-base touch-target"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={joinGroup}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-xs lg:text-sm touch-target"
                            >
                              Unirse
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowJoinGroup(false)}
                              className="text-xs lg:text-sm touch-target"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Group Selector */}
                    {chatGroups.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {chatGroups
                          .filter((group) => group.members.includes(loggedInUser))
                          .map((group) => (
                            <Button
                              key={group.id}
                              variant={currentGroup === group.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentGroup(group.id)}
                              className="text-xs lg:text-sm touch-target"
                            >
                              <Hash className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                              {group.name}
                              {group.isPrivate && <span className="ml-1">🔒</span>}
                            </Button>
                          ))}
                      </div>
                    )}

                    {currentGroup && currentGroupData ? (
                      <>
                        {/* Online Users */}
                        {currentGroupOnlineUsers.length > 0 && (
                          <div className="bg-gray-50 p-2 lg:p-3 rounded-lg">
                            <div className="text-xs lg:text-sm font-semibold text-gray-600 mb-1">
                              En línea ({currentGroupOnlineUsers.length}):
                            </div>
                            <div className="flex flex-wrap gap-1 lg:gap-2">
                              {currentGroupOnlineUsers.map((user) => (
                                <Badge key={user} variant="secondary" className="text-xs">
                                  {user}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Chat Messages */}
                        <div className="border rounded-lg h-64 lg:h-80 overflow-y-auto p-3 lg:p-4 bg-gray-50 mobile-scroll">
                          {currentGroupMessages.length === 0 ? (
                            <div className="text-center text-gray-500 text-sm lg:text-base">
                              No hay mensajes aún. ¡Sé el primero en escribir!
                            </div>
                          ) : (
                            <div className="space-y-2 lg:space-y-3">
                              {currentGroupMessages.map((message) => (
                                <div
                                  key={message.id}
                                  className={`p-2 lg:p-3 rounded-lg max-w-xs lg:max-w-sm ${
                                    message.user === loggedInUser
                                      ? "bg-blue-600 text-white ml-auto"
                                      : message.user.includes("Sistema")
                                        ? "bg-green-100 text-green-800 mx-auto text-center text-xs lg:text-sm"
                                        : "bg-white border"
                                  }`}
                                >
                                  {!message.user.includes("Sistema") && message.user !== loggedInUser && (
                                    <div className="text-xs font-semibold text-gray-600 mb-1">{message.user}</div>
                                  )}
                                  <div className="text-xs lg:text-sm">{message.message}</div>
                                  <div className="text-xs opacity-70 mt-1">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </div>
                                </div>
                              ))}
                              <div ref={chatEndRef} />
                            </div>
                          )}
                        </div>

                        {/* Message Input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Escribe tu mensaje..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            className="text-sm lg:text-base touch-target"
                          />
                          <Button onClick={sendMessage} className="bg-indigo-600 hover:bg-indigo-700 touch-target">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Group Info */}
                        <div className="text-xs lg:text-sm text-gray-600 bg-gray-50 p-2 lg:p-3 rounded-lg">
                          <div className="font-semibold">Información del grupo:</div>
                          <div>Código: {currentGroupData.code}</div>
                          <div>Creado por: {currentGroupData.createdBy}</div>
                          <div>Miembros: {currentGroupData.members.length}</div>
                          {currentGroupData.createdBy === loggedInUser && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => leaveGroup(currentGroup)}
                              className="mt-2 text-red-600 hover:text-red-800 text-xs touch-target"
                            >
                              Eliminar Grupo
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertDescription className="text-sm lg:text-base">
                          Crea un grupo o únete a uno existente para comenzar a chatear.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Admin Panel */}
          {activeSection === "admin" && isAdmin && (
            <div className="space-y-4 lg:space-y-6">
              <Card className="shadow-xl border-2 border-gray-300">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
                    <Shield className="h-5 w-5 lg:h-6 lg:w-6" />
                    Panel de Administración
                    {isSuperAdmin && <Crown className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-400" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  {/* Business Ideas Management */}
                  <div className="mb-6 lg:mb-8">
                    <h3 className="text-lg lg:text-xl font-bold mb-4 text-gray-800">Gestionar Ideas de Negocio</h3>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Nueva idea de negocio..."
                        value={newIdeaText}
                        onChange={(e) => setNewIdeaText(e.target.value)}
                        className="text-sm lg:text-base touch-target"
                      />
                      <Button onClick={addBusinessIdea} className="bg-green-600 hover:bg-green-700 touch-target">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {businessIdeas.map((idea, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 lg:p-3 bg-gray-50 rounded-lg">
                          {editingIdea === index ? (
                            <>
                              <Input
                                value={editIdeaText}
                                onChange={(e) => setEditIdeaText(e.target.value)}
                                className="flex-1 text-sm lg:text-base touch-target"
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
                                variant="outline"
                                size="sm"
                                className="touch-target"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="flex-1 text-sm lg:text-base">{idea}</span>
                              <Button
                                onClick={() => editBusinessIdea(index)}
                                variant="outline"
                                size="sm"
                                className="touch-target"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => deleteBusinessIdea(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-800 touch-target"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Motivational Quotes Management */}
                  <div className="mb-6 lg:mb-8">
                    <h3 className="text-lg lg:text-xl font-bold mb-4 text-gray-800">Gestionar Frases Motivacionales</h3>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Nueva frase motivacional..."
                        value={newQuoteText}
                        onChange={(e) => setNewQuoteText(e.target.value)}
                        className="text-sm lg:text-base touch-target"
                      />
                      <Button onClick={addMotivationalQuote} className="bg-red-600 hover:bg-red-700 touch-target">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto mobile-scroll">
                      {motivationalQuotes.map((quote, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 lg:p-3 bg-gray-50 rounded-lg">
                          {editingQuote === index ? (
                            <>
                              <Textarea
                                value={editQuoteText}
                                onChange={(e) => setEditQuoteText(e.target.value)}
                                className="flex-1 text-sm lg:text-base touch-target"
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
                                  variant="outline"
                                  size="sm"
                                  className="touch-target"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="flex-1 text-sm lg:text-base">{quote}</span>
                              <div className="flex flex-col gap-1">
                                <Button
                                  onClick={() => editMotivationalQuote(index)}
                                  variant="outline"
                                  size="sm"
                                  className="touch-target"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => deleteMotivationalQuote(index)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-800 touch-target"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Management (Super Admin Only) */}
                  {isSuperAdmin && (
                    <div>
                      <h3 className="text-lg lg:text-xl font-bold mb-4 text-gray-800">Gestionar Usuarios</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                        <Input
                          placeholder="Nuevo usuario..."
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="text-sm lg:text-base touch-target"
                        />
                        <Input
                          placeholder="Contraseña..."
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          className="text-sm lg:text-base touch-target"
                        />
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={newUserIsAdmin}
                            onCheckedChange={setNewUserIsAdmin}
                            className="touch-target"
                          />
                          <Label className="text-sm lg:text-base">Admin</Label>
                          <Button onClick={addUser} className="ml-auto bg-blue-600 hover:bg-blue-700 touch-target">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto mobile-scroll">
                        {appUsers.map((user) => (
                          <div
                            key={user.username}
                            className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm lg:text-base">{user.username}</span>
                              {user.isAdmin && (
                                <Badge variant="secondary" className="text-xs">
                                  Admin
                                </Badge>
                              )}
                              {user.username === "admin" && <Crown className="h-4 w-4 text-yellow-500" />}
                            </div>
                            {user.username !== "admin" && (
                              <Button
                                onClick={() => deleteUser(user.username)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-800 touch-target"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
