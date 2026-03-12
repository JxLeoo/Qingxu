import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../store'


const BREATH_CYCLE = {
  inhale: 4,
  hold: 7,
  exhale: 8,
  total: 19
}

export default function InsomniaSleepPage() {
  const navigate = useNavigate()
  const { setStartTime, triggerType, preferredSound } = useStore()
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [isPlaying, setIsPlaying] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const audioContextRef = useRef<AudioContext | null>(null)
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const intervalRef = useRef<number | null>(null)

  const selectedSound = preferredSound || 'rain'

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
    if (!triggerType) setStartTime(Date.now())
    playNoise()

    return () => {
      stopNoise()
    }
  }, [])

  useEffect(() => {
    let cycleTime = 0
    intervalRef.current = window.setInterval(() => {
      cycleTime++
      setSeconds(cycleTime)

      const position = cycleTime % BREATH_CYCLE.total

      if (position < BREATH_CYCLE.inhale) {
        setPhase('inhale')
      } else if (position < BREATH_CYCLE.inhale + BREATH_CYCLE.hold) {
        setPhase('hold')
      } else {
        setPhase('exhale')
      }

      if (cycleTime >= 900) {
        navigate('/insomnia/done')
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const initAudioContext = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }
    return audioContextRef.current
  }

  const createNoiseBuffer = (ctx: AudioContext, type: string) => {
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = buffer.getChannelData(0)

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1

      if (type === 'rain') {
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
        b6 = white * 0.115926
      } else if (type === 'stream') {
        b0 = white * 0.5
        b1 = (b0 + b1) * 0.5
        output[i] = (b0 + b1) * 0.3
      } else {
        b0 = b0 * 0.99 + (Math.random() * 2 - 1) * 0.01
        output[i] = b0 + Math.sin(i / 300) * 0.05
      }
    }

    return buffer
  }

  const playNoise = async () => {
    try {
      const ctx = await initAudioContext()

      if (noiseNodeRef.current) {
        try { noiseNodeRef.current.stop() } catch (e) {}
      }

      const buffer = createNoiseBuffer(ctx, selectedSound)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = selectedSound === 'stream' ? 600 : 1500

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1)

      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      source.start()

      noiseNodeRef.current = source
      gainNodeRef.current = gain
      setIsPlaying(true)
    } catch (e) {
      console.error('Audio error:', e)
    }
  }

  const stopNoise = () => {
    if (noiseNodeRef.current) {
      try { noiseNodeRef.current.stop() } catch (e) {}
      noiseNodeRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsPlaying(false)
  }



  const handleDone = () => {
    stopNoise()
    navigate('/insomnia/done')
  }

  const getBreathScale = () => {
    switch (phase) {
      case 'inhale': return 1.6
      case 'hold': return 1.6
      case 'exhale': return 1
    }
  }



  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return '吸气'
      case 'hold': return '屏住'
      case 'exhale': return '呼气'
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden flex flex-col">
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

      {/* Breathing Nebula */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Pulsing Layers */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-full rounded-full bg-indigo-500"
              animate={{
                scale: isPlaying ? [1, 1.2, 1] : 1,
                opacity: isPlaying ? [0.1, 0.3, 0.1] : 0.1,
              }}
              transition={{
                duration: BREATH_CYCLE.total / 2,
                repeat: Infinity,
                delay: i * (BREATH_CYCLE.total / 6),
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Main Breathing Circle */}
          <motion.div
            animate={{
              scale: getBreathScale(),
            }}
            transition={{
              duration: phase === 'hold' ? 0.5 : BREATH_CYCLE[phase],
              ease: 'easeInOut'
            }}
            className="relative w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500/80 to-purple-500/80
                       flex items-center justify-center shadow-2xl shadow-indigo-500/30"
          >
            <div className="absolute inset-0 rounded-full bg-black/20" />
            <span className="relative text-2xl font-light text-white tracking-widest">
              {getPhaseText()}
            </span>
          </motion.div>
        </div>

        {/* Timer */}
        <div className="mt-12 text-slate-400 text-lg font-light tracking-widest">
          {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
        </div>

        {/* Sound indicator */}
        <div className="absolute top-6 right-6 flex items-center gap-2 text-slate-300 text-sm bg-white/5 p-2 rounded-lg backdrop-blur-sm">
          <span>🌧️</span>
          <span>雨声</span>
        </div>
      </div>

      {/* Bottom */}
      <div className="p-6 pb-12">
        <button
          onClick={handleDone}
          className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl font-light text-slate-300
                     transition-all active:scale-[0.99] border border-white/10 shadow-lg"
        >
          我好了
        </button>
      </div>
    </div>
  )
}
