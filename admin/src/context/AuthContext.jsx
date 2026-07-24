import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('adminUser')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    if (res.data.user.role !== 'admin') throw new Error('Admin access required')
    localStorage.setItem('adminToken', res.data.token)
    localStorage.setItem('adminUser', JSON.stringify(res.data.user))
    setAdmin(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setAdmin(null)
  }

  return <AuthContext.Provider value={{ admin, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
