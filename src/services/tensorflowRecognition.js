import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as mobilenet from '@tensorflow-models/mobilenet'
import '@tensorflow/tfjs'
import { getCalorieRange } from '../data/foodCalories'

let cocoModel = null
let mobileModel = null

const FOOD_CLASSES = {

  // fruits
  'banana': true,
  'apple': true,
  'orange': true,
  'lemon': true,
  'strawberry': true,
  'pineapple': true,

  //vegetables
  'broccoli': true,
  'carrot': true,
  'cucumber': true,
  'mushroom': true,
  'cauliflower': true,
  'onion': true,

  // Fast Food
  'pizza': true,
  'hot dog': true,
  'hotdog': true,
  'donut': true,
  'cake': true,
  'sandwich': true,
  'cheeseburger': true,
  'ice cream': true,
  'french fries': true,
}


export async function loadModels() {
  console.log('Loading both models...')

  
  const [coco, mobile] = await Promise.all([
    cocoSsd.load(),
    mobilenet.load()
  ])

  cocoModel = coco
  mobileModel = mobile

  console.log('Both models loaded!')
}

export async function classifyFood(imgElement) {
  
  if (!cocoModel || !mobileModel) {
    await loadModels()
  }

  // Run both models at the same time
  const [cocoResults, mobileResults] = await Promise.all([
    cocoModel.detect(imgElement),
    mobileModel.classify(imgElement)
  ])

  console.log('CocoSSD results:', cocoResults)
  console.log('MobileNet results:', mobileResults)

  const foodPredictions = []
  const seenFoods = new Set() 

  
  cocoResults.forEach(prediction => {
    const className = prediction.class.toLowerCase()
    if (FOOD_CLASSES[className] && !seenFoods.has(className)) {
      const cal = getCalorieRange(className)
      if (cal) {
        seenFoods.add(className)
        foodPredictions.push({
          name: prediction.class,
          confidence: (prediction.score * 100).toFixed(1),
          source: 'CocoSSD',
          nutrition: {
            calories: `${cal.min} - ${cal.max}`,
            protein: cal.protein,
            carbs: cal.carbs,
            fat: cal.fat,
          }
        })
      }
    } else {
      console.log('Not food (CocoSSD), ignoring:', prediction.class)
    }
  })

  /
  mobileResults.forEach(prediction => {
    const className = prediction.className.toLowerCase()

    Object.keys(FOOD_CLASSES).forEach(food => {
      if (className.includes(food) && !seenFoods.has(food)) {
        const cal = getCalorieRange(food)
        if (cal) {
          seenFoods.add(food)
          foodPredictions.push({
            name: food,
            confidence: (prediction.probability * 100).toFixed(1),
            source: 'MobileNet',
            nutrition: {
              calories: `${cal.min} - ${cal.max}`,
              protein: cal.protein,
              carbs: cal.carbs,
              fat: cal.fat,
            }
          })
        }
      } else {
        console.log('Not food (MobileNet), ignoring:', className)
      }
    })
  })

  
  return foodPredictions.sort((a, b) =>
    parseFloat(b.confidence) - parseFloat(a.confidence)
  )
}