import Calendar from 'react-calendar'
import { useState, useRef, useEffect } from 'react'
import { Camera, RotateCcw, Check, Loader2, Flame, Wheat, Beef, Droplets, Home, Calendar as CalendarIcon, BarChart3, Settings, User, Lock, Mail, ArrowRight, LogOut } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import Scanner from './Scanner'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from './components/ui/drawer'
import './index.css'

const API_URL = 'https://food-ai-app-ud2m.onrender.com'

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

const NutritionCalendar = ({ onClose, logbookEntries }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const scansForDate = logbookEntries.filter(scan => {
    const scanDate = new Date(scan.timestamp).toDateString()
    return scanDate === selectedDate.toDateString()
  })

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayScans = logbookEntries.filter(scan => {
      return new Date(scan.timestamp).toDateString() === date.toDateString()
    })
    const totalCals = dayScans.reduce((sum, scan) => sum + (parseFloat(scan.calories) || 0), 0)
    return {
      day: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: date.toDateString(),
      calories: totalCals,
      scans: dayScans.length,
    }
  })

  const maxCals = Math.max(...weeklyData.map(d => d.calories), 1)
  const datesWithScans = logbookEntries.map(scan => new Date(scan.timestamp).toDateString())
  const getDailyTotal = (scans) => scans.reduce((sum, scan) => sum + (parseFloat(scan.calories) || 0), 0).toFixed(0)

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
      <div className="bg-[#161B22] w-full max-w-lg rounded-t-2xl flex flex-col h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-[#1E2530]">
          <h2 className="text-white font-semibold text-lg">Nutrition Calendar</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-[#0D1117] rounded-xl p-4 mb-4 border border-[#1E2530]">
            <h3 className="text-white font-semibold mb-4 text-sm">This Week</h3>
            <div className="flex items-end gap-2 h-24">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        day.date === new Date().toDateString()
                          ? 'bg-orange-500'
                          : day.calories > 0 ? 'bg-[#0F2C5C]' : 'bg-[#1E2530]'
                      }`}
                      style={{ height: `${Math.max((day.calories / maxCals) * 80, day.calories > 0 ? 8 : 4)}px` }}
                    />
                  </div>
                  <span className="text-gray-500 text-xs">{day.day}</span>
                  {day.calories > 0 && <span className="text-orange-400 text-xs">{day.calories}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0D1117] rounded-xl p-4 mb-4 border border-[#1E2530]">
            <h3 className="text-white font-semibold mb-3 text-sm">Select a Date</h3>
            <style>{`
              .react-calendar { background: transparent; border: none; color: white; font-family: inherit; width: 100%; }
              .react-calendar__tile { background: transparent; color: #9ca3af; border-radius: 8px; padding: 8px; }
              .react-calendar__tile:hover { background: #1E2530; color: white; }
              .react-calendar__tile--active { background: #F97316 !important; color: white !important; border-radius: 8px; }
              .react-calendar__tile--now { background: #0F2C5C; color: white; border-radius: 8px; }
              .react-calendar__navigation button { background: transparent; color: white; font-size: 14px; }
              .react-calendar__navigation button:hover { background: #1E2530; border-radius: 8px; }
              .react-calendar__month-view__weekdays { color: #6b7280; font-size: 11px; }
              .has-scan { background: #0F2C5C !important; color: white !important; }
            `}</style>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date }) => datesWithScans.includes(date.toDateString()) ? 'has-scan' : null}
            />
          </div>

          <div className="bg-[#0D1117] rounded-xl p-4 border border-[#1E2530]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">
                {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              {scansForDate.length > 0 && (
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                  {getDailyTotal(scansForDate)} kcal
                </span>
              )}
            </div>
            {scansForDate.length === 0 ? (
              <div className="flex flex-col items-center py-6">
                <p className="text-gray-500 text-sm">No meals logged on this day</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scansForDate.map((scan, index) => (
                  <div key={index} className="bg-[#161B22] rounded-xl p-3 border border-[#1E2530]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white text-sm font-medium capitalize">{scan.name || scan.foodName}</p>
                      <p className="text-orange-500 text-sm font-semibold">{scan.calories} kcal</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Protein</p>
                        <p className="text-xs font-medium text-red-400">{scan.protein}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Carbs</p>
                        <p className="text-xs font-medium text-amber-400">{scan.carbs}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Fat</p>
                        <p className="text-xs font-medium text-yellow-400">{scan.fat}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


const GoalModal = ({ initialGoal, onSave, onClose }) => {
  const [localGoal, setLocalGoal] = useState(initialGoal)

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-white font-semibold text-lg mb-4">Set Daily Goals</h3>
        <div className="space-y-4">
          {[
            { label: 'Calories (kcal)', key: 'calories' },
            { label: 'Protein (g)', key: 'protein' },
            { label: 'Carbs (g)', key: 'carbs' },
            { label: 'Fat (g)', key: 'fat' }
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-gray-400 text-sm">{label}</label>
              <input
                type="number"
                value={localGoal[key]}
                onChange={(e) => setLocalGoal(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={() => onSave(localGoal)} className="flex-1 bg-[#0F2C5C]">Save</Button>
        </div>
      </div>
    </div>
  )
}

const AuthScreen = ({ authMode, setAuthMode, authEmail, setAuthEmail, authPassword, setAuthPassword, authName, setAuthName, authError, authLoading, onLogin, onRegister }) => (
  <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 overflow-y-auto">
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">CalCount</h1>
        <p className="text-gray-400">{authMode === 'login' ? 'Welcome back!' : 'Create your account'}</p>
      </div>
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        {authMode === 'register' && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Full Name" value={authName} onChange={(e) => setAuthName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none" />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input type="email" placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none" />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none" />
        </div>
        {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
        <Button onClick={authMode === 'login' ? onLogin : onRegister} disabled={authLoading} className="w-full bg-[#0F2C5C] hover:bg-[#0a2349] py-3">
          {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{authMode === 'login' ? 'Sign In' : 'Create Account'}<ArrowRight className="w-5 h-5 ml-2" /></>}
        </Button>
        <div className="text-center pt-4">
          <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login') }} className="text-gray-400 text-sm hover:text-white">
            {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  </div>
)

function App() {
  const [screen, setScreen] = useState('login')
  const [capturedImage, setCapturedImage] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [showCalendar, setShowCalendar] = useState(false)
  const [cameraPermission, setCameraPermission] = useState('prompt')
  const [nutritionResult, setNutritionResult] = useState(null)

  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [dietGoals, setDietGoals] = useState(() => {
    const saved = localStorage.getItem('calcount_goals')
    return saved ? JSON.parse(saved) : { calories: 2000, protein: 120, carbs: 250, fat: 70 }
  })

  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem('calcount_meals')
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Breakfast', items: [] },
      { id: 2, name: 'Lunch', items: [] },
      { id: 3, name: 'Dinner', items: [] },
      { id: 4, name: 'Snacks', items: [] }
    ]
  })

  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showPlanScanner, setShowPlanScanner] = useState(false)

  const [logbookEntries, setLogbookEntries] = useState(() => {
    const saved = localStorage.getItem('calcount_logbook')
    return saved ? JSON.parse(saved) : []
  })

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
      setScreen('home')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('calcount_meals', JSON.stringify(meals))
  }, [meals])

  useEffect(() => {
    localStorage.setItem('calcount_logbook', JSON.stringify(logbookEntries))
  }, [logbookEntries])

  useEffect(() => {
    localStorage.setItem('calcount_goals', JSON.stringify(dietGoals))
  }, [dietGoals])

  const handleRegister = () => {
    setAuthLoading(true)
    setAuthError('')
    setTimeout(() => {
      if (!authEmail || !authPassword || !authName) { setAuthError('Please fill in all fields'); setAuthLoading(false); return }
      if (!authEmail.includes('@')) { setAuthError('Please enter a valid email'); setAuthLoading(false); return }
      if (authPassword.length < 6) { setAuthError('Password must be at least 6 characters'); setAuthLoading(false); return }
      const users = JSON.parse(localStorage.getItem('nutrisnap_users') || '[]')
      if (users.find(u => u.email === authEmail)) { setAuthError('Email already registered'); setAuthLoading(false); return }
      const newUser = { id: Date.now(), name: authName, email: authEmail, password: authPassword, createdAt: new Date().toISOString() }
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
      if (!authEmail || !authPassword) { setAuthError('Please enter email and password'); setAuthLoading(false); return }
      const users = JSON.parse(localStorage.getItem('nutrisnap_users') || '[]')
      const foundUser = users.find(u => u.email === authEmail && u.password === authPassword)
      if (!foundUser) { setAuthError('Invalid email or password'); setAuthLoading(false); return }
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

  const authProps = {
    authMode, setAuthMode,
    authEmail, setAuthEmail,
    authPassword, setAuthPassword,
    authName, setAuthName,
    authError, authLoading,
    onLogin: handleLogin,
    onRegister: handleRegister,
  }

  const checkCameraSupport = () => {
    try {
      const nav = window.navigator
      if (!nav) return false
      const mediaDevices = nav.mediaDevices
      if (!mediaDevices) return false
      if (typeof mediaDevices.getUserMedia !== 'function') return false
      return true
    } catch (e) { return false }
  }

  const checkCameraPermission = async () => {
    const isSupported = checkCameraSupport()
    if (!isSupported) { alert('Camera API is not supported on this device/browser.'); setCameraPermission('denied'); return }
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' })
      setCameraPermission(permissionStatus.state)
      permissionStatus.onchange = () => setCameraPermission(permissionStatus.state)
      alert(`Current camera permission: ${permissionStatus.state}`)
    } catch (err) {
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

  const startCamera = async () => {
    const isSupported = checkCameraSupport()
    if (!isSupported) return
    const video = videoRef.current
    if (!video) return
    const stopCurrentStream = () => {
      if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null }
    }
    const tryCamera = async (facingMode) => {
      try {
        stopCurrentStream()
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
        streamRef.current = stream
        video.srcObject = stream
        await new Promise((resolve) => {
          video.onloadedmetadata = () => { video.play().then(resolve).catch(resolve) }
          setTimeout(resolve, 2000)
        })
        return true
      } catch (err) { console.log(`Camera failed with ${facingMode}:`, err.message); return false }
    }
    const success = await tryCamera({ ideal: 'environment' })
    if (!success) await tryCamera({ ideal: 'user' })
  }

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null }
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

  const confirmPicture = async () => {
    setScreen('loading')
    try {
      const img = new Image()
      img.src = capturedImage
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
      const { classifyFood } = await import('./services/tensorflowRecognition')
      const foodPredictions = await classifyFood(img)
      console.log('Food predictions:', foodPredictions)
      if (!foodPredictions || foodPredictions.length === 0) {
        alert('No food detected. Please take a photo of food.')
        setScreen('preview')
        return
      }
      const topResult = foodPredictions[0]
      setNutritionResult(topResult)
      setLogbookEntries(prev => [{
        id: Date.now(),
        name: topResult.name,
        calories: topResult.nutrition.calories,
        protein: parseFloat(topResult.nutrition.protein) || 0,
        carbs: parseFloat(topResult.nutrition.carbs) || 0,
        fat: parseFloat(topResult.nutrition.fat) || 0,
        meal: 'snack',
        timestamp: new Date().toISOString(),
        scannedViaBarcode: false,
      }, ...prev])
      setScreen('results')
      setDrawerOpen(true)
      await fetch(`${API_URL}/log-usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodName: topResult.name, calories: topResult.nutrition.calories, timestamp: new Date().toISOString() }),
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
      setScreen('preview')
    }
  }

  const resetApp = () => {
    setScreen('home')
    setCapturedImage(null)
    setDrawerOpen(false)
    setNutritionResult(null)
  }

  useEffect(() => { checkCameraPermission() }, [])
  useEffect(() => {
    if (screen === 'camera' || screen === 'home') startCamera()
    return () => stopCamera()
  }, [screen])

  if (screen === 'login') return <AuthScreen {...authProps} />
  if (screen === 'register') return <AuthScreen {...authProps} />
  if (!user) return <AuthScreen {...authProps} />

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plan', label: 'Plan', icon: CalendarIcon },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const Layout = ({ children, activeTab, onTabClick }) => (
    <div className="min-h-screen w-full bg-[#0D1117] flex flex-col">
      <NavBar activeTab={activeTab} onTabClick={onTabClick} />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )

  const NavBar = ({ activeTab, onTabClick }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 pb-safe z-50">
      <div className="flex justify-around items-end py-2 h-20">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button key={item.id} type="button" onClick={() => onTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 ${isActive ? 'text-white' : 'text-gray-500'}`}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  if (screen === 'home') {
    const totalConsumed = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.calories || 0), 0), 0)
    const totalProtein = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.protein || 0), 0), 0)
    const totalCarbs = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.carbs || 0), 0), 0)
    const totalFat = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.fat || 0), 0), 0)
    const consumed = { calories: totalConsumed, protein: totalProtein, carbs: totalCarbs, fat: totalFat }
    const remaining = { calories: dietGoals.calories - consumed.calories }
    const quickAddMeals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
    const hasAnyMeals = meals.some(m => m.items && m.items.length > 0)
    const aiInsights = hasAnyMeals ? [
      { type: 'success', text: 'Your protein is on track.' },
      { type: 'warning', text: 'You have only had 1 serving of vegetables today.' },
    ] : [{ type: 'info', text: 'Start logging meals to get personalized insights.' }]
    const greeting = () => { const hour = new Date().getHours(); if (hour < 12) return 'Good morning'; if (hour < 17) return 'Good afternoon'; return 'Good evening' }
    const formatTime = (index) => { const times = ['7:00 AM', '12:30 PM', '6:30 PM', '3:00 PM']; return times[index] || '' }
    const getTotalCalories = (mealIndex) => { const meal = meals[mealIndex]; if (!meal || !meal.items) return 0; return meal.items.reduce((sum, item) => sum + (item.calories || 0), 0) }
    const calorieProgress = Math.min((consumed.calories / dietGoals.calories) * 100, 100)
    const ringRadius = 90
    const ringCircumference = 2 * Math.PI * ringRadius
    const ringOffset = ringCircumference - (calorieProgress / 100) * ringCircumference

    return (
      <Layout activeTab="home" onTabClick={(id) => setScreen(id)}>
        <div className="flex-1 flex flex-col p-4 pt-16 pb-28 overflow-y-auto">

          <div className="mb-6 mt-2">
            <h1 className="text-3xl font-bold text-white">{greeting()}, {user?.name?.split(' ')[0] || 'there'}</h1>
            <p className="text-gray-400 mt-1 text-base">You are {remaining.calories > 0 ? remaining.calories : 0} kcal away from your goal</p>
          </div>

          {!hasAnyMeals && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 mb-4">
              <h3 className="text-orange-400 font-semibold mb-3">Getting Started</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
                  <p className="text-gray-300 text-sm">Tap the <span className="text-orange-400 font-medium">orange camera button</span> below to scan your food</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
                  <p className="text-gray-300 text-sm">Point your camera at food and tap <span className="text-orange-400 font-medium">Confirm</span> to analyse it</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
                  <p className="text-gray-300 text-sm">Tap <span className="text-orange-400 font-medium">Add to My Meals</span> to log it and track your nutrition</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#161B22] rounded-2xl p-6 mb-4 border border-[#1E2530]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Total Calorie Intake</h3>
              <span className="text-xs text-gray-500">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-52 h-52">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r={ringRadius} fill="none" stroke="#1E2530" strokeWidth="14" />
                  <circle cx="110" cy="110" r={ringRadius} fill="none" stroke="#F97316" strokeWidth="14"
                    strokeLinecap="round" strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                    className="transition-all duration-1000 ease-out"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">{consumed.calories}</span>
                  <span className="text-gray-500 text-sm">of {dietGoals.calories} kcal</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <div className="bg-[#0D1117] px-4 py-2 rounded-full border border-[#1E2530]">
                <span className="text-red-400 font-semibold">{consumed.protein}g</span>
                <span className="text-gray-500 text-xs ml-1">Protein</span>
              </div>
              <div className="bg-[#0D1117] px-4 py-2 rounded-full border border-[#1E2530]">
                <span className="text-green-400 font-semibold">{consumed.carbs}g</span>
                <span className="text-gray-500 text-xs ml-1">Carbs</span>
              </div>
              <div className="bg-[#0D1117] px-4 py-2 rounded-full border border-[#1E2530]">
                <span className="text-yellow-400 font-semibold">{consumed.fat}g</span>
                <span className="text-gray-500 text-xs ml-1">Fat</span>
              </div>
            </div>
          </div>

          <div className="bg-[#161B22] rounded-2xl p-4 mb-4 border border-[#1E2530]">
            <h3 className="text-white font-semibold mb-4">Recent Meals</h3>
            {!hasAnyMeals ? (
              <div className="flex flex-col items-center py-6">
                <ClipboardIcon />
                <p className="text-white text-sm mt-4">No meals logged yet</p>
                <p className="text-gray-500 text-xs mt-1">Tap the camera button to scan food</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meals.slice(0, 4).map((meal, index) => {
                  const iconData = mealTypeIcons[meal.name] || mealTypeIcons['Snacks']
                  const IconComponent = iconData.icon
                  return (
                    <div key={meal.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#EFF3FB] rounded-lg flex items-center justify-center"><IconComponent /></div>
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
            )}
            <button className="w-full mt-4 py-2 text-orange-500 text-sm font-medium border border-dashed border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors">
              + Add meal
            </button>
          </div>

          <div className="bg-[#161B22] rounded-2xl p-4 mb-4 border border-[#1E2530]">
            <h3 className="text-white font-semibold mb-4">AI Insights</h3>
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-xl ${
                  insight.type === 'success' ? 'bg-green-500/10 border border-green-500/30'
                  : insight.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/30'
                  : 'bg-gray-800/30 border border-gray-700'}`}>
                  <p className={`text-sm ${insight.type === 'success' ? 'text-green-400' : insight.type === 'warning' ? 'text-amber-400' : 'text-gray-400'}`}>
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const totalCals = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.calories || 0), 0), 0)
                const totalProtein = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.protein || 0), 0), 0)
                let advice = []
                if (totalCals === 0) advice.push('Start scanning food to get personalised advice!')
                else if (totalCals < dietGoals.calories * 0.5) advice.push('You have eaten less than half your calorie goal. Make sure to eat enough!')
                else if (totalCals > dietGoals.calories) advice.push('You have exceeded your calorie goal today. Consider lighter meals.')
                else advice.push('You are on track with your calorie goal. Keep it up!')
                if (totalProtein < dietGoals.protein * 0.5) advice.push('Your protein intake is low. Try adding chicken, eggs or fish.')
                alert(advice.join('\n\n'))
              }}
              className="w-full mt-4 py-3 text-orange-500 text-sm font-medium flex items-center justify-center gap-2 hover:bg-orange-500/10 rounded-lg transition-colors"
            >
              Ask AI for advice
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-white font-semibold mb-4">Quick Add</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {quickAddMeals.map((mealType) => {
                const iconData = mealTypeIcons[mealType]
                const QuickIcon = iconData ? iconData.quickAddIcon : QuickAddIconSnack
                return (
                  <button key={mealType} className="flex-shrink-0 bg-[#161B22] px-4 py-3 rounded-xl border border-[#1E2530] hover:border-orange-500/50 transition-colors flex flex-col items-center min-w-[80px]">
                    <QuickIcon />
                    <span className="text-gray-400 text-xs mt-2">{mealType}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="fixed bottom-24 right-4 flex flex-col items-center gap-1 z-40">
            <span className="text-white text-xs bg-black/60 px-2 py-1 rounded-full">Scan Food</span>
            <button
              onClick={() => setScreen('camera')}
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#F97316',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                animation: !hasAnyMeals ? 'pulse-ring 2s infinite' : 'none',
              }}
            >
              <Camera className="w-7 h-7 text-white" />
            </button>
          </div>

        </div>
      </Layout>
    )
  }

  if (screen === 'analysis') {
    const totalConsumed = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.calories || 0), 0), 0)
    const totalProtein = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.protein || 0), 0), 0)
    const totalCarbs = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.carbs || 0), 0), 0)
    const totalFat = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.fat || 0), 0), 0)
    const macroData = totalConsumed > 0 ? [
      { name: 'Protein', value: totalProtein, color: '#ef4444' },
      { name: 'Carbs', value: totalCarbs, color: '#0bf52a' },
      { name: 'Fat', value: totalFat, color: '#eab308' }
    ] : [
      { name: 'Protein', value: 0, color: '#374151' },
      { name: 'Carbs', value: 0, color: '#374151' },
      { name: 'Fat', value: 0, color: '#374151' }
    ]
    const dailyAverage = logbookEntries.length > 0 ? Math.round(logbookEntries.reduce((s, e) => s + (parseFloat(e.calories) || 0), 0) / 7) : 0
    const formatDateHeader = (dateStr) => {
      const date = new Date(dateStr)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today.getTime() - 86400000)
      const entryDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      if (entryDate.getTime() === today.getTime()) return 'Today'
      if (entryDate.getTime() === yesterday.getTime()) return 'Yesterday'
      return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
    }
    const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    const getMealIcon = (mealType) => {
      const mapping = { 'breakfast': MealIconBreakfast, 'lunch': MealIconLunch, 'dinner': MealIconDinner, 'snack': MealIconSnack }
      return mapping[mealType] || MealIconSnack
    }
    const filteredEntries = logbookEntries.filter(entry => {
      if (logbookFilter !== 'All' && logbookFilter !== 'Barcode') { if (entry.meal.toLowerCase() !== logbookFilter.toLowerCase()) return false }
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
    const toggleExpand = (id) => setExpandedEntry(expandedEntry === id ? null : id)
    const filterOptions = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Barcode']
    const getMealLabel = (meal) => meal.charAt(0).toUpperCase() + meal.slice(1)
    const weekEntries = logbookEntries.filter(e => { const weekAgo = new Date(Date.now() - 7 * 86400000); return new Date(e.timestamp) >= weekAgo })
    const mostLogged = weekEntries.length > 0
      ? Object.entries(weekEntries.reduce((counts, e) => { counts[e.name] = (counts[e.name] || 0) + 1; return counts }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
      : 'None'

    return (
      <Layout activeTab="analysis" onTabClick={(id) => setScreen(id)}>
        <div className="flex-1 flex flex-col p-4 pt-16 pb-28 overflow-y-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Analysis</h1>
          <div className="bg-[#161B22] rounded-2xl p-4 mb-4 border border-[#1E2530]">
            <h3 className="text-white font-semibold mb-4">Macronutrients</h3>
            <div className="h-48 min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={macroData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
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

          <div className="bg-[#161B22] rounded-2xl p-4 mb-4 border border-[#1E2530]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Food Logbook</h3>
              <button className="p-2"><FilterIcon /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <p className="text-white font-semibold text-lg">{weekEntries.length}</p>
                <p className="text-gray-500 text-xs">logged this week</p>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <p className="text-white font-semibold text-lg">{dailyAverage}</p>
                <p className="text-gray-500 text-xs">kcal / day</p>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <p className="text-orange-500 font-semibold text-xs truncate">{mostLogged}</p>
                <p className="text-gray-500 text-xs">most logged</p>
              </div>
            </div>
            <input type="text" placeholder="Search foods..." value={logbookSearch} onChange={(e) => setLogbookSearch(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3 py-2 text-white text-sm mb-3 placeholder-gray-500" />
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              {filterOptions.map((filter) => (
                <button key={filter} onClick={() => setLogbookFilter(filter)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${logbookFilter === filter ? 'bg-orange-500 text-white' : 'bg-[#1E2530] text-gray-400'}`}>
                  {filter}
                </button>
              ))}
            </div>
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
                        <div key={entry.id} className="bg-[#161B22] rounded-xl p-3 border border-[#1E2530] overflow-hidden transition-all duration-300">
                          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(entry.id)}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#EFF3FB] rounded-lg flex items-center justify-center"><MealIcon /></div>
                              <div>
                                <p className="text-white text-sm font-medium">{entry.name}</p>
                                <p className="text-gray-500 text-xs">{getMealLabel(entry.meal)} - {formatTime(entry.timestamp)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-orange-500 text-sm font-semibold">{entry.calories} kcal</p>
                              {entry.scannedViaBarcode && <div className="flex justify-end mt-1"><BarcodeIcon /></div>}
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-[#1E2530]">
                              <div className="flex items-center gap-3">
                                {[
                                  { label: 'Protein', value: entry.protein, color: 'red', max: 60 },
                                  { label: 'Carbs', value: entry.carbs, color: 'amber', max: 100 },
                                  { label: 'Fat', value: entry.fat, color: 'yellow', max: 50 },
                                ].map(({ label, value, color, max }) => (
                                  <div key={label} className="flex-1">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className={`text-${color}-400`}>{label}</span>
                                      <span className="text-gray-400">{value}g</span>
                                    </div>
                                    <div className="h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
                                      <div className={`h-full bg-${color}-500 rounded-full`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
                                    </div>
                                  </div>
                                ))}
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

  if (screen === 'camera') return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 bg-black/30" />
      <Button size="icon" className="w-20 h-20 rounded-full bg-white/90 hover:bg-white text-gray-800 z-10" onClick={takePicture}>
        <Camera className="w-10 h-10" />
      </Button>
      <p className="absolute bottom-24 text-white font-medium z-10">Tap to capture</p>
      <Button variant="ghost" className="absolute top-4 left-4 text-white z-10" onClick={() => setScreen('home')}>
        <Home className="w-6 h-6" />
      </Button>
    </div>
  )

  if (screen === 'preview') return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      <div className="flex-1 relative">
        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8" onClick={retakePicture}>
            <RotateCcw className="w-5 h-5 mr-2" />Retake
          </Button>
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8" onClick={confirmPicture}>
            <Check className="w-5 h-5 mr-2" />Confirm
          </Button>
        </div>
      </div>
    </div>
  )

  if (screen === 'loading') return (
    <div className="min-h-screen w-full bg-[#0D1117] flex flex-col items-center justify-center">
      <Loader2 className="w-16 h-16 animate-spin text-orange-500 mb-4" />
      <p className="text-white font-medium">Analyzing your meal...</p>
      <p className="text-gray-400 text-sm mt-2">Detecting nutrients</p>
    </div>
  )

  if (screen === 'results') return (
    <div className="min-h-screen w-full relative">
      <img src={capturedImage} alt="Results background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Nutrition Facts</DrawerTitle>
            <DrawerDescription>{nutritionResult?.name} — {nutritionResult?.confidence}% confidence</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="bg-[#0F2C5C]/10 border-[#0F2C5C]/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#0F2C5C] mb-1"><Flame className="w-4 h-4" /><span className="text-xs font-medium">Calories</span></div>
                  <p className="text-2xl font-bold text-orange-700">{nutritionResult?.nutrition?.calories}</p>
                  <p className="text-xs text-orange-500">kcal</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0F2C5C]/10 border-[#0F2C5C]/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#0F2C5C] mb-1"><Beef className="w-4 h-4" /><span className="text-xs font-medium">Protein</span></div>
                  <p className="text-2xl font-bold text-red-700">{nutritionResult?.nutrition?.protein}</p>
                  <p className="text-xs text-red-500">g</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0F2C5C]/10 border-[#0F2C5C]/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#0F2C5C] mb-1"><Wheat className="w-4 h-4" /><span className="text-xs font-medium">Carbs</span></div>
                  <p className="text-2xl font-bold text-amber-700">{nutritionResult?.nutrition?.carbs}</p>
                  <p className="text-xs text-amber-500">g</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0F2C5C]/10 border-[#0F2C5C]/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#0F2C5C] mb-1"><Droplets className="w-4 h-4" /><span className="text-xs font-medium">Fat</span></div>
                  <p className="text-2xl font-bold text-yellow-700">{nutritionResult?.nutrition?.fat}</p>
                  <p className="text-xs text-yellow-500">g</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={() => {
                if (nutritionResult) {
                  setMeals(prev => prev.map(meal =>
                    meal.name === 'Snacks' ? {
                      ...meal,
                      items: [...meal.items, {
                        name: nutritionResult.name,
                        calories: parseFloat(nutritionResult.nutrition?.calories) || 0,
                        protein: parseFloat(nutritionResult.nutrition?.protein) || 0,
                        carbs: parseFloat(nutritionResult.nutrition?.carbs) || 0,
                        fat: parseFloat(nutritionResult.nutrition?.fat) || 0,
                      }]
                    } : meal
                  ))
                }
                resetApp()
              }}
              className="w-full bg-[#0F2C5C]"
            >
              Add to My Meals
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )

  if (screen === 'plan') {
    const totalCalories = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.calories || 0), 0), 0)
    const totalProtein = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.protein || 0), 0), 0)
    const totalCarbs = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.carbs || 0), 0), 0)
    const totalFat = meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.fat || 0), 0), 0)

    return (
      <Layout activeTab="plan" onTabClick={(id) => setScreen(id)}>
        <div className="flex-1 flex flex-col p-4 pt-16 pb-28 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Meal Plan</h1>
            <div className="flex gap-2">
              <button onClick={() => setShowCalendar(true)} className="bg-[#0F2C5C] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                Calendar
              </button>
              <button onClick={() => setShowPlanScanner(true)} className="bg-[#0F2C5C] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
                <Camera className="w-4 h-4" />
                Scan Food
              </button>
              <button onClick={() => setShowGoalModal(true)} className="bg-[#0F2C5C] text-white px-4 py-2 rounded-lg text-sm font-medium">
                Set Goals
              </button>
            </div>
          </div>

          {showPlanScanner && (
            <div className="fixed inset-0 z-[100] bg-black flex flex-col">
              <Scanner user={user} onLogout={handleLogout} onNavigate={(screenId) => { if (screenId) setScreen(screenId) }} onClose={() => setShowPlanScanner(false)} />
            </div>
          )}

          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold">Today's Progress</h3>
              <span className="text-xs text-gray-400">{totalCalories} / {dietGoals.calories} kcal</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-[#0F2C5C] rounded-full transition-all" style={{ width: `${Math.min((totalCalories / dietGoals.calories) * 100, 100)}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div><span className="text-red-400">{totalProtein}g</span><p className="text-gray-500">Protein</p></div>
              <div><span className="text-green-400">{totalCarbs}g</span><p className="text-gray-500">Carbs</p></div>
              <div><span className="text-yellow-400">{totalFat}g</span><p className="text-gray-500">Fat</p></div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-semibold">Today's Meals</h3>
            {meals.map((meal) => (
              <div key={meal.id} className="bg-gray-900 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-white font-medium">{meal.name}</h4>
                  <span className="text-xs text-gray-400">{meal.items.reduce((s, i) => s + (i.calories || 0), 0)} kcal</span>
                </div>
                {meal.items.length > 0 ? (
                  <div className="space-y-2">
                    {meal.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{item.name}</span>
                        <span className="text-orange-400">{item.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No items added yet</p>
                )}
                <button className="mt-2 text-orange-500 text-sm font-medium">+ Add Food</button>
              </div>
            ))}
          </div>
        </div>

        {showCalendar && (
          <NutritionCalendar onClose={() => setShowCalendar(false)} logbookEntries={logbookEntries} />
        )}

        {showGoalModal && (
          <GoalModal
            initialGoal={dietGoals}
            onSave={(savedGoal) => { setDietGoals(savedGoal); setShowGoalModal(false) }}
            onClose={() => setShowGoalModal(false)}
          />
        )}
      </Layout>
    )
  }

  if (screen === 'settings') return (
    <Layout activeTab="settings" onTabClick={(id) => setScreen(id)}>
      <div className="flex-1 flex flex-col p-4 pt-16 pb-28 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
        {user && (
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#0F2C5C] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <button className="w-full bg-gray-900 rounded-xl p-4 text-left text-white font-medium flex items-center justify-between">Account Settings</button>
          <button className="w-full bg-gray-900 rounded-xl p-4 text-left text-white font-medium flex items-center justify-between">Notifications</button>
          <button className="w-full bg-gray-900 rounded-xl p-4 text-left text-white font-medium flex items-center justify-between">Privacy</button>
          <button className="w-full bg-gray-900 rounded-xl p-4 text-left text-white font-medium flex items-center justify-between">Help</button>
          <button onClick={handleLogout} className="w-full bg-gray-900 rounded-xl p-4 text-left text-red-500 font-medium flex items-center gap-2">
            <LogOut className="w-5 h-5" />Sign Out
          </button>
        </div>
      </div>
    </Layout>
  )

  return (
    <Layout activeTab="home" onTabClick={(id) => setScreen(id)}>
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-gray-400">Loading...</p>
      </div>
    </Layout>
  )
}

export default App