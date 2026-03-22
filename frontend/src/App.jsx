import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import ExamDetails from './pages/ExamDetails';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CounsellorDashboard from './pages/CounsellorDashboard';
import Login from './pages/Login';
import { ToastProvider } from './context/ToastContext';

// Protected Route Wrapper for Authenticated Users (Redirects away from public pages)
const RedirectIfAuth = ({ children }) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'Student') return <Navigate to="/student-dashboard" replace />;
      if (user.role === 'Counsellor') return <Navigate to="/counsellor-dashboard" replace />;
      if (user.role === 'Admin') return <Navigate to="/admin-dashboard" replace />;
    } catch (e) {
      // Ignore parsing error, proceed as unauthenticated
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
  return children;
};

// Protected Route Wrapper for Unauthenticated Users (Redirects away from private pages)
const RequireAuth = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" replace />;
  try {
    const user = JSON.parse(userStr);
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Show preloader for at least 2 seconds for aesthetic impact
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f8fbff] text-slate-900 font-sans">
        <AnimatePresence mode="wait">
          {isInitialLoading && <Preloader key="preloader" />}
        </AnimatePresence>

        {!isInitialLoading && (
          <Routes location={location} key={location.pathname}>
            {/* Public Routes - Auto Redirect if Logged In */}
            <Route path="/" element={<RedirectIfAuth><Home /></RedirectIfAuth>} />
            <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
            <Route path="/exam/:id" element={<ExamDetails />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/student-dashboard" element={<RequireAuth allowedRoles={['Student']}><StudentDashboard /></RequireAuth>} />
            <Route path="/admin-dashboard" element={<RequireAuth allowedRoles={['Admin']}><AdminDashboard /></RequireAuth>} />
            <Route path="/counsellor-dashboard" element={<RequireAuth allowedRoles={['Counsellor']}><CounsellorDashboard /></RequireAuth>} />
          </Routes>
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
