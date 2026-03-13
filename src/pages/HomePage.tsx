import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store'


import { ThemeToggle } from '../components/ThemeToggle'


const scenarios = [
  {
    id: 'obsess',
    path: '/obsess/input',
    emoji: '💭',
    title: '思绪纷飞',
    description: '一件事想个没完',
    accent: 'from-lime-300 to-green-400',
    cardClassName: 'bg-lime-100/60 hover:bg-lime-200/60 border-lime-200/80 dark:bg-lime-900/20 dark:hover:bg-lime-900/40 dark:border-lime-800/50'
  },
  {
    id: 'insomnia',
    path: '/insomnia/relax',
    emoji: '😴',
    title: '睡不着',
    description: '脑子乱糟糟的',
    accent: 'from-blue-400 to-indigo-500',
    cardClassName: 'bg-blue-200/60 hover:bg-blue-300/60 border-blue-300/80 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:border-blue-800/50'
  },
  {
    id: 'emotion',
    path: '/emotion/select',
    emoji: '💔',
    title: '心里堵得慌',
    description: '越想越难受',
    accent: 'from-amber-300 to-orange-400',
    cardClassName: 'bg-amber-100/60 hover:bg-amber-200/60 border-amber-200/80 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:border-amber-800/50'
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { setStartTime, setTriggerType } = useStore()

  const handleScenario = (scenario: typeof scenarios[0]) => {
    // Trigger re-deploy
    setStartTime(Date.now())
    setTriggerType(scenario.id)
    navigate(scenario.path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-green-100 text-green-900 relative overflow-hidden transition-colors duration-500 dark:from-slate-900 dark:via-slate-800 dark:to-black dark:text-slate-300">
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          {/* Brand mark - minimalist */}
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-3xl font-bold italic tracking-[0.1em] uppercase bg-gradient-to-r from-lime-400 to-green-500 text-transparent bg-clip-text relative" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3)) drop-shadow(0 0 15px rgba(101, 163, 13, 0.5))' }}>
                UNWORRY
              </h2>
            </motion.div>

            {/* Typography - refined */}
            <h1 className="text-[32px] font-light tracking-tight mb-3 text-green-900 dark:text-green-200">
              思绪不断反复？
            </h1>
            <p className="text-green-700 text-[15px] font-light tracking-wide dark:text-green-400">
              点一下，立刻轻松
            </p>
          </motion.div>

          {/* Scenario Cards - Awwwards style: minimal, large click area */}
          <div className="w-full max-w-[320px] space-y-3">
            {scenarios.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                  damping: 10
                }}
                onClick={() => handleScenario(item)}
                className={`group w-full relative p-5 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[0.99] backdrop-blur-md ${item.cardClassName}`}
              >
                {/* Content */}
                <div className="relative flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-500`}>
                    <span className="text-xl">{item.emoji}</span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <div className="font-light text-[17px] text-green-900 dark:text-slate-200">{item.title}</div>
                    <div className="text-green-700 text-[13px] mt-0.5 dark:text-slate-400">{item.description}</div>
                  </div>

                  {/* Arrow */}
                  <div className="text-green-500 group-hover:text-green-700 group-hover:translate-x-1 transition-all duration-300">
                    →
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative z-10 px-6 pb-10 text-center"
        >
          <button
            onClick={() => navigate('/stats')}
            className="text-green-700 hover:text-green-900 text-[13px] font-light tracking-wide transition-colors duration-300"
        >
          今日数据
        </button>
      </motion.div>
    </div>
  )
}
