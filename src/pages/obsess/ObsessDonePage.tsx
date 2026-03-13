import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../store'

export default function ObsessDonePage() {
  const navigate = useNavigate()
  const { addSession, triggerType } = useStore()
  const thought = sessionStorage.getItem('obsess_thought') || ''


  useEffect(() => {
    addSession(triggerType || 'obsess')
  }, [])

  const handleGoHome = () => {
    sessionStorage.removeItem('obsess_thought')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-green-100 to-teal-100 text-emerald-900 relative overflow-hidden flex flex-col items-center justify-center px-6 transition-colors duration-500">
      {/* Background is now part of the main div */}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-lime-500 to-green-600
                     rounded-full flex items-center justify-center shadow-lg shadow-lime-500/20"
        >
          <span className="text-5xl text-white">✓</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-light mb-2 text-emerald-900"
        >
          执念封存成功
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-emerald-700 mb-2"
        >
          脑子终于清净啦
        </motion.p>

        {thought && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-emerald-600 text-sm mb-6"
          >
            "{thought.length > 15 ? thought.slice(0, 15) + '...' : thought}"
          </motion.p>
        )}

        {/* Tips */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/40 border border-white/50 rounded-2xl p-4 mb-8 backdrop-blur-md shadow-lg"
        >
          <p className="text-emerald-900">
            去喝口水、伸个懒腰
          </p>
          <p className="text-emerald-700 text-sm mt-1">
            好好爱自己
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
            className="w-full py-4 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400
                       rounded-xl font-medium text-white transition-all active:scale-[0.98] shadow-lg shadow-lime-500/20"
          >
            返回首页
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
