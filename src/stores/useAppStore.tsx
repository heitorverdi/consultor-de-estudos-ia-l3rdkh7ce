import React, { createContext, useContext, useState, ReactNode } from 'react'

interface UserProfile {
  name: string
  goal: string
  streak: number
  onboarded: boolean
  avatar: string
}

interface AppContextType {
  user: UserProfile
  updateUser: (data: Partial<UserProfile>) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const defaultUser: UserProfile = {
  name: 'Estudante',
  goal: 'ENEM 2024',
  streak: 12,
  onboarded: false,
  avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=4',
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }))
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <AppContext.Provider value={{ user, updateUser, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}
