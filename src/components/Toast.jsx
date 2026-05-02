import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])
  
  if (!isVisible) return null
  
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#161B22] border-l-4 border-orange-500 rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg animate-fade-in">
      <Check className="w-5 h-5 text-orange-500" />
      <p className="text-white text-sm">{message}</p>
    </div>
  )
}

export default Toast