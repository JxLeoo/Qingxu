import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../store'
import { PaperPlaneIcon } from '../../components/PaperPlaneIcon'

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-lime-100 via-green-100 to-teal-100 text-emerald-900 relative overflow-hidden flex flex-col transition-colors duration-500"
    >
      {/* Background is now part of the main div */}

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* Paper airplane flying away animation */}
        <motion.div
          className="relative w-40 h-40 mb-8 flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              x: [0, 150, 300],
              y: [0, -60, -150],
              rotate: [-15, 10, 25],
              scale: [1, 1.1, 0.5],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 3,
              ease: "easeIn",
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <PaperPlaneIcon className="w-20 h-20 text-lime-600" />
          </motion.div>
        </motion.div>

        {/* Main text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-light text-center mb-2 text-emerald-900"
        >
          思绪已放飞
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-emerald-700 text-center mb-8"
        >
          {thought ? `\"${thought}\" 已随风而去` : '你的思绪已随风而去'}
        </motion.p>

        {/* Simple countdown */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lime-600 text-sm"
        >
          {secondsLeft}秒后返回
        </motion.p>
      </div>

      {/* Bottom hint */}
      <div className="relative z-10 p-8 text-center">
        <p className="text-emerald-600 text-sm">
          此刻无需内耗
        </p>
      </div>
    </motion.div>
  )
}
