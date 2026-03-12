import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Flame, Clock, Zap, Award } from 'lucide-react'
import { useStore } from '../store'

interface Milestone {
  id: string
  name: string
  count: number
  icon: string
  unlocked: boolean
}

export default function StatsPage() {
  const navigate = useNavigate()
  const { todaySessions, clearTodaySessions } = useStore()
  const [streak, setStreak] = useState(0)

  const totalSessions = todaySessions.length
  const totalDuration = todaySessions.reduce((acc, s) => acc + s.duration, 0)

  useEffect(() => {
    const stored = localStorage.getItem('naoting_streak')
    if (stored) {
      setStreak(parseInt(stored))
    } else if (totalSessions > 0) {
      setStreak(1)
      localStorage.setItem('naoting_streak', '1')
    }
  }, [totalSessions])

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`
    const mins = Math.floor(seconds / 60)
    if (mins < 60) return `${mins}分钟`
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    return `${hours}小时${remainingMins}分钟`
  }

  const milestones: Milestone[] = [
    { id: 'first', name: '首次止损', count: 1, icon: '🎯', unlocked: totalSessions >= 1 },
    { id: 'three', name: '小试牛刀', count: 3, icon: '⭐', unlocked: totalSessions >= 3 },
    { id: 'seven', name: '连续一周', count: 7, icon: '🔥', unlocked: streak >= 7 },
    { id: 'thirty', name: '月度MVP', count: 30, icon: '🏆', unlocked: totalSessions >= 30 },
  ]

  const today = new Date()
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-green-100 text-amber-900 relative overflow-hidden">
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-soft-light"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Header */}
      <div className="relative z-10 p-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
      </div>

      {/* Stats */}
      <div className="relative z-10 px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-light mb-1 text-amber-900">今日数据</h1>
          <p className="text-amber-700">{dateStr}</p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/30 border border-white/20 rounded-2xl p-6 text-center backdrop-blur-sm shadow-lg"
          >
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-3xl font-bold text-amber-900 mb-1">{totalSessions}</div>
            <div className="text-amber-700 text-sm">止损次数</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/30 border border-white/20 rounded-2xl p-6 text-center backdrop-blur-sm shadow-lg"
          >
            <Clock className="w-8 h-8 mx-auto mb-2 text-sky-600" />
            <div className="text-3xl font-bold text-amber-900 mb-1">
              {formatDuration(totalDuration)}
            </div>
            <div className="text-amber-700 text-sm">累计时长</div>
          </motion.div>
        </div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-200/50 to-amber-200/50 border border-orange-400/30
                     rounded-2xl p-6 mb-8 flex items-center justify-between backdrop-blur-sm shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl
                            flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-medium text-lg text-amber-900">连续使用</div>
              <div className="text-amber-700 text-sm">
                {streak > 0 ? `${streak} 天` : '今天开始啦'}
              </div>
            </div>
          </div>
          <div className="text-3xl">
            {streak > 0 ? '🔥' : '🌱'}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2 text-amber-900">
            <Award className="w-5 h-5 text-yellow-600" />
            里程碑
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-xl border transition-all backdrop-blur-sm shadow-md ${
                  milestone.unlocked
                    ? 'bg-amber-400/30 border-amber-500/50'
                    : 'bg-white/20 border-white/10 opacity-60'
                }`}
              >
                <div className="text-2xl mb-1">{milestone.icon}</div>
                <div className="font-medium text-sm text-amber-900">{milestone.name}</div>
                <div className="text-amber-700 text-xs">
                  {milestone.unlocked ? '已解锁' : `${milestone.count}次`}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Debug - clear data */}
      {totalSessions > 0 && (
        <div className="relative z-10 px-6 pb-12">
          <button
            onClick={() => {
              clearTodaySessions()
              localStorage.removeItem('naoting_sessions')
              localStorage.removeItem('naoting_streak')
              window.location.reload()
            }}
            className="text-amber-700/50 hover:text-amber-700 text-xs transition-colors"
          >
            清空今日数据（测试用）
          </button>
        </div>
      )}
    </div>
  )
}
