import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../store'

export default function InsomniaDonePage() {
  const navigate = useNavigate()
  const { addSession, triggerType } = useStore()
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
    addSession(triggerType || 'insomnia')
  }, [])

  const handleGoHome = () => navigate('/')

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden flex flex-col items-center justify-center px-6 transition-colors duration-500">
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
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        {/* Moon Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          className="text-8xl mb-6"
        >
          🌙
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-light mb-2 text-white"
        >
          呼吸已平稳
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 mb-8"
        >
          放下手机，安心睡觉吧
        </motion.p>

        {/* Tips */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 backdrop-blur-sm shadow-lg"
        >
          <p className="text-indigo-300">
            晚安，好梦
          </p>
        </motion.div>

        {/* Action */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={handleGoHome}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400
                     rounded-xl font-medium text-white transition-all shadow-lg shadow-indigo-500/20"
        >
          返回
        </motion.button>
      </motion.div>
    </div>
  )
}
