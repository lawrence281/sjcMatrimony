import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Mail, Lock, ArrowRight, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { MESSAGES } from '../constants'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isRegister) {
        await register(name, email, password)
        toast.success(MESSAGES.AUTH.REGISTER_SUCCESS)
      } else {
        await login(email, password)
        toast.success(MESSAGES.AUTH.LOGIN_SUCCESS)
      }
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #1A273D 0%, #2A3B56 100%)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 4px 12px rgba(26, 39, 61, 0.2)'
          }}>
            <Sparkles size={26} color="#C59B4E" fill="#C59B4E" />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 700, color: '#1B2535', margin: '0 0 6px 0' }}>
            {isRegister ? 'Join SJC Matrimony' : 'Welcome Back'}
          </h1>
          <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>
            {isRegister ? 'Begin your journey to a sacred union' : 'Access your matrimony profile'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            {isRegister ? 'Create Account' : 'Sign In'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer">
          {isRegister ? (
            <p>Already have an account? <button onClick={() => setIsRegister(false)}>Log In</button></p>
          ) : (
            <p>Don't have an account? <button onClick={() => setIsRegister(true)}>Register</button></p>
          )}
        </div>
      </div>
    </div>
  )
}
