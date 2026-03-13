import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../store'

export default function InsomniaRelaxPage() {
  const navigate = useNavigate()
  const { setStartTime, triggerType } = useStore()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

    const timer = setTimeout(() => {
      navigate('/insomnia/sleep')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-900 text-white relative overflow-hidden flex flex-col items-center justify-center"
    >
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-7xl mb-8"
        >
          🌙
        </motion.div>

        <h1 className="text-3xl font-light mb-3 text-white">
          闭上眼，慢慢放松
        </h1>

        <p className="text-slate-400 mb-6">
          困意正在向你靠近～
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-2 text-slate-500"
        >
          <span className="text-lg">🎧</span>
          <span className="text-sm">戴上耳机，效果翻倍</span>
        </motion.div>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-indigo-500/50 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
