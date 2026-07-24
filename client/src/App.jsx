import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import PageLoader from './components/PageLoader'
import Home from './pages/Home'
import Products from './pages/Products'
import ComboPack from './pages/ComboPack'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import PartnerPreference from './pages/PartnerPreference'
import Gallery from './pages/Gallery'
import Documents from './pages/Documents'
import Wishlist from './pages/Wishlist'
import SafetyRules from './pages/SafetyRules'
import Contact from './pages/Contact'
import './index.css'
import { LanguageProvider } from './context/LanguageContext'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
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
                <Route path="/products" element={<Products />} />
                <Route path="/combos" element={<ComboPack />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/safety" element={<SafetyRules />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="/profile/preferences" element={<ProtectedRoute><PartnerPreference /></ProtectedRoute>} />
                <Route path="/profile/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
                <Route path="/profile/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <ScrollToTop />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
