import { lazy, Suspense, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

// Context Providers
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { SocketProvider } from '@/context/SocketContext';
import { ToastProvider } from '@/context/ToastContext';

// Route Guards
import ProtectedRoute from '@/routes/ProtectedRoute';
import PublicRoute from '@/routes/PublicRoute';
import AdminRoute from '@/routes/AdminRoute';
import ClientRoute from '@/routes/ClientRoute';

// Layouts
import AuthLayout from '@/components/layouts/AuthLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
import ClientLayout from '@/components/layouts/ClientLayout';

// Lazy-loaded pages for code splitting
const Home         = lazy(() => import('@/pages/public/Home'));
const Login        = lazy(() => import('@/pages/auth/Login'));
const Register     = lazy(() => import('@/pages/auth/Register'));
const VerifyOtp    = lazy(() => import('@/pages/auth/VerifyOtp'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword  = lazy(() => import('@/pages/auth/ResetPassword'));

const AdminDashboard  = lazy(() => import('@/pages/admin/Dashboard'));
const ClientDashboard = lazy(() => import('@/pages/client/Dashboard'));

const MyProfile       = lazy(() => import('@/pages/client/MyProfile'));
const EditProfile     = lazy(() => import('@/pages/client/EditProfile'));
const ViewProfile     = lazy(() => import('@/pages/client/ViewProfile'));
const Search          = lazy(() => import('@/pages/client/Search'));
const Shortlist       = lazy(() => import('@/pages/client/Shortlist'));
const Interests       = lazy(() => import('@/pages/client/Interests'));
const Chat            = lazy(() => import('@/pages/client/Chat'));
const Plans           = lazy(() => import('@/pages/client/Plans'));

const AdminProfiles       = lazy(() => import('@/pages/admin/Profiles'));
const AdminUsers          = lazy(() => import('@/pages/admin/Users'));
const AdminSubscriptions  = lazy(() => import('@/pages/admin/Subscriptions'));
const AdminPayments       = lazy(() => import('@/pages/admin/Payments'));
const AdminReports        = lazy(() => import('@/pages/admin/Reports'));
const AdminSettings       = lazy(() => import('@/pages/admin/Settings'));
const AdminClientProfiles = lazy(() => import('@/pages/admin/ClientProfiles'));

const NotFound    = lazy(() => import('@/pages/errors/NotFound'));
const Unauthorized = lazy(() => import('@/pages/errors/Unauthorized'));

import Loader from '@/components/common/Loader/Loader';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <SocketProvider>
            <ToastProvider>
              <BrowserRouter>
                <Suspense fallback={<Loader fullScreen />}>
                  <Routes>
                    {/* ── Public Auth Routes ────────────────────────── */}
                    <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
                      <Route path={ROUTES.LOGIN}           element={<Login />} />
                      <Route path={ROUTES.REGISTER}        element={<Register />} />
                      <Route path={ROUTES.VERIFY_OTP}      element={<VerifyOtp />} />
                      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                      <Route path={ROUTES.RESET_PASSWORD}  element={<ResetPassword />} />
                    </Route>

                    {/* ── Admin Routes ──────────────────────────────── */}
                    <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                      <Route path={ROUTES.ADMIN.DASHBOARD}        element={<AdminDashboard />} />
                      <Route path={ROUTES.ADMIN.PROFILES}          element={<AdminProfiles />} />
                      <Route path={ROUTES.ADMIN.CLIENT_PROFILES}   element={<AdminClientProfiles />} />
                      <Route path={ROUTES.ADMIN.USERS}             element={<AdminUsers />} />
                      <Route path={ROUTES.ADMIN.ADMINS}            element={<AdminUsers />} />
                      <Route path={ROUTES.ADMIN.SUBSCRIPTIONS}     element={<AdminSubscriptions />} />
                      <Route path={ROUTES.ADMIN.PAYMENTS}          element={<AdminPayments />} />
                      <Route path={ROUTES.ADMIN.REPORTS}           element={<AdminReports />} />
                      <Route path={ROUTES.ADMIN.SETTINGS}          element={<AdminSettings />} />
                    </Route>

                    {/* ── Client Routes ─────────────────────────────── */}
                    <Route element={<ClientRoute><ClientLayout /></ClientRoute>}>
                      <Route path={ROUTES.CLIENT.DASHBOARD} element={<ClientDashboard />} />
                      <Route path={ROUTES.CLIENT.MY_PROFILE} element={<MyProfile />} />
                      <Route path={ROUTES.CLIENT.EDIT_PROFILE} element={<EditProfile />} />
                      <Route path={ROUTES.CLIENT.VIEW_PROFILE} element={<ViewProfile />} />
                      <Route path={ROUTES.CLIENT.SEARCH} element={<Search />} />
                      <Route path={ROUTES.CLIENT.SHORTLIST} element={<Shortlist />} />
                      <Route path={ROUTES.CLIENT.INTERESTS} element={<Interests />} />
                      <Route path={ROUTES.CLIENT.CHAT} element={<Chat />} />
                      <Route path={ROUTES.CLIENT.PLANS} element={<Plans />} />
                    </Route>

                    {/* ── Error Pages ───────────────────────────────── */}
                    <Route path={ROUTES.NOT_FOUND}    element={<NotFound />} />
                    <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

                    {/* ── Default Redirect ──────────────────────────── */}
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </ToastProvider>
          </SocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
