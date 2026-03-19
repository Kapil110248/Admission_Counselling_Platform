import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  LayoutDashboard, Compass, Star, GraduationCap, Bell, Search, 
  Menu, X, CheckSquare, Clock, ArrowRight, Settings, LogOut, ChevronRight, Award, Users, ShieldAlert, BookOpen, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CounsellorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { t: 'Assigned Students', v: '45', d: 'Increased by 5 from last week', i: Users, c: 'bg-primary-50 text-primary-600' },
    { t: 'Sessions Scheduled', v: '12', d: 'Today sessions: 4', i: Clock, c: 'bg-green-50 text-green-600' },
    { t: 'Query Support Requests', v: '8', d: 'Needs immediate review response', i: MessageSquare, c: 'bg-amber-50 text-amber-600' },
  ];

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'My Students' },
    { id: 'sessions', icon: Clock, label: 'Sessions' },
    { id: 'chat', icon: MessageSquare, label: 'Support Chat' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const studentsList = [
    { n: 'Amit Kumar', e: 'amit@example.com', m: 'JEE Main (IIT Delhi)', s: 'Today 2:00 PM', status: 'Scheduled' },
    { n: 'Sneha Roy', e: 'sneha@example.com', m: 'NEET (AIIMS Bhopal)', s: 'Tomorrow 11:00 AM', status: 'Scheduled' },
    { n: 'Rohan Sharma', e: 'rohan@example.com', m: 'CUET (DU)', s: 'Completed', status: 'Completed' },
  ];

  return (
    <div className="flex h-screen bg-[#f3f6fc] overflow-hidden">
      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-white border-r border-slate-100 flex flex-col z-20 shadow-xl md:shadow-none"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-7 w-7 text-primary-600" />
                <span className="font-bold text-lg">Edu<span className="text-primary-600">Counsel</span></span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500"><X className="h-5 w-5" /></button>
            </div>

            <nav className="p-4 flex-1 space-y-1">
              {sidebarItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === item.id ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                 </button>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-50 space-y-1">
              <Link to="/login" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50"><LogOut className="h-5 w-5" /> Logout</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><Menu className="h-5 w-5" /></button>
            )}
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 gap-2 w-72">
              <Search className="h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search assigned students..." className="bg-transparent border-0 focus:outline-none text-sm w-full" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-slate-50 p-2 rounded-xl text-slate-500 relative hover:bg-slate-100 duration-200">
               <Bell className="h-5 w-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-100"
              />
              <div className="hidden md:block text-left">
                <p className="font-bold text-sm text-slate-800">Neha Gupta</p>
                <p className="text-xs text-slate-500">Counsellor Profile</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Counsellor Dashboard</h1>
              <p className="text-slate-500 text-sm mt-0.5">Overview of assigned students and upcoming sessions analytics dashboard metrics.</p>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-soft text-sm flex items-center gap-2 transition duration-300">
              <ArrowRight className="h-4 w-4" /> Schedule Session
            </button>
          </div>

          {/* Stats Cards Grid layout */}
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((m, i) => (
              <div className="card-premium flex items-center justify-between bg-white" key={i}>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{m.t}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{m.v}</p>
                  <p className="text-xs text-slate-400 mt-1">{m.d}</p>
                </div>
                <div className={`p-3.5 rounded-2xl ${m.c} flex items-center justify-center`}>
                  <m.i className="h-6 w-6" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             {/* Assigned Students List */}
             <div className="card-premium bg-white">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                   <h3 className="font-bold text-slate-800">Assigned Verification Pending</h3>
                   <button className="text-primary-600 font-semibold text-xs flex items-center gap-1">View All <ChevronRight className="h-3 w-3" /></button>
                </div>
                <div className="space-y-4">
                   {studentsList.map((u, i) => (
                      <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 duration-150 flex items-center justify-between" key={i}>
                         <div>
                            <p className="font-bold text-slate-800 text-sm">{u.n}</p>
                            <p className="text-xs text-slate-500">{u.m}</p>
                         </div>
                         <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-primary-50 text-primary-600'}`}>{u.s}</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Live Session Calendar/Support quick view trigger framing layouts sets */}
             <div className="card-premium bg-white">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                   <h3 className="font-bold text-slate-800">Upcoming Live Counselling Updates</h3>
                </div>
                <div className="flex flex-col items-center justify-center text-center py-12">
                   <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-4">
                      <Clock className="h-8 w-8" />
                   </div>
                   <h4 className="font-bold text-slate-800 text-sm">No Live Session At This Moment</h4>
                   <p className="text-xs text-slate-400 mt-1 max-w-xs">Loads schedule filters parameters dashboards metric updates framing configurations properly framing thresholds configurations setups.</p>
                </div>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
}
