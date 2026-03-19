import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ExamDetails from './pages/ExamDetails';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CounsellorDashboard from './pages/CounsellorDashboard';
import Login from './pages/Login';

function App() {
  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-900 font-sans">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/exam/:id" element={<ExamDetails />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
