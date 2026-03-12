import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../store'

export default function EmotionDonePage() {
  const navigate = useNavigate()
  const { addSession, triggerType } = useStore()

  useEffect(() => {
    addSession(triggerType || 'emotion')
  }, [])

  const handleGoHome = () => navigate('/')

  const handleAgain = () => navigate('/emotion/select')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-100 to-orange-100 text-amber-900 relative overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-soft-light"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          className="text-8xl mb-6"
        >
          💨
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-light mb-2 text-amber-900"
        >
          坏情绪已清空
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-amber-700 mb-8"
        >
          现在的你，轻松又自在
        </motion.p>

        {/* Encouragement */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/30 border border-white/20 rounded-2xl p-5 mb-8 backdrop-blur-sm shadow-lg"
        >
          <p className="text-orange-800">
            别再委屈自己
          </p>
          <p className="text-amber-700 text-sm mt-1">
            你超棒的
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <button
            onClick={handleGoHome}
            className="w-full py-4 bg-gradient-to-r from-orange-300 to-amber-400 hover:from-orange-400 hover:to-amber-500
                       rounded-xl font-medium text-amber-900 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
          >
            返回首页
          </button>

          <button
            onClick={handleAgain}
            className="w-full py-3 text-amber-700 hover:text-amber-900 transition-colors"
          >
            再来一次
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
