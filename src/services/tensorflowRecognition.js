import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'
import { getCalorieRange } from '../data/foodCalories'

let model = null

// the FOOD_CLASSES - CocoSSD food items we want to detect, do it this for now to see if it works
const FOOD_CLASSES = {
  // fruit 
  'banana': true,
  'apple': true,
   'orange': true,
  'sandwich': true,
  'grape': true,
  'strawberry': true,
  'pear': true,
  'melon': true,
  'watermelon': true,
  'kiwi': true,
  'mango': true,
  'pineapple': true,
  'passion fruit': true,
  'blueberry': true,
  'blackberry': true,
  'peach': true,

  //vegetables
  'broccoli': true,
  'carrot': true,
  'cucumber': true,
  'tomato': true,
  'lettuce': true, 
  'spinach': true,
  'onion': true,
  'pepper': true,

  // junk food
  'pizza': true,
  'hot dog': true,
  'cake': true,
  'donut': true,
  'cookie': true,
  'fries': true,
  'burger': true,
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

    //  do it like Cain for now 
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