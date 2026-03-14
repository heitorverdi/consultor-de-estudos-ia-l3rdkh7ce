import React, { createContext, useContext, useState, ReactNode } from 'react'

export const CORE_SUBJECTS = [
  'Matemática',
  'Física',
  'Química',
  'Biologia',
  'História',
  'Geografia',
  'Sociologia',
  'Filosofia',
  'Literatura',
  'Produção de Texto',
  'Gramática',
] as const

export type Subject = (typeof CORE_SUBJECTS)[number]

export interface UserProfile {
  name: string
  schoolYear: string
  goal: string
  difficultSubjects: Subject[]
  weeklyStudyHours: number
  dailyStudyTime: number
  peakEnergy: string
  studyPreference: string
  streak: number
  onboarded: boolean
  avatar: string
}

export interface AgendaEvent {
  id: string
  title: string
  start: number
  end: number
  type: 'routine' | 'study'
  subject?: Subject
}

export interface Flashcard {
  id: string
  front: string
  back: string
  difficulty?: 'Fácil' | 'Médio' | 'Difícil'
}

export interface FlashcardDeck {
  id: string
  title: string
  subject: Subject
  cards: Flashcard[]
  progress: number
  dueToday: number
}

export interface Task {
  id: string
  title: string
  completed: boolean
}

interface AppContextType {
  user: UserProfile
  updateUser: (data: Partial<UserProfile>) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  events: AgendaEvent[]
  setEvents: (events: AgendaEvent[]) => void
  addEvent: (event: AgendaEvent) => void
  decks: FlashcardDeck[]
  setDecks: (decks: FlashcardDeck[]) => void
  addDeck: (deck: FlashcardDeck) => void
  updateDeck: (id: string, updates: Partial<FlashcardDeck>) => void
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
}

const defaultUser: UserProfile = {
  name: '',
  schoolYear: '',
  goal: '',
  difficultSubjects: [],
  weeklyStudyHours: 20,
  dailyStudyTime: 4,
  peakEnergy: '',
  studyPreference: '',
  streak: 0,
  onboarded: false,
  avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=4',
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [decks, setDecks] = useState<FlashcardDeck[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const updateUser = (data: Partial<UserProfile>) => setUser((p) => ({ ...p, ...data }))
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const addEvent = (e: AgendaEvent) => setEvents((p) => [...p, e])
  const addDeck = (d: FlashcardDeck) => setDecks((p) => [...p, d])
  const updateDeck = (id: string, u: Partial<FlashcardDeck>) =>
    setDecks((p) => p.map((d) => (d.id === id ? { ...d, ...u } : d)))

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        theme,
        toggleTheme,
        events,
        setEvents,
        addEvent,
        decks,
        setDecks,
        addDeck,
        updateDeck,
        tasks,
        setTasks,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
