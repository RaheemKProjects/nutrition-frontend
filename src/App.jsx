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
import './App.css'

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
  const [newGoal, setNewGoal] = useState({ ...dietGoals })
  
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
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-base)' }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
      <NavBar activeTab={activeTab} onTabClick={onTabClick} />
    </div>
  )

  const NavBar = ({ activeTab, onTabClick }) => (
    <div className="fixed bottom-0 left-0 right-0 pb-safe z-50" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', height: '68px', padding: '10px 0' }}>
      <div className="flex justify-around items-end h-full">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 relative ${isActive ? '' : ''}`}
              style={{ color: isActive ? 'var(--primary-bright)' : 'var(--text-muted)' }}
            >
              <Icon className="w-6 h-6" style={{ opacity: isActive ? 1 : 0.5 }} />
              <span className="text-xs mt-1" style={{ color: isActive ? 'var(--primary-bright)' : 'var(--text-muted)' }}>{item.label}</span>
              {isActive && <div style={{ position: 'absolute', bottom: '-2px', width: '24px', height: '3px', background: 'var(--primary-bright)', borderRadius: '2px', boxShadow: '0 -2px 8px var(--primary-glow)' }} />}
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
    return (
      <Scanner 
        user={user} 
        onLogout={handleLogout}
        onNavigate={(screenId) => setScreen(screenId)}
      />
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
            <h1 className="page-title">Meal Plan</h1>
            <button 
              onClick={() => setShowGoalModal(true)}
              className="set-goals-btn"
            >
              Set Goals
            </button>
          </div>
          
          {/* Daily Progress */}
          <div className="card mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="section-title" style={{ color: 'var(--text-primary)' }}>Today's Progress</h3>
              <span className="label-text">{totalCalories} / {dietGoals.calories} kcal</span>
            </div>
            <div className="progress-track mb-3">
              <div 
                className="progress-bar transition-all" 
                style={{ width: `${Math.min((totalCalories / dietGoals.calories) * 100, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span style={{ color: 'var(--macro-protein)' }}>{totalProtein}g</span>
                <p className="label-text">Protein</p>
              </div>
              <div>
                <span style={{ color: 'var(--macro-carbs)' }}>{totalCarbs}g</span>
                <p className="label-text">Carbs</p>
              </div>
              <div>
                <span style={{ color: 'var(--macro-fat)' }}>{totalFat}g</span>
                <p className="label-text">Fat</p>
              </div>
            </div>
          </div>
          
          {/* Weekly Overview */}
          <div className="card mb-4">
            <h3 className="section-title mb-3" style={{ color: 'var(--text-primary)' }}>This Week</h3>
            <div className="flex justify-between gap-1">
              {days.map((day, index) => {
                const dayCalories = [1850, 2100, 1650, 1920, 2200, 2400, 1316][index]
                const percentage = Math.min((dayCalories / dietGoals.calories) * 100, 100)
                return (
                  <div key={day} className="flex flex-col items-center flex-1">
                    <div className="w-8 h-20 rounded-lg relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div 
                        className="absolute bottom-0 w-full rounded-lg transition-all"
                        style={{ 
                          height: `${percentage}%`,
                          background: index === new Date().getDay() - 1 
                            ? 'linear-gradient(180deg, #3b82f6, #1d4ed8)' 
                            : 'rgba(59,130,246,0.25)',
                          borderRadius: '8px 8px 0 0'
                        }}
                      />
                    </div>
                    <span className="label-text mt-1">{day}</span>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Meal Sections */}
          <div className="space-y-3">
            <h3 className="section-title" style={{ color: 'var(--text-primary)' }}>Today's Meals</h3>
            {meals.map((meal) => (
              <div key={meal.id} className="meal-section">
                <div className="flex justify-between items-center mb-2">
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{meal.name}</h4>
                  <span className="label-text">
                    {meal.items.reduce((s, i) => s + (i.calories || 0), 0)} kcal
                  </span>
                </div>
                {meal.items.length > 0 ? (
                  <div className="space-y-2">
                    {meal.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                        <span style={{ color: 'var(--primary-bright)', fontWeight: 600 }}>{item.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="label-text text-sm">No items added yet</p>
                )}
                <button className="add-food-link mt-2">+ Add Food</button>
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

  if (screen === 'analysis') {
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
    
    const weeklyData = [
      { day: 'Mon', calories: 1850 },
      { day: 'Tue', calories: 2100 },
      { day: 'Wed', calories: 1650 },
      { day: 'Thu', calories: 1920 },
      { day: 'Fri', calories: 2200 },
      { day: 'Sat', calories: 2400 },
      { day: 'Sun', calories: 1316 },
    ]
    
    const weeklyCalories = weeklyData.map(d => d.calories)
    const dailyAverage = weeklyCalories.reduce((a, b) => a + b, 0) / 7
    
    const macroData = [
      { name: 'Protein', value: consumed.protein, color: 'var(--macro-protein)' },
      { name: 'Carbs', value: consumed.carbs, color: 'var(--macro-carbs)' },
      { name: 'Fat', value: consumed.fat, color: 'var(--macro-fat)' }
    ]
    
    const insights = [
      { title: 'Start Tracking', description: 'Add meals to your plan to get personalized nutrition insights.', icon: Beef },
      { title: 'Set Goals', description: 'Use the Set Goals button on the Plan page to customize your daily targets.', icon: Wheat },
      { title: 'Track Progress', description: 'Monitor your daily calorie and macro intake on this Analysis page.', icon: Droplets },
    ]
    
    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
            <p className="text-white text-sm font-medium">{payload[0].value} kcal</p>
          </div>
        )
      }
      return null
    }
    
    return (
      <Layout activeTab="analysis" onTabClick={(id) => setScreen(id)}>
        <div className="flex-1 flex flex-col p-4 pt-16 overflow-y-auto">
          <h1 className="page-title mb-6">Analysis</h1>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="stat-card">
              <p className="label-text mb-1">Calories Today</p>
              <p style={{ fontSize: '36px', fontWeight: 700, color: 'var(--macro-carbs)' }}>{consumed.calories}</p>
              <p className="label-text">/ {dietGoals.calories} kcal</p>
            </div>
            <div className="stat-card">
              <p className="label-text mb-1">Daily Average</p>
              <p style={{ fontSize: '36px', fontWeight: 700, color: 'var(--primary-bright)' }}>{Math.round(dailyAverage)}</p>
              <p className="label-text">kcal / day</p>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Food Remaining</h3>
              <span className="text-xs text-gray-400">{Math.round((remaining.calories / dietGoals.calories) * 100)}% left</span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-[#0F2C5C] to-[#0F2C5C] rounded-full transition-all" 
                style={{ width: `${Math.min((remaining.calories / dietGoals.calories) * 100, 100)}%` }} 
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">Protein</p>
                <p className="text-sm font-bold text-red-400">{remaining.protein}g</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Carbs</p>
                <p className="text-sm font-bold text-amber-400">{remaining.carbs}g</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fat</p>
                <p className="text-sm font-bold text-yellow-400">{remaining.fat}g</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-900 rounded-xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Macronutrients</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#9ca3af' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-3 mt-2">
                {macroData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Weekly Calories</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: '#6b7280', fontSize: 10 }} 
                    axisLine={{ stroke: '#374151' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="calories" fill="#0F2C5C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <h3 className="text-white font-semibold mb-3">AI Nutritional Insights</h3>
            <div className="space-y-3">
              {insights.map((insight, index) => {
                const Icon = insight.icon
                return (
                  <div key={index} className="flex gap-3 p-3 bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-[#0F2C5C]/20 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#0F2C5C]" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{insight.title}</p>
                      <p className="text-gray-400 text-xs mt-1">{insight.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Recent Meals</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Grilled Chicken</p>
                    <p className="text-gray-500 text-xs">12:30 PM</p>
                  </div>
                </div>
                <span className="text-orange-500 font-medium">450 kcal</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Wheat className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Brown Rice</p>
                    <p className="text-gray-500 text-xs">7:00 AM</p>
                  </div>
                </div>
                <span className="text-amber-500 font-medium">320 kcal</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Beef className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Salmon</p>
                    <p className="text-gray-500 text-xs">6:30 PM</p>
                  </div>
                </div>
                <span className="text-red-500 font-medium">470 kcal</span>
              </div>
            </div>
          </div>
        </div>
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