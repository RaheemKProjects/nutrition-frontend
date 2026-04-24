import { useState, useEffect, useRef } from 'react'
import { Camera, RotateCcw, Check, Loader2, Flame, Wheat, Beef, Droplets, Apple, Home, Calendar, BarChart3, Settings, ScanLine, ScanBarcode, FileText, Library, Scan } from 'lucide-react'
import './Scanner.css'

const Scanner = ({ user, onLogout, onNavigate }) => {
  const [activeMode, setActiveMode] = useState('scan')
  const [activeNav, setActiveNav] = useState('home')
  const videoRef = useRef(null)
  const streamRef = useRef(null)

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
      console.log('Camera not available:', err.message)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const handleModeClick = (mode) => {
    setActiveMode(mode)
    if (mode === 'scan') onNavigate('home')
    else if (mode === 'barcode') onNavigate('barcode')
    else if (mode === 'label') onNavigate('foodlabel')
    else if (mode === 'library') onNavigate('library')
  }

  const handleNavClick = (nav) => {
    setActiveNav(nav)
    onNavigate(nav)
  }

  const handleCapture = () => {
    onNavigate('camera')
  }

  return (
    <div className="scanner-page">
      {/* Header */}
      <div className="scanner-header">
        <h1>Scanner</h1>
        <button className="menu-btn" onClick={() => onNavigate('settings')}>•••</button>
      </div>

      {/* Camera Viewfinder */}
      <div className="viewfinder-container">
        <video 
          ref={videoRef}
          className="camera-feed" 
          autoPlay 
          playsInline 
          muted
        />
        
        {/* Scanning frame overlay */}
        <div className="scan-frame">
          <span className="corner top-left" />
          <span className="corner top-right" />
          <span className="corner bottom-left" />
          <span className="corner bottom-right" />
        </div>
      </div>

      {/* Mode selector buttons */}
      <div className="mode-buttons">
        <button 
          className={`mode-btn ${activeMode === 'scan' ? 'active' : ''}`}
          onClick={() => handleModeClick('scan')}
        >
          <span className="mode-icon">🍎</span>
          <span>Scan food</span>
        </button>
        <button 
          className={`mode-btn ${activeMode === 'barcode' ? 'active' : ''}`}
          onClick={() => handleModeClick('barcode')}
        >
          <span className="mode-icon">|||</span>
          <span>Barcode</span>
        </button>
        <button 
          className={`mode-btn ${activeMode === 'label' ? 'active' : ''}`}
          onClick={() => handleModeClick('label')}
        >
          <span className="mode-icon">📄</span>
          <span>Food label</span>
        </button>
        <button 
          className={`mode-btn ${activeMode === 'library' ? 'active' : ''}`}
          onClick={() => handleModeClick('library')}
        >
          <span className="mode-icon">🖼</span>
          <span>Library</span>
        </button>
      </div>

      {/* Bottom Navigation with curved cutout */}
      <nav className="bottom-nav">
        <div className="nav-left">
          <button 
            className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            <Home size={22} />
            <span>Home</span>
          </button>
          <button 
            className={`nav-item ${activeNav === 'plan' ? 'active' : ''}`}
            onClick={() => handleNavClick('plan')}
          >
            <Calendar size={22} />
            <span>Plan</span>
          </button>
        </div>
        
        {/* Scanner Button in center cutout */}
        <div className="fab-container">
          <button className="fab-btn" onClick={handleCapture}>
            <Scan size={28} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="nav-right">
          <button 
            className={`nav-item ${activeNav === 'analysis' ? 'active' : ''}`}
            onClick={() => handleNavClick('analysis')}
          >
            <BarChart3 size={22} />
            <span>Analysis</span>
          </button>
          <button 
            className={`nav-item ${activeNav === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Scanner