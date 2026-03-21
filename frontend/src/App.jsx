import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import ExamDetails from './pages/ExamDetails';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CounsellorDashboard from './pages/CounsellorDashboard';
import Login from './pages/Login';

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
    <div className="min-h-screen bg-[#f8fbff] text-slate-900 font-sans">
      <AnimatePresence mode="wait">
        {isInitialLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      {!isInitialLoading && (
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/exam/:id" element={<ExamDetails />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
