import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface Session {
  date: string
  duration: number // in seconds
  trigger: string
}

interface StoreState {
  startTime: number | null
  setStartTime: (time: number | null) => void
  triggerType: string
  setTriggerType: (type: string) => void
  todaySessions: Session[]
  preferredSound: string
  addSession: (trigger: string) => void
  setPreferredSound: (sound: string) => void
  clearTodaySessions: () => void
}

const StoreContext = createContext<StoreState | null>(null)

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function loadSessions(): Session[] {
  try {
    const data = localStorage.getItem('naoting_sessions')
    if (!data) return []
    const sessions = JSON.parse(data) as Session[]
    const today = getToday()
    return sessions.filter(s => s.date === today)
  } catch {
    return []
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [startTime, setStartTime] = useState<number | null>(null)
  const [triggerType, setTriggerType] = useState('')
  const [todaySessions, setTodaySessions] = useState<Session[]>([])
  const [preferredSound, setPreferredSoundState] = useState('rain')

  useEffect(() => {
    setTodaySessions(loadSessions())
    const saved = localStorage.getItem('naoting_preferred_sound')
    if (saved) setPreferredSoundState(saved)
  }, [])

  const addSession = (trigger: string) => {
    const endTime = Date.now()
    const duration = startTime ? Math.floor((endTime - startTime) / 1000) : 0

    const newSession: Session = {
      date: getToday(),
      duration,
      trigger
    }

    const updated = [...todaySessions, newSession]
    setTodaySessions(updated)

    // Save to localStorage
    try {
      const allData = JSON.parse(localStorage.getItem('naoting_sessions') || '[]')
      const today = getToday()
      const otherDays = allData.filter((s: Session) => s.date !== today)
      const newData = [...otherDays, newSession]
      localStorage.setItem('naoting_sessions', JSON.stringify(newData))
    } catch (e) {
      console.error('Failed to save session', e)
    }

    setStartTime(null)
    setTriggerType('')
  }

  const setPreferredSound = (sound: string) => {
    setPreferredSoundState(sound)
    localStorage.setItem('naoting_preferred_sound', sound)
  }

  const clearTodaySessions = () => {
    setTodaySessions([])
  }

  return (
    <StoreContext.Provider
      value={{
        startTime,
        setStartTime,
        triggerType,
        setTriggerType,
        todaySessions,
        preferredSound,
        addSession,
        setPreferredSound,
        clearTodaySessions
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}
