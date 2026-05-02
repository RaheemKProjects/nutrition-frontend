import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Camera, Leaf, X, Loader2, AlertCircle, Barcode as BarcodeIcon, Clock, Check } from 'lucide-react'

const FRUIT_VEG_NUTRITION = {
  'banana': { name: 'Banana', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
  'apple': { name: 'Apple', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
  'red apple': { name: 'Red Apple', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
  'green apple': { name: 'Green Apple', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
  'orange': { name: 'Orange', calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1 },
  'grapes': { name: 'Grapes', calories: 69, protein: 0.7, carbs: 17.8, fat: 0.2 },
  'strawberries': { name: 'Strawberries', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  'strawberry': { name: 'Strawberry', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  'mango': { name: 'Mango', calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
  'pineapple': { name: 'Pineapple', calories: 50, protein: 0.5, carbs: 13.1, fat: 0.1 },
  'watermelon': { name: 'Watermelon', calories: 30, protein: 0.6, carbs: 7.5, fat: 0.2 },
  'blueberries': { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
  'blueberry': { name: 'Blueberry', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
  'pear': { name: 'Pear', calories: 57, protein: 0.4, carbs: 15.2, fat: 0.1 },
  'peach': { name: 'Peach', calories: 39, protein: 0.9, carbs: 9.9, fat: 0.3 },
  'kiwi': { name: 'Kiwi', calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5 },
  'lemon': { name: 'Lemon', calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3 },
  'avocado': { name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  'broccoli': { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  'carrot': { name: 'Carrot', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
  'spinach': { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  'tomato': { name: 'Tomato', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  'cucumber': { name: 'Cucumber', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1 },
  'pepper': { name: 'Bell Pepper', calories: 31, protein: 1, carbs: 6, fat: 0.3 },
  'red pepper': { name: 'Red Pepper', calories: 31, protein: 1, carbs: 6, fat: 0.3 },
  'green pepper': { name: 'Green Pepper', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2 },
  'yellow pepper': { name: 'Yellow Pepper', calories: 27, protein: 1, carbs: 5.4, fat: 0.3 },
  'onion': { name: 'Onion', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
  'potato': { name: 'Potato', calories: 77, protein: 2, carbs: 17.5, fat: 0.1 },
  'sweet potato': { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  'lettuce': { name: 'Lettuce', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
  'courgette': { name: 'Courgette', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 },
  'mushroom': { name: 'Mushroom', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 },
  'mushrooms': { name: 'Mushroom', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 },
  'garlic': { name: 'Garlic', calories: 149, protein: 6.4, carbs: 33, fat: 0.5 },
  'celery': { name: 'Celery', calories: 16, protein: 0.7, carbs: 3, fat: 0.2 },
  'corn': { name: 'Corn', calories: 86, protein: 3.3, carbs: 18, fat: 1.4 },
}

const SUPPORTED_ITEMS = Object.keys(FRUIT_VEG_NUTRITION)

const AddMealModal = ({ isOpen, onClose, onFoodSelect, onLoading, onError }) => {
  const [activeTab, setActiveTab] = useState('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [barcode, setBarcode] = useState('')
  const [barcodeResult, setBarcodeResult] = useState(null)
  const [barcodeScanning, setBarcodeScanning] = useState(false)
  const [captureMode, setCaptureMode] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [identifying, setIdentifying] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [error, setError] = useState(null)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('search')
      setSearchQuery('')
      setSearchResults([])
      setBarcode('')
      setBarcodeResult(null)
      setCapturedImage(null)
      setAiResult(null)
      setError(null)
    }
  }, [isOpen])

  const searchFoods = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setSearching(true)
    setError(null)
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`
      )
      const data = await response.json()
      const products = data.products || []
      setSearchResults(products.filter(p => p.product_name).map(p => ({
        id: p.code || p.id,
        name: p.product_name,
        brand: p.brands || '',
        calories: p.nutriments?.['energy-kcal_100g'] || 0,
        protein: p.nutriments?.proteins_100g || 0,
        carbs: p.nutriments?.carbohydrates_100g || 0,
        fat: p.nutriments?.fat_100g || 0,
        servingSize: p.serving_size || '100g'
      })))
    } catch (err) {
      setError('Unable to search. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => searchFoods(searchQuery), 500)
    }
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [searchQuery])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('Camera access needed. Enable in Settings.')
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
      stopCamera()
      identifyFood(imageData)
    }
  }

  const identifyFood = async (imageBase64) => {
    setIdentifying(true)
    setError(null)
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-ant-api03-VN2GBEoL1oAqSO5YpGdE4-2mRM2j3lz94k_08JQd5I-zW8k1oH1tMQbS9X6z6qZj2YJ1oAqSO5YpGdE4-2mRM2j3lz94k_08JQd5I',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: 'You are a nutrition expert. The user has taken a photo of fresh produce (fruit or vegetable). Identify the exact item and respond ONLY with a JSON object in this format, no extra text: { name: string, calories_per_100g: number, protein_per_100g: number, carbs_per_100g: number, fat_per_100g: number, confidence: "high" | "medium" | "low", note: string }',
          messages: [{
            role: 'user',
            content: [{
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Data
              }
            }, {
              type: 'text',
              text: 'What fruit or vegetable is this? Respond with only JSON.'
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      const text = data.content?.[0]?.text || ''
      const parsed = JSON.parse(text)
      
      const matchedNutrition = FRUIT_VEG_NUTRITION[parsed.name.toLowerCase()]
      if (matchedNutrition) {
        setAiResult({
          ...parsed,
          calories: parsed.calories_per_100g,
          protein: parsed.protein_per_100g,
          carbs: parsed.carbs_per_100g,
          fat: parsed.fat_per_100g,
          nutrition: matchedNutrition
        })
      } else {
        setError('Could not identify item. Try a clearer photo or use search instead.')
      }
    } catch (err) {
      setError('Could not identify item. Try a clearer photo or use search instead.')
    } finally {
      setIdentifying(false)
    }
  }

  const fetchByBarcode = async (barcodeNum) => {
    if (!barcodeNum.trim()) return
    setBarcodeScanning(true)
    setError(null)
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcodeNum}.json`
      )
      const data = await response.json()
      if (data.status === 1 && data.product) {
        const p = data.product
        setBarcodeResult({
          id: p.code,
          name: p.product_name,
          brand: p.brands || '',
          calories: p.nutriments?.['energy-kcal_100g'] || 0,
          protein: p.nutriments?.proteins_100g || 0,
          carbs: p.nutriments?.carbohydrates_100g || 0,
          fat: p.nutriments?.fat_100g || 0,
          servingSize: p.serving_size || '100g'
        })
      } else {
        setError('Product not found. Try searching by name.')
      }
    } catch (err) {
      setError('Could not fetch product. Please try again.')
    } finally {
      setBarcodeScanning(false)
    }
  }

  const handleSelectFood = (food) => {
    onFoodSelect(food)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end">
      <div className="w-full bg-[#161B22] rounded-t-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>
        
        <div className="flex items-center justify-between px-4 pb-3">
          <h2 className="text-lg font-semibold text-white">Add Meal</h2>
          <button onClick={onClose} className="p-2">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex gap-2 px-4 mb-4">
          {['search', 'barcode', 'fresh'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#1E2530] text-gray-400'
              }`}
            >
              {tab === 'search' && <Search className="w-4 h-4 inline mr-2" />}
              {tab === 'barcode' && <BarcodeIcon className="w-4 h-4 inline mr-2" />}
              {tab === 'fresh' && <Leaf className="w-4 h-4 inline mr-2" />}
              {tab === 'search' ? 'Search' : tab === 'barcode' ? 'Barcode' : 'Fresh Produce'}
            </button>
          ))}
        </div>

        {error && (
          <div className="mx-4 mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {activeTab === 'search' && (
            <div>
              <input
                type="text"
                placeholder="Search for a food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-4 py-3 text-white placeholder-gray-500 mb-4"
              />
              
              {searching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((food, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectFood(food)}
                      className="w-full p-3 bg-[#0D1117] rounded-lg flex items-center justify-between"
                    >
                      <div className="text-left">
                        <p className="text-white text-sm font-medium">{food.name}</p>
                        {food.brand && (
                          <p className="text-gray-500 text-xs">{food.brand}</p>
                        )}
                      </div>
                      <span className="text-orange-500 text-sm">{food.calories} kcal</span>
                    </button>
                  ))}
                  {searchQuery && !searching && searchResults.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No results found</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'barcode' && (
            <div className="flex flex-col items-center py-8">
              <BarcodeIcon className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 text-center mb-4">Enter barcode number manually</p>
              <input
                type="text"
                placeholder="Enter barcode..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-4 py-3 text-white placeholder-gray-500 mb-4 text-center text-lg tracking-widest"
              />
              <button
                onClick={() => fetchByBarcode(barcode)}
                disabled={!barcode || barcodeScanning}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                {barcodeScanning ? 'Searching...' : 'Search Barcode'}
              </button>
              
              {barcodeResult && (
                <button
                  onClick={() => handleSelectFood(barcodeResult)}
                  className="w-full mt-4 p-3 bg-[#0D1117] rounded-lg flex items-center justify-between"
                >
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{barcodeResult.name}</p>
                    {barcodeResult.brand && (
                      <p className="text-gray-500 text-xs">{barcodeResult.brand}</p>
                    )}
                  </div>
                  <span className="text-orange-500 text-sm">{barcodeResult.calories} kcal</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'fresh' && (
            <div className="flex flex-col items-center py-8">
              {!captureMode && !capturedImage && !aiResult && (
                <>
                  <Leaf className="w-16 h-16 text-green-500 mb-4" />
                  <p className="text-gray-400 text-center mb-4">Take a photo of fresh fruit or vegetables</p>
                  <button
                    onClick={() => {
                      setCaptureMode(true)
                      setTimeout(startCamera, 100)
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </button>
                </>
              )}
              
              {captureMode && (
                <div className="w-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                  <canvas ref={canvasRef} className="hidden" />
                  <button
                    onClick={takePicture}
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-medium"
                  >
                    Capture
                  </button>
                  <button
                    onClick={() => {
                      setCaptureMode(false)
                      stopCamera()
                    }}
                    className="w-full mt-2 text-gray-400 py-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
              
              {identifying && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-green-500" />
                  <p className="text-gray-400">Identifying...</p>
                </div>
              )}
              
              {aiResult && (
                <div className="w-full">
                  {aiResult.confidence === 'low' && (
                    <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <p className="text-amber-400 text-sm">We are not fully sure this is correct - please verify before logging</p>
                    </div>
                  )}
                  <button
                    onClick={() => handleSelectFood({
                      name: aiResult.nutrition.name,
                      brand: 'AI Identified',
                      calories: aiResult.calories,
                      protein: aiResult.protein,
                      carbs: aiResult.carbs,
                      fat: aiResult.fat
                    })}
                    className="w-full p-3 bg-[#0D1117] rounded-lg flex items-center justify-between"
                  >
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">{aiResult.nutrition.name}</p>
                      <p className="text-gray-500 text-xs">AI Identified</p>
                    </div>
                    <span className="text-orange-500 text-sm">{aiResult.calories} kcal</span>
                  </button>
                  <button
                    onClick={() => {
                      setCaptureMode(true)
                      setCapturedImage(null)
                      setAiResult(null)
                      setTimeout(startCamera, 100)
                    }}
                    className="w-full mt-2 text-gray-400 py-2"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddMealModal
export { FRUIT_VEG_NUTRITION, SUPPORTED_ITEMS }