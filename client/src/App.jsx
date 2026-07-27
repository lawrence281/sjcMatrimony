import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'
import Home from './pages/Home'
import BrowseMembers from './pages/BrowseMembers'
import MemberDetail from './pages/MemberDetail'
import Login from './pages/Login'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import PartnerPreference from './pages/PartnerPreference'
import Gallery from './pages/Gallery'
import Documents from './pages/Documents'
import SafetyRules from './pages/SafetyRules'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import './index.css'
import { LanguageProvider } from './context/LanguageContext'

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTopOnRouteChange />
          <PageLoader />
          <Toaster 
            position="top-center" 
            containerStyle={{ top: 72 }}
            toastOptions={{ 
              duration: 4000,
              style: { 
                fontSize: '14px', 
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600',
                borderRadius: '12px',
                padding: '12px 24px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                maxWidth: '500px',
              },
              success: {
                style: { background: '#059669', color: 'white' },
                iconTheme: { primary: 'white', secondary: '#059669' }
              },
              error: {
                style: { background: '#dc2626', color: 'white' },
                iconTheme: { primary: 'white', secondary: '#dc2626' }
              }
            }} 
          />
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<BrowseMembers />} />
              <Route path="/members/:id" element={<MemberDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/safety" element={<PrivacyPolicy />} />
              <Route path="/about" element={<PrivacyPolicy />} />
              <Route path="/subscription" element={<Home scrollToSubscription />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/profile/preferences" element={<ProtectedRoute><PartnerPreference /></ProtectedRoute>} />
              <Route path="/profile/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
              <Route path="/profile/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}


