import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'
import { getCalorieRange } from '../data/foodCalories'

let model = null

// FOOD_CLASSES - CocoSSD food items we want to detect
const FOOD_CLASSES = {
  'banana': true,
  'apple': true,
  'sandwich': true,
  'orange': true,
  'broccoli': true,
  'carrot': true,
  'hot dog': true,
  'pizza': true,
  'donut': true,
  'cake': true,
}

export async function loadModel() {
  if (!model) {
    console.log('Loading CocoSSD model...')
    model = await cocoSsd.load()
    console.log('CocoSSD model loaded!')
  }
  return model
}

export async function classifyFood(imgElement) {
  const m = await loadModel()

  // CocoSSD detect - can find MULTIPLE objects at once
  const predictions = await m.detect(imgElement)
  console.log('Raw CocoSSD predictions:', predictions)

  const foodPredictions = []

  predictions.forEach(prediction => {
    const className = prediction.class.toLowerCase()

    // ← EXACTLY like lecturer: check if in FOOD_CLASSES
    if (FOOD_CLASSES[className]) {
      // valid food
      const cal = getCalorieRange(className)
      if (cal) {
        foodPredictions.push({
          name: prediction.class,
          confidence: (prediction.score * 100).toFixed(1),
          count: 1,
          nutrition: {
            calories: `${cal.min} - ${cal.max}`,
            protein: cal.protein,
            carbs: cal.carbs,
            fat: cal.fat,
          }
        })
      }
    } else {
      // ignore
      console.log('Not food, ignoring:', prediction.class)
    }
  })

  // Count multiple items of same food
  const grouped = foodPredictions.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.name)
    if (existing) {
      existing.count += 1
      existing.nutrition.calories = `${parseInt(item.nutrition.calories) * existing.count} - ${parseInt(item.nutrition.calories.split('-')[1]) * existing.count}`
    } else {
      acc.push(item)
    }
    return acc
  }, [])

  return grouped
}