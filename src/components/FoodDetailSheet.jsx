import { useState, useEffect } from 'react'
import { X, Loader2, Check, Camera } from 'lucide-react'

const UNITS = [
  { value: 'g', label: 'g' },
  { value: 'ml', label: 'ml' },
  { value: 'oz', label: 'oz' },
  { value: 'serving', label: 'serving' },
  { value: 'piece', label: 'piece' },
  { value: 'cup', label: 'cup' },
]

const getDefaultMeal = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 11) return 'breakfast'
  if (hour >= 11 && hour < 15) return 'lunch'
  if (hour >= 15 && hour < 21) return 'dinner'
  return 'snack'
}

const calculateNutrition = (food, quantity, unit) => {
  let multiplier = quantity / 100
  if (unit === 'oz') multiplier = quantity * 28.35 / 100
  if (unit === 'ml') multiplier = quantity / 100
  if (unit === 'serving' || unit === 'piece' || unit === 'cup') multiplier = quantity
  
  return {
    calories: Math.round((food.calories || 0) * multiplier),
    protein: Math.round((food.protein || 0) * multiplier * 10) / 10,
    carbs: Math.round((food.carbs || 0) * multiplier * 10) / 10,
    fat: Math.round((food.fat || 0) * multiplier * 10) / 10,
  }
}

const FoodDetailSheet = ({ food, isOpen, onClose, onLog }) => {
  const [quantity, setQuantity] = useState(100)
  const [unit, setUnit] = useState('g')
  const [selectedMeal, setSelectedMeal] = useState(getDefaultMeal())
  const [saving, setSaving] = useState(false)
  
  const [nutrition, setNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  })
  
  useEffect(() => {
    if (food) {
      setNutrition(calculateNutrition(food, quantity, unit))
    }
  }, [food, quantity, unit])
  
  useEffect(() => {
    if (isOpen) {
      setQuantity(100)
      setUnit('g')
      setSelectedMeal(getDefaultMeal())
    }
  }, [isOpen])
  
  const handleLog = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      onLog({
        ...food,
        ...nutrition,
        quantity,
        unit,
        meal: selectedMeal,
        timestamp: new Date()
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }
  
  if (!isOpen || !food) return null
  
  const getSourceBadge = () => {
    if (food.scannedViaBarcode) return 'Barcode Scan'
    if (food.scannedViaCameraAI) return 'AI Identified'
    if (food.brand && food.brand !== 'AI Identified') return food.brand
    return 'Open Food Facts'
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end">
      <div className="w-full bg-[#161B22] rounded-t-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>
        
        <div className="flex items-center justify-between px-4 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{food.name}</h2>
            <span className="text-xs text-gray-500 px-2 py-1 bg-[#1E2530] rounded-full">
              {getSourceBadge()}
            </span>
          </div>
          <button onClick={onClose} className="p-2">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="mb-4">
            <p className="text-gray-500 text-sm mb-2">Serving Size</p>
            <div className="flex gap-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                className="flex-1 bg-[#0D1117] border border-[#1E2530] rounded-lg px-4 py-3 text-white"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-24 bg-[#0D1117] border border-[#1E2530] rounded-lg px-3 py-3 text-white"
              >
                {UNITS.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-[#0D1117] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-500">{nutrition.calories}</p>
              <p className="text-gray-500 text-xs">Calories</p>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-400">{nutrition.protein}g</p>
              <p className="text-gray-500 text-xs">Protein</p>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-400">{nutrition.carbs}g</p>
              <p className="text-gray-500 text-xs">Carbs</p>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">{nutrition.fat}g</p>
              <p className="text-gray-500 text-xs">Fat</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-500 text-sm mb-2">Add to Meal</p>
            <div className="flex gap-2">
              {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
                <button
                  key={meal}
                  onClick={() => setSelectedMeal(meal)}
                  className={`flex-1 py-2 px-2 rounded-full text-xs font-medium transition-colors ${
                    selectedMeal === meal
                      ? 'bg-orange-500 text-white'
                      : 'bg-[#1E2530] text-gray-400'
                  }`}
                >
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleLog}
            disabled={saving}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                Add to Log
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoodDetailSheet