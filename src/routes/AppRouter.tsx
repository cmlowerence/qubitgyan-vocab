// src/routes/AppRouter.tsx

import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Public & Student Pages
import { Login } from '../pages/public/Login';
import { Dashboard as StudentDashboard } from '../pages/student/Dashboard';
import { Search as StudentSearch } from '../pages/student/Search';
import { StudentLayout } from '../components/layout/StudentLayout';

// Admin Pages
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { WordManager } from '../pages/admin/WordManager';
import { CategoryManager } from '../pages/admin/CategoryManager';
import { OverrideManager } from '../pages/admin/OverrideManager';

// Superadmin Pages
import { SuperadminDashboard } from '../pages/superadmin/SuperadminDashboard';
import { UserManager } from '../pages/superadmin/UserManager';

// Route Guards
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const auth = useContext(AuthContext);
  if (!auth) return null;
  if (auth.isLoading) return <div className="min-h-screen bg-background" />;
  if (!auth.isAuthenticated || !auth.user) return <Navigate to="/login" replace />;
  
  // Implicitly allow superadmin to view admin allowed routes
  const hasAccess = allowedRoles.includes(auth.user.role) || (allowedRoles.includes('admin') && auth.user.role === 'superadmin');
  
  if (!hasAccess) return <Navigate to="/unauthorized" replace />;
  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useContext(AuthContext);
  if (auth?.isLoading) return <div className="min-h-screen bg-background" />;
  if (auth?.isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const RootRedirect = () => {
  const auth = useContext(AuthContext);
  if (!auth || auth.isLoading) return null;
  if (!auth.isAuthenticated || !auth.user) return <Navigate to="/login" replace />;
  if (auth.user.role === 'student') return <Navigate to="/student" replace />;
  if (auth.user.role === 'admin') return <Navigate to="/admin" replace />;
  if (auth.user.role === 'superadmin') return <Navigate to="/superadmin" replace />;
  return <Navigate to="/unauthorized" replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You do not have permission to view this zone.</p>
            <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">Return to Login</button>
          </div>
        } />

        {/* Student Zone */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout><StudentDashboard /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/search" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout><StudentSearch /></StudentLayout></ProtectedRoute>} />

        {/* Admin Zone */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/words" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><WordManager /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><CategoryManager /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/overrides" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><OverrideManager /></AdminLayout></ProtectedRoute>} />

        {/* Superadmin Zone */}
        <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminLayout><SuperadminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/superadmin/users" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminLayout><UserManager /></AdminLayout></ProtectedRoute>} />

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
