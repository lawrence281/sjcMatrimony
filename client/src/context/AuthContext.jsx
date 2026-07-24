import { createContext, useContext, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem('clientUser')
    return s ? JSON.parse(s) : null
  })

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('clientToken', res.data.token)
    localStorage.setItem('clientUser', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const register = async (name, email, password, location) => {
    const res = await api.post('/auth/register', { name, email, password, location })
    localStorage.setItem('clientToken', res.data.token)
    localStorage.setItem('clientUser', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('clientToken')
    localStorage.removeItem('clientUser')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
