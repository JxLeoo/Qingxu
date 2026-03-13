import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from './lib/supabase'

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
  addSession: (trigger: string) => Promise<void>
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

  const addSession = async (trigger: string) => {
    if (!startTime) return

    const duration_ms = Date.now() - startTime
    const { error } = await supabase
      .from('activities')
      .insert({ type: trigger, duration_ms })

    if (error) {
      console.error('Error saving activity to Supabase:', error)
    }

    // Reset state only after the database operation is complete
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
