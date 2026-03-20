import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Lock, Mail, Users, ShieldAlert, UserCheck, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleLogin = async () => {
    try {
      if (!isLogin) {
        if (!name || !email || !password) { alert('Please fill all fields for registration'); return; }
        const res = await authApi.register({ name, email, password });
        localStorage.setItem('token', res.data.token);
        if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
        alert('Account Created Successfully!');
        navigate('/student-dashboard');
        return;
      }

      const res = await authApi.login({ email, password });
      localStorage.setItem('token', res.data.token);
      if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
      
      const role = res.data.user.role; // e.g., 'Admin', 'Counsellor', 'Student'
      if (role === 'Admin') navigate('/admin-dashboard');
      else if (role === 'Counsellor') navigate('/counsellor-dashboard');
      else navigate('/student-dashboard');
      
    } catch (error) {
      alert(error.response?.data?.error || 'Authentication logic failed setups threshold configurations.');
    }
  };

  const handleDemoClick = (role) => {
    if (role === 'admin') {
      setEmail('admin@eduguide.com');
      setPassword('admin123');
    } else if (role === 'counsellor') {
      setEmail('counsellor@eduguide.com');
      setPassword('counsellor123');
    } else {
      setEmail('student@eduguide.com');
      setPassword('student123');
    }
  };

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-300/30 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-300/20 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 border border-white/50 relative">
        
        {/* Left Side: Branding/Image */}
        <div className="w-full md:w-5/12 bg-primary-600 p-10 flex flex-col justify-between text-white relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-primary-600/40"></div>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-10 flex items-center gap-2"
          >
             <div className="bg-white/20 backdrop-blur-md p-2 rounded-2xl text-white shadow-soft border border-white/20">
                <GraduationCap className="h-8 w-8" />
             </div>
             <span className="font-bold text-3xl tracking-tight">Edu<span className="text-primary-200">Guide</span></span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative z-10 mt-20"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-primary-100 text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4 text-yellow-300" /> AI-Powered Platform
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Your gateway to the perfect college.</h2>
            <p className="text-primary-100/90 text-sm leading-relaxed max-w-sm">
              Join thousands of students and counsellors making data-driven decisions for securing the best medical and engineering seats.
            </p>
            
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" className="w-10 h-10 rounded-full border-2 border-primary-600" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User" className="w-10 h-10 rounded-full border-2 border-primary-600" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User" className="w-10 h-10 rounded-full border-2 border-primary-600" />
              </div>
              <p className="text-xs font-medium text-primary-200">Trusted by <br/><strong className="text-white text-sm">10,000+</strong> users</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white"
        >
          <motion.div variants={itemVariants} className="text-center md:text-left mb-8 md:hidden">
            <div className="flex justify-center gap-2 items-center mb-4">
               <div className="bg-primary-600 p-2 rounded-2xl text-white shadow-soft">
                  <GraduationCap className="h-8 w-8" />
               </div>
               <span className="font-bold text-2xl text-slate-900 border-none">Edu<span className="text-primary-600">Guide</span></span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
               {isLogin ? 'Welcome Back 👋' : 'Create an Account 🚀'}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
               {isLogin ? 'Please log in to your account to continue.' : 'Join us to explore exact college predictions.'}
            </p>
          </motion.div>

          <div className="space-y-4 mt-8">
            {!isLogin && (
               <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Full Name</label>
                  <div className="relative group">
                     <input 
                       type="text" 
                       placeholder="Enter your full name..." 
                       className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-white font-medium text-slate-700 shadow-sm transition-all" 
                       value={name}
                       onChange={(e)=>setName(e.target.value)}
                     />
                     <Users className="absolute left-4 top-4 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
               </motion.div>
            )}

            <motion.div variants={itemVariants}>
               <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
               <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="Enter your email address..." 
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-white font-medium text-slate-700 shadow-sm transition-all" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
               </div>
            </motion.div>

            <motion.div variants={itemVariants}>
               <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                 <label className="block text-xs font-bold text-slate-700">Password</label>
                 {isLogin && <button className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">Forgot?</button>}
               </div>
               <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your security password..." 
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-white font-medium text-slate-700 shadow-sm transition-all"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                  <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer duration-150">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
               </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-8">
            <motion.button 
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRoleLogin}
              className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-500/30 text-sm flex items-center justify-center gap-2 hover:bg-primary-700 transition-all"
            >
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="relative flex items-center justify-center my-8">
             <div className="w-full border-t border-slate-200"></div>
             <span className="bg-white px-4 text-[10px] text-slate-400 font-bold absolute tracking-widest uppercase">Or Demo Autofill</span>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 flex-wrap">
            <motion.button 
              whileHover={{ y: -2, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDemoClick('admin')}
              className="flex flex-col items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 rounded-2xl text-xs hover:bg-slate-100 hover:border-slate-300 hover:shadow-md transition-all"
            >
               <ShieldAlert className="h-5 w-5 text-slate-500" /> <span className="hidden sm:inline">Admin</span>
            </motion.button>
            
            <motion.button 
              whileHover={{ y: -2, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDemoClick('counsellor')}
              className="flex flex-col items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 rounded-2xl text-xs hover:bg-slate-100 hover:border-slate-300 hover:shadow-md transition-all"
            >
               <Users className="h-5 w-5 text-slate-500" /> <span className="hidden sm:inline">Counsellor</span>
            </motion.button>

            <motion.button 
              whileHover={{ y: -2, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDemoClick('student')}
              className="flex flex-col items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 rounded-2xl text-xs hover:bg-slate-100 hover:border-slate-300 hover:shadow-md transition-all"
            >
               <UserCheck className="h-5 w-5 text-slate-500" /> <span className="hidden sm:inline">Student</span>
            </motion.button>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-center mt-10 text-xs text-slate-500 font-medium">
             {isLogin ? "Don't have an account?" : "Already have an account?"} <button onClick={() => setIsLogin(!isLogin)} className="text-primary-600 font-bold hover:underline">{isLogin ? 'Register now' : 'Sign in'}</button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
