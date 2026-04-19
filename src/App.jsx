import { useState, useRef, useEffect } from 'react'
import { Camera, RotateCcw, Check, Loader2, Flame, Wheat, Beef, Droplets, Apple, Home, Calendar, BarChart3, Settings, ScanLine, ScanBarcode, FileText, Library } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
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
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const checkCameraPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' })
      setCameraPermission(permissionStatus.state)
      permissionStatus.onchange = () => setCameraPermission(permissionStatus.state)
    } catch (err) {
      console.log('Permission API not supported')
    }
  }

  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      setCameraPermission('granted')
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setCameraPermission('denied')
      }
    }
  }

  const openSettings = () => {
    window.open('app-settings:')
  }

  const startCamera = async () => {
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
    <div className="min-h-screen w-full bg-white flex flex-col">
      <NavBar activeTab={activeTab} onTabClick={onTabClick} />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )

  const NavBar = ({ activeTab, onTabClick }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
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
    return (
      <Layout activeTab="home" onTabClick={(id) => setScreen(id)}>
        <div className="pt-16 md:pt-8">
          <h1 className="text-2xl font-bold text-gray-800 p-6">Scanner</h1>
        </div>
        
        <div className="relative mx-4 md:mx-8 lg:mx-16 rounded-2xl overflow-hidden bg-black h-48 md:h-64 lg:h-80 max-w-3xl mx-auto w-[calc(100%-2rem)]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 bg-black/20" />
          <Button
            size="icon"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 hover:bg-white text-gray-800"
            onClick={takePicture}
          >
            <Camera className="w-6 h-6 md:w-8 md:h-8" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col p-6">
          <p className="text-gray-500 mb-6">Track your nutrition effortlessly</p>
          
          <div className="flex flex-row gap-2 md:gap-3 w-full max-w-2xl mx-auto">
            <Button
              variant="outline"
              className="flex-1 h-16 md:h-20 flex-col gap-1 md:gap-2 border-2 border-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500"
              onClick={() => setScreen('scanfood')}
            >
              <ScanLine className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm">Scan Food</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-16 md:h-20 flex-col gap-1 md:gap-2 border-2 border-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500"
              onClick={() => setScreen('barcode')}
            >
              <ScanBarcode className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm">Barcode</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-16 md:h-20 flex-col gap-1 md:gap-2 border-2 border-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500"
              onClick={() => setScreen('foodlabel')}
            >
              <FileText className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm">Food Label</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-16 md:h-20 flex-col gap-1 md:gap-2 border-2 border-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500"
              onClick={() => setScreen('library')}
            >
              <Library className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm">Library</span>
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  if (screen === 'plan') {
    return (
      <Layout activeTab="plan" onTabClick={(id) => setScreen(id)}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 pt-16 md:pt-8">
          <Calendar className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Meal Plan</h2>
          <p className="text-gray-500 text-center">Coming soon...</p>
        </div>
      </Layout>
    )
  }

  if (screen === 'analysis') {
    return (
      <Layout activeTab="analysis" onTabClick={(id) => setScreen(id)}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 pt-16 md:pt-8">
          <BarChart3 className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Analysis</h2>
          <p className="text-gray-500 text-center">Coming soon...</p>
        </div>
      </Layout>
    )
  }

  if (screen === 'settings') {
    return (
      <Layout activeTab="settings" onTabClick={(id) => setScreen(id)}>
        <div className="pt-16 md:pt-8 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Camera Access</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Camera Permission</span>
                  <span className={`text-sm font-medium ${
                    cameraPermission === 'granted' ? 'text-green-600' : 
                    cameraPermission === 'denied' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {cameraPermission === 'granted' ? 'Allowed' : 
                     cameraPermission === 'denied' ? 'Denied' : 'Not Set'}
                  </span>
                </div>
                
                <Button
                  onClick={requestCameraAccess}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Request Camera Access
                </Button>
                
                <Button
                  variant="outline"
                  onClick={checkCameraPermission}
                  className="w-full"
                >
                  Check Permission Status
                </Button>
                
                {cameraPermission === 'denied' && (
                  <Button
                    variant="outline"
                    onClick={openSettings}
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Open Device Settings
                  </Button>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">About</h3>
              <p className="text-sm text-gray-500">NutriSnap v1.0.0</p>
              <p className="text-sm text-gray-500 mt-1">Track your nutrition effortlessly</p>
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
              className="bg-green-500 hover:bg-green-600 text-white px-8"
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
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-orange-600 mb-1">
                      <Flame className="w-4 h-4" />
                      <span className="text-xs font-medium">Calories</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">{mockNutritionData.calories}</p>
                    <p className="text-xs text-orange-500">kcal</p>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-red-600 mb-1">
                      <Beef className="w-4 h-4" />
                      <span className="text-xs font-medium">Protein</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700">{mockNutritionData.protein}</p>
                    <p className="text-xs text-red-500">g</p>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-amber-600 mb-1">
                      <Wheat className="w-4 h-4" />
                      <span className="text-xs font-medium">Carbs</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-700">{mockNutritionData.carbs}</p>
                    <p className="text-xs text-amber-500">g</p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-yellow-600 mb-1">
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
                      <Apple className="w-4 h-4 text-green-500" />
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