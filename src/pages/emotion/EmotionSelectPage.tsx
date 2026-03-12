import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../store'


const releaseMethods = [
  {
    id: 'bubble',
    path: '/emotion/release?type=bubble',
    emoji: '🫧',
    title: '捏爆泡泡',
    description: '戳破所有不开心',
    accent: 'from-orange-400 to-red-400',
  },
  {
    id: 'voice',
    path: '/emotion/release?type=voice',
    emoji: '🎤',
    title: '说出来',
    description: '说完就销毁，没人听见',
    accent: 'from-yellow-400 to-amber-400',
  },
]

export default function EmotionSelectPage() {
  const navigate = useNavigate()
  const { setStartTime, triggerType } = useStore()
  const handleSelect = (method: typeof releaseMethods[0]) => {
    if (!triggerType) setStartTime(Date.now())
    navigate(method.path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 text-amber-900 relative overflow-hidden transition-colors duration-500">
      {/* Header */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors text-[14px] font-light"
        >
          ← 返回
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[320px]"
        >
          <div className="text-center mb-12">
            <h1 className="text-[24px] font-light text-amber-900 mb-2">
              选一种方式，把坏情绪放出来
            </h1>
            <p className="text-amber-700 text-[14px]">
              怎么舒服怎么来，不用憋着
            </p>
          </div>

          {/* Method Cards */}
          <div className="space-y-3">
            {releaseMethods.map((method, index) => (
              <motion.button
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 * (index + 1),
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1]
                }}
                onClick={() => handleSelect(method)}
                className="group w-full relative p-5 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[0.99] bg-white/40 border border-white/50 hover:bg-white/60 backdrop-blur-md"
              >
                {/* Content */}
                <div className="relative flex items-center gap-4">
                  {/* Emoji */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.accent} flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-500`}>
                    <span className="text-2xl">{method.emoji}</span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <div className="text-amber-900 font-light text-[17px]">{method.title}</div>
                    <div className="text-amber-700 text-[13px] mt-0.5">{method.description}</div>
                  </div>

                  {/* Arrow */}
                  <div className="text-amber-500 group-hover:text-amber-700 group-hover:translate-x-1 transition-all duration-300">
                    →
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
