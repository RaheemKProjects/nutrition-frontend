const calories = {
  'banana': { min: 90, max: 120, protein: '1.1g', carbs: '23g', fat: '0.3g' },
  'onion': { min: 30, max: 60, protein: '1.1g', carbs: '9g', fat: '0.1g' },
  'pepper': { min: 20, max: 40, protein: '0.9g', carbs: '6g', fat: '0.2g' },
  'lettuce': { min: 5, max: 15, protein: '0.5g', carbs: '2g', fat: '0.1g' },
  'spinach': { min: 20, max: 30, protein: '2.9g', carbs: '3.6g', fat: '0.4g' },
  'broccoli': { min: 25, max: 55, protein: '2.8g', carbs: '7g', fat: '0.4g' },
  'carrot': { min: 30, max: 55, protein: '0.9g', carbs: '10g', fat: '0.2g' },
  'pizza': { min: 250, max: 350, protein: '12g', carbs: '36g', fat: '10g' },
  'burger': { min: 300, max: 500, protein: '20g', carbs: '29g', fat: '17g' },
  'hot dog': { min: 150, max: 300, protein: '10g', carbs: '18g', fat: '14g' },
  'sandwich': { min: 200, max: 350, protein: '11g', carbs: '33g', fat: '9g' },
  'apple': { min: 80, max: 110, protein: '0.5g', carbs: '25g', fat: '0.3g' },
  'orange': { min: 45, max: 80, protein: '1.2g', carbs: '15g', fat: '0.2g' },
  'broccoli': { min: 25, max: 55, protein: '2.8g', carbs: '7g', fat: '0.4g' },
  'carrot': { min: 30, max: 55, protein: '0.9g', carbs: '10g', fat: '0.2g' },
  'cake': { min: 250, max: 450, protein: '5g', carbs: '52g', fat: '16g' },
  'donut': { min: 250, max: 350, protein: '4g', carbs: '35g', fat: '14g' },
}


export function getCalorieRange(foodName) {
  const food = foodName.toLowerCase()
  const cal = calories[food]

  let text

  if (cal) {
    text = food + ' - ' + cal.min + ' to ' + cal.max + ' kcal'
    console.log(text) 
    return cal
  } else {
   
    text = food + ' - calorie data not found'
    console.log(text)
    return null
  }
}

export default calories