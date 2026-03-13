import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine } from 'lucide-react'

export default function ObsessInputPage() {
  const navigate = useNavigate()
  const [thought, setThought] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const handleContinue = () => {
    if (!thought.trim()) {
      setShowConfirm(true)
      return
    }
    sessionStorage.setItem('obsess_thought', thought)
    navigate('/obsess/seal')
  }

  const handleSkip = () => {
    sessionStorage.setItem('obsess_thought', '')
    navigate('/obsess/seal')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-green-100 to-teal-100 text-emerald-900 relative overflow-hidden flex flex-col transition-colors duration-500">
      {/* Header */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors text-[14px] font-light"
        >
          ← 返回
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[320px]"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="w-14 h-14 mx-auto mb-6 bg-white/40
                         border border-white/50 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg"
            >
              <PenLine className="w-6 h-6 text-lime-600" />
            </motion.div>
            <h1 className="text-[22px] font-light text-emerald-900 mb-2">
              把反复纠结的事写下来
            </h1>
            <p className="text-emerald-700 text-[14px]">
              写完就放下，别自己扛着
            </p>
          </div>

          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value.slice(0, 100))}
            placeholder="10字内说清就好..."
            className="w-full h-28 p-4 bg-white/40 border border-white/50 rounded-2xl
                       text-emerald-900 placeholder-emerald-600/80 resize-none text-[16px]
                       focus:outline-none focus:border-lime-500/50 focus:bg-white/60
                       transition-all backdrop-blur-md shadow-inner"
            autoFocus
          />

          <div className="text-right text-emerald-600 text-[12px] mt-3">
            {thought.length}/100
          </div>

          {thought.length > 10 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lime-600 text-[13px] text-center mt-3"
            >
              精简一点，放下更快
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Actions */}
      <div className="relative z-10 p-6 pb-12 space-y-2">
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400
                     rounded-xl font-light text-white transition-all active:scale-[0.99] shadow-lg shadow-lime-500/20"
        >
          确认写下
        </button>
        <button
          onClick={handleSkip}
          className="w-full py-3 text-emerald-700 hover:text-emerald-900 transition-colors text-[14px]"
        >
          直接封存
        </button>
      </div>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/80 border border-white/20 rounded-3xl p-6 max-w-[280px] w-full shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-3xl mb-3">🤔</div>
                <h3 className="text-[17px] font-light mb-2 text-emerald-900">不写点什么？</h3>
                <p className="text-emerald-700 text-[13px]">
                  直接封存也可以
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-black/5 hover:bg-black/10 rounded-xl font-light
                             text-emerald-800 transition-colors text-[14px]"
                >
                  取消
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 bg-gradient-to-r from-lime-500 to-green-500
                             rounded-xl font-light text-white transition-colors text-[14px] shadow-lg"
                >
                  直接封存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
