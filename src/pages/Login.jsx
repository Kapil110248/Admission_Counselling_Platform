import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Lock, Mail, LogIn, Users, ShieldAlert, UserCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleLogin = (role) => {
    if (role === 'admin') navigate('/admin-dashboard');
    else if (role === 'counsellor') navigate('/counsellor-dashboard');
    else navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden bg-gradient-radial from-slate-50 to-indigo-50/30">
      {/* Abstract background graphics */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-200/20 rounded-full filter blur-3xl animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-indigo-200/20 rounded-full filter blur-3xl animate-float-slow"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-50 p-8 z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 items-center mb-4">
             <div className="bg-primary-600 p-2 rounded-2xl text-white shadow-soft">
                <GraduationCap className="h-8 w-8" />
             </div>
             <span className="font-bold text-2xl text-slate-900 border-none">Edu<span className="text-primary-600">Guide</span></span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">Please log in to continue to your dashboard triggers.</p>
        </div>

        <div className="space-y-4">
          <div>
             <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
             <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email address..." 
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 shadow-sm" 
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
             <div className="relative">
                <input 
                  type="password" 
                  placeholder="Enter your security password..." 
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 shadow-sm"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
             </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs font-semibold text-slate-500">
           <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" /> Remember Me</label>
           <button className="text-primary-600">Forgot Password?</button>
        </div>

        <div className="relative flex items-center justify-center my-6">
           <div className="w-full border-t border-slate-100"></div>
           <span className="bg-white px-3 text-xs text-slate-400 font-bold absolute">DEMO LOGINS (ONE CLICK)</span>
        </div>

        <div className="space-y-4 mt-6">
          <button 
            onClick={() => handleRoleLogin('student')}
            className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl shadow-soft text-sm flex items-center justify-center gap-2 hover:bg-primary-700 duration-200"
          >
            <LogIn className="h-4 w-4" /> Sign In
          </button>
          
          <button 
            onClick={() => handleRoleLogin('student')}
            className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-100 duration-200"
          >
             Login as Student demo
          </button>
        </div>

        <div className="text-center mt-6 text-xs text-slate-400 font-semibold">
           Dont have an account? <button className="text-primary-600 font-bold hover:underline">Register now</button>
        </div>
      </motion.div>
    </div>
  );
}
