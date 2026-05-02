import { useState, useRef, useEffect } from 'react'
import { Camera, RotateCcw, Check, Loader2, Flame, Wheat, Beef, Droplets, Apple, Home, Calendar, BarChart3, Settings, ScanLine, ScanBarcode, FileText, Library, User, Lock, Mail, ArrowRight, LogOut } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import Scanner from './Scanner'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from './components/ui/drawer'
import './index.css'

const MealIconBreakfast = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
)

const MealIconLunch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M4 6h16" />
    <path d="M4 10h16" />
    <circle cx="8" cy="14" r="2" />
  </svg>
)

const MealIconDinner = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
)

const MealIconSnack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 22c4.97 0 9-4.03 9-9 0-4.97-9-13-9-13S3 8.03 3 13c0 4.97 4.03 9 9 9z" />
    <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M12 9V4" />
  </svg>
)

const QuickAddIconBreakfast = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
)

const QuickAddIconLunch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M4 6h16" />
    <path d="M4 10h16" />
    <circle cx="8" cy="14" r="2" />
  </svg>
)

const QuickAddIconDinner = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
)

const QuickAddIconSnack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 22c4.97 0 9-4.03 9-9 0-4.97-9-13-9-13S3 8.03 3 13c0 4.97 4.03 9 9 9z" />
    <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M12 9V4" />
  </svg>
)

const mealTypeIcons = {
  'Breakfast': { icon: MealIconBreakfast, quickAddIcon: QuickAddIconBreakfast },
  'Lunch': { icon: MealIconLunch, quickAddIcon: QuickAddIconLunch },
  'Dinner': { icon: MealIconDinner, quickAddIcon: QuickAddIconDinner },
  'Snacks': { icon: MealIconSnack, quickAddIcon: QuickAddIconSnack },
}

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

const BarcodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M3 5v14" />
    <path d="M8 5v14" />
    <path d="M12 5v14" />
    <path d="M17 5v14" />
    <path d="M21 5v14" />
  </svg>
)

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </svg>
)

const mockNutritionData = {
  calories: 650,
  protein: 48,
  carbs: 12,
  fat: 42,
  fiber: 3,
  sugar: 2,
  sodium: 890,
  cholesterol: 145,
  weight: 285,
  serving: "1 plate (285g)",
  nutrients: [
    { name: "Iron", amount: 4.2, unit: "mg", daily: 23 },
    { name: "Vitamin A", amount: 95, unit: "IU", daily: 2 },
    { name: "Vitamin C", amount: 0, unit: "mg", daily: 0 },
    { name: "Calcium", amount: 28, unit: "mg", daily: 3 },
    { name: "Potassium", amount: 420, unit: "mg", daily: 12 },
  ]
}

function App() {
  const [screen, setScreen] = useState('home')
  const [capturedImage, setCapturedImage] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [cameraPermission, setCameraPermission] = useState('prompt')
  
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  
  const [dietGoals, setDietGoals] = useState({
    calories: 2000,
    protein: 120,
    carbs: 250,
    fat: 70
  })
  
  const [meals, setMeals] = useState([
    { id: 1, name: 'Breakfast', items: [{ name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3 }, { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 }] },
    { id: 2, name: 'Lunch', items: [{ name: 'Grilled Chicken', calories: 350, protein: 40, carbs: 20, fat: 12 }, { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 2 }] },
    { id: 3, name: 'Dinner', items: [{ name: 'Salmon', calories: 400, protein: 45, carbs: 0, fat: 22 }] },
    { id: 4, name: 'Snacks', items: [{ name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0 }] }
  ])
  
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showPlanScanner, setShowPlanScanner] = useState(false)
  const [newGoal, setNewGoal] = useState({ ...dietGoals })
  
  const [logbookEntries, setLogbookEntries] = useState([
    { id: '1', name: 'Grilled Chicken', meal: 'dinner', calories: 450, protein: 42, carbs: 8, fat: 28, timestamp: new Date(), scannedViaBarcode: true },
    { id: '2', name: 'Brown Rice', meal: 'lunch', calories: 216, protein: 5, carbs: 45, fat: 2, timestamp: new Date(Date.now() - 86400000), scannedViaBarcode: false },
    { id: '3', name: 'Oatmeal', meal: 'breakfast', calories: 150, protein: 5, carbs: 27, fat: 3, timestamp: new Date(Date.now() - 172800000), scannedViaBarcode: false },
    { id: '4', name: 'Salmon', meal: 'dinner', calories: 400, protein: 40, carbs: 0, fat: 22, timestamp: new Date(Date.now() - 259200000), scannedViaBarcode: true },
    { id: '5', name: 'Banana', meal: 'snack', calories: 105, protein: 1, carbs: 27, fat: 0, timestamp: new Date(Date.now() - 345600000), scannedViaBarcode: false },
  ])
  const [expandedEntry, setExpandedEntry] = useState(null)
  const [logbookFilter, setLogbookFilter] = useState('All')
  const [logbookSearch, setLogbookSearch] = useState('')
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  
  useEffect(() => {
    const savedUser = localStorage.getItem('nutrisnap_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])
  
  const handleRegister = () => {
    setAuthLoading(true)
    setAuthError('')
    
    setTimeout(() => {
      if (!authEmail || !authPassword || !authName) {
        setAuthError('Please fill in all fields')
        setAuthLoading(false)
        return
      }
      
      if (!authEmail.includes('@')) {
        setAuthError('Please enter a valid email')
        setAuthLoading(false)
        return
      }
      
      if (authPassword.length < 6) {
        setAuthError('Password must be at least 6 characters')
        setAuthLoading(false)
        return
      }
      
      const users = JSON.parse(localStorage.getItem('nutrisnap_users') || '[]')
      
      if (users.find(u => u.email === authEmail)) {
        setAuthError('Email already registered')
        setAuthLoading(false)
        return
      }
      
      const newUser = {
        id: Date.now(),
        name: authName,
        email: authEmail,
        password: authPassword,
        createdAt: new Date().toISOString()
      }
      
      users.push(newUser)
      localStorage.setItem('nutrisnap_users', JSON.stringify(users))
      
      localStorage.setItem('nutrisnap_user', JSON.stringify(newUser))
      setUser(newUser)
      setAuthLoading(false)
      setScreen('home')
    }, 1000)
  }
  
  const handleLogin = () => {
    setAuthLoading(true)
    setAuthError('')
    
    setTimeout(() => {
      if (!authEmail || !authPassword) {
        setAuthError('Please enter email and password')
        setAuthLoading(false)
        return
      }
      
      const users = JSON.parse(localStorage.getItem('nutrisnap_users') || '[]')
      const foundUser = users.find(u => u.email === authEmail && u.password === authPassword)
      
      if (!foundUser) {
        setAuthError('Invalid email or password')
        setAuthLoading(false)
        return
      }
      
      localStorage.setItem('nutrisnap_user', JSON.stringify(foundUser))
      setUser(foundUser)
      setAuthLoading(false)
      setScreen('home')
    }, 1000)
  }
  
  const handleLogout = () => {
    localStorage.removeItem('nutrisnap_user')
    setUser(null)
    setAuthEmail('')
    setAuthPassword('')
    setAuthName('')
    setScreen('login')
  }
  
  const AuthScreen = () => (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">NutriSnap</h1>
          <p className="text-gray-400">
            {authMode === 'login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-6 space-y-4">
          {authMode === 'register' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Full Name"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0F2C5C]"
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0F2C5C]"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0F2C5C]"
            />
          </div>
          
          {authError && (
            <p className="text-red-500 text-sm text-center">{authError}</p>
          )}
          
          <Button
            onClick={authMode === 'login' ? handleLogin : handleRegister}
            disabled={authLoading}
            className="w-full bg-[#0F2C5C] hover:bg-[#0a2349] py-3"
          >
            {authLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          <div className="text-center pt-4">
            <button
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login')
                setAuthError('')
              }}
              className="text-gray-400 text-sm hover:text-white"
            >
              {authMode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const checkCameraSupport = () => {
    try {
      const nav = window.navigator
      if (!nav) return false
      
      const mediaDevices = nav.mediaDevices
      if (!mediaDevices) return false
      
      if (typeof mediaDevices.getUserMedia !== 'function') return false
      
      return true
    } catch (e) {
      console.log('Camera check error:', e)
      return false
    }
  }

  const checkCameraPermission = async () => {
    const isSupported = checkCameraSupport()
    if (!isSupported) {
      alert('Camera API is not supported on this device/browser.')
      setCameraPermission('denied')
      return
    }
    
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' })
      setCameraPermission(permissionStatus.state)
      permissionStatus.onchange = () => setCameraPermission(permissionState.state)
      alert(`Current camera permission: ${permissionStatus.state}`)
    } catch (err) {
      console.log('Permission API not supported, trying direct camera access')
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop())
        setCameraPermission('granted')
        alert('Camera is accessible!')
      } catch (e) {
        setCameraPermission('denied')
        alert('Cannot access camera. Please check device settings.')
      }
    }
  }

  const requestCameraAccess = async () => {
    const isSupported = checkCameraSupport()
    if (!isSupported) {
      alert('Camera API is not supported on this device/browser.')
      return
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      stream.getTracks().forEach(track => track.stop())
      setCameraPermission('granted')
      alert('Camera access granted!')
    } catch (err) {
      console.error('Camera error:', err)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermission('denied')
        alert('Camera access denied. Please enable it in your device Settings.')
      } else if (err.name === 'NotFoundError') {
        alert('No camera found on this device.')
      } else {
        alert(`Camera error: ${err.message}`)
      }
    }
  }

  const openSettings = () => {
    window.open('app-settings:')
  }

  const startCamera = async () => {
    const isSupported = checkCameraSupport()
    if (!isSupported) {
      console.log('Camera API not supported')
      return
    }

    const video = videoRef.current
    if (!video) return
    
    const stopCurrentStream = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
    
    const tryCamera = async (facingMode) => {
      try {
        stopCurrentStream()
        
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        }
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = stream
        video.srcObject = stream
        
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(resolve)
          }
          setTimeout(resolve, 2000)
        })
        
        return true
      } catch (err) {
        console.log(`Camera failed with ${facingMode}:`, err.message)
        return false
      }
    }
    
    const success = await tryCamera({ ideal: 'environment' })
    if (!success) {
      await tryCamera({ ideal: 'user' })
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg')
      setCapturedImage(imageData)
      setScreen('preview')
      stopCamera()
    }
  }

  const retakePicture = () => {
    setCapturedImage(null)
    setScreen('camera')
    setTimeout(startCamera, 100)
  }

  const confirmPicture = () => {
    setScreen('loading')
    setTimeout(() => {
      setScreen('results')
      setDrawerOpen(true)
    }, 2000)
  }

  const resetApp = () => {
    setScreen('home')
    setCapturedImage(null)
    setDrawerOpen(false)
  }

  useEffect(() => {
    checkCameraPermission()
  }, [])

  useEffect(() => {
    if (screen === 'camera' || screen === 'home') {
      startCamera()
    }
    return () => stopCamera()
}, [screen])

  if (screen === 'login') {
    return <AuthScreen />
  }

  if (screen === 'register') {
    return <AuthScreen />
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plan', label: 'Plan', icon: Calendar },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const placeholderScreens = {
    scanfood: { title: 'Scan Food', icon: ScanLine },
    barcode: { title: 'Barcode Scanner', icon: ScanBarcode },
    foodlabel: { title: 'Food Label', icon: FileText },
    library: { title: 'Food Library', icon: Library },
  }

  const Layout = ({ children, activeTab, onTabClick }) => (
    <div className="min-h-screen w-full bg-black flex flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
      <NavBar activeTab={activeTab} onTabClick={onTabClick} />
    </div>
  )

  const NavBar = ({ activeTab, onTabClick }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 pb-safe z-50">
      <div className="flex justify-around items-end py-2 h-20">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onTabClick(item.id)
              }}
              className={`flex flex-col items-center justify-center py-2 px-4 ${isActive ? 'text-white' : 'text-gray-500'}`}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  const PlaceholderScreen = ({ screenId }) => {
    const screen = placeholderScreens[screenId]
    const Icon = screen.icon
    return (
      <Layout activeTab="home" onTabClick={(id) => setScreen(id)}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 pt-16 md:pt-8">
          <Icon className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{screen.title}</h2>
          <p className="text-gray-500 text-center">Coming soon...</p>
        </div>
      </Layout>
    )
}

  if (screen === 'home') {
    const totalConsumed = meals.reduce((sum, meal) => 
      sum + meal.items.reduce((s, item) => s + (item.calories || 0), 0), 0)
    const totalProtein = meals.reduce((sum, meal) => 
      sum + meal.items.reduce((s, item) => s + (item.protein || 0), 0), 0)
    const totalCarbs = meals.reduce((sum, meal) => 
      sum + meal.items.reduce((s, item) => s + (item.carbs || 0), 0), 0)
    const totalFat = meals.reduce((sum, meal) => 
      sum + meal.items.reduce((s, item) => s + (item.fat || 0), 0), 0)
    
    const consumed = {
      calories: totalConsumed,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat
    }
    
    const remaining = {
      calories: dietGoals.calories - consumed.calories,
      protein: dietGoals.protein - consumed.protein,
      carbs: dietGoals.carbs - consumed.carbs,
      fat: dietGoals.fat - consumed.fat
    }

    const quickAddMeals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
    
    const aiInsights = [
      { type: 'success', text: 'Your protein is on track — great job!' },
      { type: 'warning', text: 'You have only had 1 serving of vegetables today.' },
    ]

    const greeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Good morning'
      if (hour < 17) return 'Good afternoon'
      return 'Good evening'
    }
    
    const formatTime = (index) => {
      const times = ['7:00 AM', '12:30 PM', '6:30 PM', '3:00 PM']
      return times[index] || ''
    }
    
    const getTotalCalories = (mealIndex) => {
      const meal = meals[mealIndex]
      if (!meal || !meal.items) return 0
      return meal.items.reduce((sum, item) => sum + (item.calories || 0), 0)
    }

    const calorieProgress = Math.min((consumed.calories / dietGoals.calories) * 100, 100)
    const ringRadius = 90
    const ringCircumference = 2 * Math.PI * ringRadius
    const ringOffset = ringCircumference - (calorieProgress / 100) * ringCircumference
    
    return (
      <Layout activeTab="home" onTabClick={(id) => setScreen(id)}>
        <div className="flex-1 flex flex-col p-4 pt-16 overflow-y-auto">
          {/* SECTION 1: HEADER */}
          <div className="mb-6 mt-2">
            <h1 className="text-3xl font-bold text-white">{greeting()}</h1>
            <p className="text-gray-400 mt-1 text-base">
              You are {remaining.calories > 0 ? remaining.calories : 0} kcal away from your goal
            </p>
          </div>
          
          {/* SECTION 2: CALORIE RING */}
          <div className="bg-[#161B22] rounded-2xl p-6 mb-4 border border-[#1E2530]">
            <div className="flex flex-col items-center">
              <div className="relative w-52 h-52">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
                  <circle
                    cx="110"
                    cy="110"
                    r={ringRadius}
                    fill="none"
                    stroke="#1E2530"
                    strokeWidth="14"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r={ringRadius}
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    className="transition-all duration-1000 ease-out"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">{consumed.calories}</span>
                  <span className="text-gray-500 text-sm">of {dietGoals.calories} kcal</span>
                </div>
              </div>
            </div>
            
            {/* Macros Pills */}
            <div className="flex justify-center gap-3 mt-4">
              <div className="bg-[#0D1117] px-4 py-2 rounded-full border border-[#1E2530]">
                <span className="text-red-400 font-semibold">{consumed.protein}g</span>
                <span className="text-gray-500 text-xs ml-1">Protein</span>
              </div>
              <div className="bg-[#0D1117] px-4 py-2 rounded-full border border-[#1E2530]">
                <span className="text-amber-400 font-semibold">{consumed.carbs}g</span>
                <span className="text-gray-500 text-xs ml-1">Carbs</span>
              </div>
              <div className="bg-[#0D1117] px-4 py-2 rounded-full border border-[#1E2530]">
                <span className="text-yellow-400 font-semibold">{consumed.fat}g</span>
                <span className="text-gray-500 text-xs ml-1">Fat</span>
              </div>
            </div>
          </div>
          
          {/* SECTION 3: RECENT MEALS */}
          <div className="bg-[#161B22] rounded-2xl p-4 mb-4 border border-[#1E2530]">
            <h3 className="text-white font-semibold mb-4">Recent Meals</h3>
            <div className="space-y-3">
              {meals.slice(0, 4).map((meal, index) => {
                const iconData = mealTypeIcons[meal.name] || mealTypeIcons['Snacks']
                const IconComponent = iconData.icon
                return (
                  <div key={meal.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#EFF3FB] rounded-lg flex items-center justify-center">
                        <IconComponent />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{meal.name}</p>
                        <p className="text-gray-500 text-xs">{formatTime(index)}</p>
                      </div>
                    </div>
                    <span className="text-orange-500 font-medium">{getTotalCalories(index)} kcal</span>
                  </div>
                )
              })}
            </div>
            <button className="w-full mt-4 py-2 text-orange-500 text-sm font-medium border border-dashed border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors">
              + Add meal
            </button>
          </div>
          
          {/* SECTION 4: AI NUTRITIONAL INSIGHTS */}
          <div className="bg-[#161B22] rounded-2xl p-4 mb-4 border border-[#1E2530]">
            <h3 className="text-white font-semibold mb-4">AI Insights</h3>
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl ${
                    insight.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : 'bg-amber-500/10 border border-amber-500/30'
                  }`}
                >
                  <p className={`text-sm ${insight.type === 'success' ? 'text-green-400' : 'text-amber-400'}`}>
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 text-orange-500 text-sm font-medium flex items-center justify-center gap-2 hover:bg-orange-500/10 rounded-lg transition-colors">
              Ask AI for advice →
            </button>
          </div>
          
          {/* SECTION 5: QUICK ACTIONS */}
          <div className="mb-4">
            <h3 className="text-white font-semibold mb-4">Quick Add</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {quickAddMeals.map((mealType) => {
                const iconData = mealTypeIcons[mealType]
                const QuickIcon = iconData ? iconData.quickAddIcon : QuickAddIconSnack
                return (
                  <button
                    key={mealType}
                    className="flex-shrink-0 bg-[#161B22] px-4 py-3 rounded-xl border border-[#1E2530] hover:border-orange-500/50 transition-colors flex flex-col items-center min-w-[80px]"
                  >
                    <QuickIcon />
                    <span className="text-gray-400 text-xs mt-2">{mealType}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

if (screen === 'analysis') {
    const macroData = [
      { name: 'Protein', value: 48, color: '#ef4444' },
      { name: 'Carbs', value: 80, color: '#f59e0b' },
      { name: 'Fat', value: 42, color: '#eab308' }
    ]
    
    const formatDateHeader = (date) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today.getTime() - 86400000)
      const entryDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      
      if (entryDate.getTime() === today.getTime()) return 'Today'
      if (entryDate.getTime() === yesterday.getTime()) return 'Yesterday'
      
      return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
    }
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }
    
    const getMealIcon = (mealType) => {
      const mapping = {
        'breakfast': MealIconBreakfast,
        'lunch': MealIconLunch,
        'dinner': MealIconDinner,
        'snack': MealIconSnack,
      }
      return mapping[mealType] || MealIconSnack
    }
    
    const filteredEntries = logbookEntries.filter(entry => {
      if (logbookFilter !== 'All' && logbookFilter !== 'Barcode') {
        if (entry.meal.toLowerCase() !== logbookFilter.toLowerCase()) return false
      }
      if (logbookFilter === 'Barcode' && !entry.scannedViaBarcode) return false
      if (logbookSearch && !entry.name.toLowerCase().includes(logbookSearch.toLowerCase())) return false
      return true
    })
    
    const groupedEntries = filteredEntries.reduce((groups, entry) => {
      const header = formatDateHeader(entry.timestamp)
      if (!groups[header]) groups[header] = []
      groups[header].push(entry)
      return groups
    }, {})
    
    const toggleExpand = (id) => {
      setExpandedEntry(expandedEntry === id ? null : id)
    }
    
    const filterOptions = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Barcode']
    
    const getMealLabel = (meal) => {
      return meal.charAt(0).toUpperCase() + meal.slice(1)
    }
    
    const weekEntries = logbookEntries.filter(e => {
      const weekAgo = new Date(Date.now() - 7 * 86400000)
      return e.timestamp >= weekAgo
    })
    const avgCalories = weekEntries.length > 0 
      ? Math.round(weekEntries.reduce((s, e) => s + e.calories, 0) / 7) 
      : 0
    const mostLogged = weekEntries.length > 0 
      ? Object.entries(weekEntries.reduce((counts, e) => {
          counts[e.name] = (counts[e.name] || 0) + 1
          return counts
        }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
      : 'None'
    
    return (
      <Layout activeTab="analysis" onTabClick={(id) => setScreen(id)}>
        <div className="flex-1 flex flex-col p-4 pt-16 overflow-y-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Analysis</h1>
          
          {/* Macronutrients Donut Chart */}
          <div className="bg-[#161B22] rounded-2xl p-4 mb-4 border border-[#1E2530]">
            <h3 className="text-white font-semibold mb-4">Macronutrients</h3>
            <div className="h-48 min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {macroData.map((macro) => (
                <div key={macro.name} className="text-center">
                  <span className="text-sm font-medium" style={{ color: macro.color }}>{macro.value}g</span>
                  <p className="text-xs text-gray-500">{macro.name}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Food Logbook Section */}
          <div className="bg-[#161B22] rounded-2xl p-4 mb-4 border border-[#1E2530]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Food Logbook</h3>
              <button className="p-2">
                <FilterIcon />
              </button>
            </div>
            
            {/* Summary Row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <p className="text-white font-semibold text-lg">{weekEntries.length}</p>
                <p className="text-gray-500 text-xs">logged this week</p>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <p className="text-white font-semibold text-lg">{avgCalories}</p>
                <p className="text-gray-500 text-xs">kcal / day</p>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <p className="text-orange-500 font-semibold text-xs truncate">{mostLogged}</p>
                <p className="text-gray-500 text-xs">most logged</p>
              </div>
            </div>
            
            {/* Search and Filters */}
            <input
              type="text"
              placeholder="Search foods..."
              value={logbookSearch}
              onChange={(e) => setLogbookSearch(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3 py-2 text-white text-sm mb-3 placeholder-gray-500"
            />
            
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLogbookFilter(filter)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    logbookFilter === filter
                      ? 'bg-orange-500 text-white'
                      : 'bg-[#1E2530] text-gray-400'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {/* Log Entries */}
            {filteredEntries.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <ClipboardIcon />
                <p className="text-white text-sm mt-4">No foods logged yet</p>
                <p className="text-gray-500 text-xs mt-1">Scan or search foods to start tracking</p>
              </div>
            ) : (
              Object.entries(groupedEntries).map(([dateHeader, entries]) => (
                <div key={dateHeader} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">{dateHeader}</span>
                    <div className="flex-1 h-px bg-[#1E2530]" />
                  </div>
                  <div className="space-y-2">
                    {entries.map((entry) => {
                      const MealIcon = getMealIcon(entry.meal)
                      const isExpanded = expandedEntry === entry.id
                      return (
                        <div 
                          key={entry.id}
                          className="bg-[#161B22] rounded-xl p-3 border border-[#1E2530] overflow-hidden transition-all duration-300"
                        >
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleExpand(entry.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#EFF3FB] rounded-lg flex items-center justify-center">
                                <MealIcon />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{entry.name}</p>
                                <p className="text-gray-500 text-xs">{getMealLabel(entry.meal)} - {formatTime(entry.timestamp)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-orange-500 text-sm font-semibold">{entry.calories} kcal</p>
                              {entry.scannedViaBarcode && (
                                <div className="flex justify-end mt-1">
                                  <BarcodeIcon />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Expanded Macro Breakdown */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-[#1E2530]">
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-red-400">Protein</span>
                                    <span className="text-gray-400">{entry.protein}g</span>
                                  </div>
                                  <div className="h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-red-500 rounded-full"
                                      style={{ width: `${Math.min((entry.protein / 60) * 100, 100)}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-amber-400">Carbs</span>
                                    <span className="text-gray-400">{entry.carbs}g</span>
                                  </div>
                                  <div className="h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-amber-500 rounded-full"
                                      style={{ width: `${Math.min((entry.carbs / 100) * 100, 100)}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-yellow-400">Fat</span>
                                    <span className="text-gray-400">{entry.fat}g</span>
                                  </div>
                                  <div className="h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-yellow-500 rounded-full"
                                      style={{ width: `${Math.min((entry.fat / 50) * 100, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Layout>
    )
  }

  if (screen === 'plan') {
    const totalCalories = meals.reduce((sum, meal) => 
      sum + meal.items.reduce((s, item) => s + (item.calories || 0), 0), 0)
    const totalProtein = meals.reduce((sum, meal) => 
      sum + meal.items.reduce((s, item) => s + (item.protein || 0), 0), 0)
    const totalCarbs = meals.reduce((sum, meal) => 
      sum + meal.items.reduce((s, item) => s + (item.carbs || 0), 0), 0)
    const totalFat = meals.reduce((sum, meal) => 
      sum + meal.items.reduce((s, item) => s + (item.fat || 0), 0), 0)
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    return (
      <Layout activeTab="plan" onTabClick={(id) => setScreen(id)}>
        <div className="flex-1 flex flex-col p-4 pt-16 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Meal Plan</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowPlanScanner(true)}
                className="bg-[#0F2C5C] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1"
              >
                <Camera className="w-4 h-4" />
                Scan Food
              </button>
              <button 
                onClick={() => setShowGoalModal(true)}
                className="bg-[#0F2C5C] text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Set Goals
              </button>
            </div>
          </div>
          
          {showPlanScanner && (
            <div className="fixed inset-0 z-[100] bg-black flex flex-col">
              <Scanner 
                user={user} 
                onLogout={handleLogout}
                onNavigate={(screenId) => {
                  if (screenId) setScreen(screenId)
                }}
                onClose={() => setShowPlanScanner(false)}
              />
            </div>
          )}
          
          {/* Daily Progress */}
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold">Today's Progress</h3>
              <span className="text-xs text-gray-400">{totalCalories} / {dietGoals.calories} kcal</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-[#0F2C5C] rounded-full transition-all" 
                style={{ width: `${Math.min((totalCalories / dietGoals.calories) * 100, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-red-400">{totalProtein}g</span>
                <p className="text-gray-500">Protein</p>
              </div>
              <div>
                <span className="text-amber-400">{totalCarbs}g</span>
                <p className="text-gray-500">Carbs</p>
              </div>
              <div>
                <span className="text-yellow-400">{totalFat}g</span>
                <p className="text-gray-500">Fat</p>
              </div>
            </div>
          </div>
          
          {/* Weekly Overview */}
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <h3 className="text-white font-semibold mb-3">This Week</h3>
            <div className="flex justify-between gap-1">
              {days.map((day, index) => {
                const dayCalories = [1850, 2100, 1650, 1920, 2200, 2400, 1316][index]
                const percentage = Math.min((dayCalories / dietGoals.calories) * 100, 100)
                return (
                  <div key={day} className="flex flex-col items-center flex-1">
                    <div className="w-8 h-20 bg-gray-800 rounded-lg relative overflow-hidden">
                      <div 
                        className="absolute bottom-0 w-full bg-[#0F2C5C] rounded-lg transition-all"
                        style={{ height: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{day}</span>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Meal Sections */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Today's Meals</h3>
            {meals.map((meal) => (
              <div key={meal.id} className="bg-gray-900 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-white font-medium">{meal.name}</h4>
                  <span className="text-xs text-gray-400">
                    {meal.items.reduce((s, i) => s + (i.calories || 0), 0)} kcal
                  </span>
                </div>
                {meal.items.length > 0 ? (
                  <div className="space-y-2">
                    {meal.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{item.name}</span>
                        <span className="text-[#0F2C5C]">{item.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No items added yet</p>
                )}
                <button className="mt-2 text-[#0F2C5C] text-sm font-medium">+ Add Food</button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Goal Modal */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-sm">
              <h3 className="text-white font-semibold text-lg mb-4">Set Daily Goals</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Calories (kcal)</label>
                  <input 
                    type="number" 
                    value={newGoal.calories}
                    onChange={(e) => setNewGoal({...newGoal, calories: Number(e.target.value)})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Protein (g)</label>
                  <input 
                    type="number" 
                    value={newGoal.protein}
                    onChange={(e) => setNewGoal({...newGoal, protein: Number(e.target.value)})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Carbs (g)</label>
                  <input 
                    type="number" 
                    value={newGoal.carbs}
                    onChange={(e) => setNewGoal({...newGoal, carbs: Number(e.target.value)})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Fat (g)</label>
                  <input 
                    type="number" 
                    value={newGoal.fat}
                    onChange={(e) => setNewGoal({...newGoal, fat: Number(e.target.value)})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setDietGoals(newGoal)
                    setShowGoalModal(false)
                  }}
                  className="flex-1 bg-[#0F2C5C] text-white py-2 rounded-lg font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    )
  }

  if (screen === 'settings') {
    return (
      <Layout activeTab="settings" onTabClick={(id) => setScreen(id)}>
        <div className="pt-16 md:pt-8 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#0F2C5C] rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{user?.name}</h3>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-3">Camera Access</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Camera Permission</span>
                  <span className={`text-sm font-medium ${
                    cameraPermission === 'granted' ? 'text-[#0F2C5C]' : 
                    cameraPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {cameraPermission === 'granted' ? 'Allowed' : 
                     cameraPermission === 'denied' ? 'Denied' : 'Not Set'}
                  </span>
                </div>
                
                <Button
                  onClick={requestCameraAccess}
                  className="w-full bg-[#0F2C5C] hover:bg-[#0a2349]"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Request Camera Access
                </Button>
                
                <Button
                  variant="outline"
                  onClick={checkCameraPermission}
                  className="w-full border-gray-600 text-white"
                >
                  Check Permission Status
                </Button>
                
                {cameraPermission === 'denied' && (
                  <Button
                    variant="outline"
                    onClick={openSettings}
                    className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Open Device Settings
                  </Button>
                )}
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">About</h3>
              <p className="text-sm text-gray-400">NutriSnap v1.0.0</p>
              <p className="text-sm text-gray-400 mt-1">Track your nutrition effortlessly</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (screen === 'scanfood') return <PlaceholderScreen screenId="scanfood" />
  if (screen === 'barcode') return <PlaceholderScreen screenId="barcode" />
  if (screen === 'foodlabel') return <PlaceholderScreen screenId="foodlabel" />
  if (screen === 'library') return <PlaceholderScreen screenId="library" />

  if (screen === 'camera') {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 bg-black/30" />
        <Button
          size="icon"
          className="w-20 h-20 rounded-full bg-white/90 hover:bg-white text-gray-800 z-10"
          onClick={takePicture}
        >
          <Camera className="w-10 h-10" />
        </Button>
        <p className="absolute bottom-24 text-white font-medium z-10">Tap to capture</p>
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-white z-10"
          onClick={() => setScreen('home')}
        >
          <Home className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  if (screen === 'preview') {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col">
        <div className="flex-1 relative">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-8"
              onClick={retakePicture}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake
            </Button>
            <Button
              size="lg"
              className="bg-[#0F2C5C] hover:bg-[#0a2349] text-white px-8"
              onClick={confirmPicture}
            >
              <Check className="w-5 h-5 mr-2" />
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-gray-800 mb-4" />
        <p className="text-gray-600 font-medium">Analyzing your meal...</p>
        <p className="text-gray-400 text-sm mt-2">Detecting nutrients</p>
      </div>
    )
  }

  if (screen === 'results') {
    return (
      <div className="min-h-screen w-full relative">
        <img
          src={capturedImage}
          alt="Results background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Nutrition Facts</DrawerTitle>
              <DrawerDescription>{mockNutritionData.serving}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="bg-[#0F2C5C]/10 border-[#0F2C5C]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-[#0F2C5C] mb-1">
                      <Flame className="w-4 h-4" />
                      <span className="text-xs font-medium">Calories</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">{mockNutritionData.calories}</p>
                    <p className="text-xs text-orange-500">kcal</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#0F2C5C]/10 border-[#0F2C5C]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-[#0F2C5C] mb-1">
                      <Beef className="w-4 h-4" />
                      <span className="text-xs font-medium">Protein</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700">{mockNutritionData.protein}</p>
                    <p className="text-xs text-red-500">g</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#0F2C5C]/10 border-[#0F2C5C]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-[#0F2C5C] mb-1">
                      <Wheat className="w-4 h-4" />
                      <span className="text-xs font-medium">Carbs</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-700">{mockNutritionData.carbs}</p>
                    <p className="text-xs text-amber-500">g</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#0F2C5C]/10 border-[#0F2C5C]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-[#0F2C5C] mb-1">
                      <Droplets className="w-4 h-4" />
                      <span className="text-xs font-medium">Fat</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-700">{mockNutritionData.fat}</p>
                    <p className="text-xs text-yellow-500">g</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-700">Additional Nutrients</h4>
                {mockNutritionData.nutrients.map((nutrient, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <Apple className="w-4 h-4 text-[#0F2C5C]" />
                      <span className="text-sm text-gray-600">{nutrient.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{nutrient.amount}{nutrient.unit}</span>
                      <span className="text-xs text-gray-400 ml-1">({nutrient.daily}% DV)</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Weight</span>
                  <span className="font-medium">{mockNutritionData.weight}g</span>
                </div>
              </div>
            </div>
            <DrawerFooter className="pt-2">
              <Button onClick={resetApp} className="w-full">
                Scan Another Meal
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    )
  }

  return null
}

export default App