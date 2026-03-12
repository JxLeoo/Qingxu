import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mic, Square, X } from 'lucide-react'

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  color: string
  popped: boolean
}

const BUBBLE_COLORS = [
  'bg-pink-400',
  'bg-rose-400',
  'bg-purple-400',
  'bg-violet-400',
  'bg-fuchsia-400',
]

export default function EmotionReleasePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'bubble'

  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showDone, setShowDone] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (type === 'bubble' && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const newBubbles: Bubble[] = []
      const count = 35

      for (let i = 0; i < count; i++) {
        const x = Math.random() * (rect.width - 100) + 20
        const y = Math.random() * (rect.height - 100) + 20

        newBubbles.push({
          id: i,
          x,
          y,
          size: 45 + Math.random() * 40,
          color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
          popped: false
        })
      }
      setBubbles(newBubbles)
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [type])

  useEffect(() => {
    if (type === 'voice' && isRecording && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const draw = () => {
        if (!analyserRef.current || !ctx) return

        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyserRef.current.getByteTimeDomainData(dataArray)

        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.lineWidth = 1.5
        ctx.strokeStyle = '#a78bfa' // violet-400
        ctx.beginPath()

        const sliceWidth = canvas.width / bufferLength
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0
          const y = (v * canvas.height) / 2

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }

          x += sliceWidth
        }

        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.stroke()

        animationRef.current = requestAnimationFrame(draw)
      }

      draw()
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [type, isRecording])

  const popBubble = (id: number) => {
    setBubbles(prev => prev.map(b =>
      b.id === id ? { ...b, popped: true } : b
    ))

    if (navigator.vibrate) {
      navigator.vibrate(15)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      source.connect(analyserRef.current)

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setShowDone(false)

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (e) {
      console.error('Recording error:', e)
    }
  }

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setIsRecording(false)

    if (recordingTime >= 2) {
      setShowDone(true)
      setTimeout(() => {
        navigate('/emotion/done')
      }, 300)
    } else {
      setRecordingTime(0)
    }
  }, [recordingTime, navigate])

  // Bubble view
  if (type === 'bubble') {
    return (
      <div className="min-h-screen bg-slate-800 overflow-hidden relative">
        {/* Metallic glossy background effect */}
        <div
          className="pointer-events-none absolute -inset-px opacity-50 transition duration-300"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
          }}
        />
        <div
          className="pointer-events-none absolute -inset-px opacity-70 transition duration-300"
          style={{
            background: `radial-gradient(600px at ${window.innerWidth - mousePosition.x}px ${window.innerHeight - mousePosition.y}px, rgba(107, 33, 168, 0.1), transparent 80%)`,
          }}
        />

        {/* Back button */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate('/emotion/select')}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all backdrop-blur-sm border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Bubbles container */}
        <div ref={containerRef} className="absolute inset-0">
          <AnimatePresence>
            {bubbles.map((bubble) => (
              !bubble.popped && (
                <motion.button
                  key={bubble.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => popBubble(bubble.id)}
                  className={`absolute ${bubble.color} rounded-full
                             flex items-center justify-center shadow-lg opacity-60`}
                  style={{
                    left: bubble.x,
                    top: bubble.y,
                    width: bubble.size,
                    height: bubble.size,
                  }}
                >
                  <div className="w-1/2 h-1/2 bg-white/40 rounded-full" />
                </motion.button>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Hint */}
        <div className="absolute bottom-10 left-0 right-0 text-center text-slate-400 text-[13px] font-light tracking-wide">
          戳破所有不开心
        </div>
      </div>
    )
  }

  // Voice recording view
  return (
    <div className="min-h-screen bg-slate-800 text-white flex flex-col relative overflow-hidden">
      {/* Metallic glossy background effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-50 transition duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px opacity-70 transition duration-300"
        style={{
          background: `radial-gradient(600px at ${window.innerWidth - mousePosition.x}px ${window.innerHeight - mousePosition.y}px, rgba(107, 33, 168, 0.1), transparent 80%)`,
        }}
      />

      {/* Header */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => navigate('/emotion/select')}
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all backdrop-blur-sm border border-white/10"
        >
          <X className="w-4 h-4 text-white/50" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <canvas
          ref={canvasRef}
          width={300}
          height={120}
          className="w-full max-w-[280px] h-28 mb-10 rounded-2xl bg-white/5 backdrop-blur-sm shadow-inner"
        />

        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          whileTap={{ scale: 0.92 }}
          className={`w-28 h-28 rounded-full flex items-center justify-center
                     transition-all duration-300 text-white ${
                       isRecording || showDone
                         ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30'
                         : 'bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg shadow-indigo-500/30'
                     }`}
        >
          {showDone ? (
            <span className="text-3xl">✓</span>
          ) : isRecording ? (
            <Square className="w-9 h-9" />
          ) : (
            <Mic className="w-9 h-9" />
          )}
        </motion.button>

        <div className="mt-8 text-center">
          {showDone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-green-400 text-[15px] font-light"
            >
              已销毁
            </motion.div>
          ) : isRecording ? (
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-slate-300 text-[14px] font-light"
            >
              录音中... {recordingTime}秒
            </motion.div>
          ) : (
            <p className="text-slate-400 text-[14px] font-light">
              点击录音，说完再点结束
            </p>
          )}
        </div>

        {recordingTime > 0 && !isRecording && !showDone && (
          <div className="mt-4 text-slate-500 text-[13px]">
            录音时间太短，需要至少2秒
          </div>
        )}
      </div>
    </div>
  )
}
