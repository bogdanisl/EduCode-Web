import React, { createContext, useContext, useEffect, useState } from "react"

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  PRO: 'pro',
  TESTER: 'tester',
  GUEST: 'guest'
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export interface User {
  id: number
  fullName: string
  email: string
  lives: number
  lives_reset_at: number
  role: UserRole
  [key: string]: any
}


interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  role: UserRole
  login: (userData: User) => void
  logout: () => Promise<void>
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData: User) => {
    console.log('login')
    setUser(userData)
    console.log(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
    }
  }

  if(user)
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, role:user.role }}>
      {children}
    </AuthContext.Provider>
  )
  else
    return (
    <AuthContext.Provider value={{ user, isAuthenticated: false, login, logout, role:'guest' }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
