import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../store'

const COOLDOWN_SECONDS = 30

export default function ObsessSealPage() {
  const navigate = useNavigate()
  const { startTime, setStartTime } = useStore()
  const [secondsLeft, setSecondsLeft] = useState(COOLDOWN_SECONDS)
  const thought = sessionStorage.getItem('obsess_thought') || ''


  useEffect(() => {
    if (!startTime) setStartTime(Date.now())

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setTimeout(() => navigate('/obsess/done'), 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-green-100 to-teal-100 text-emerald-900 relative overflow-hidden flex flex-col transition-colors duration-500">
      {/* Background is now part of the main div */}

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* Floating thought bubble being sealed */}
        <div className="relative w-40 h-40 mb-8">
          {/* Outer ring - lock effect */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-2 border-lime-500/40 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 border border-green-400/50 rounded-full"
          />

          {/* Center - thought fading */}
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 5, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-6xl">📦</div>
          </motion.div>

          {/* Lock icon appearing */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-6xl">🔒</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Main text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-light text-center mb-2 text-emerald-900"
        >
          执念已封存
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-emerald-700 text-center mb-8"
        >
          {thought ? `\"${thought}\" 已锁定` : '思绪已锁定'}
        </motion.p>

        {/* Simple countdown */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lime-600 text-sm"
        >
          {secondsLeft}秒后释放
        </motion.p>
      </div>

      {/* Bottom hint */}
      <div className="relative z-10 p-8 text-center">
        <p className="text-emerald-600 text-sm">
          此刻无需内耗
        </p>
      </div>
    </div>
  )
}
