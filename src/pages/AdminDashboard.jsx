import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard, Compass, Star, GraduationCap, Bell, Search,
  Menu, X, CheckSquare, Clock, ArrowRight, Settings, LogOut, ChevronRight, Award, Users, ShieldAlert, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { t: 'Total Students', v: '12,540', d: 'Increased by 12% from last month', i: Users, c: 'bg-primary-50 text-primary-600' },
    { t: 'Active Counselors', v: '184', d: 'Total active sessions: 45', i: GraduationCap, c: 'bg-green-50 text-green-600' },
    { t: 'Applications Pending', v: '1,204', d: 'Needs immediate review', i: Clock, c: 'bg-amber-50 text-amber-600' },
  ];

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Manage Users' },
    { id: 'exams', icon: BookOpen, label: 'Manage Exams' },
    { id: 'colleges', icon: Compass, label: 'Colleges List' },
    { id: 'cutoffs', icon: Award, label: 'Cutoff Data' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const chartData = [
    { name: 'Jan', students: 4000, income: 2400 },
    { name: 'Feb', students: 3000, income: 1398 },
    { name: 'Mar', students: 2000, income: 9800 },
    { name: 'Apr', students: 2780, income: 3908 },
    { name: 'May', students: 1890, income: 4800 },
    { name: 'Jun', students: 2390, income: 3800 },
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
                <span className="font-bold text-lg">Edu<span className="text-primary-600">Admin</span></span>
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
              <input type="text" placeholder="Search users, records..." className="bg-transparent border-0 focus:outline-none text-sm w-full" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-slate-50 p-2 rounded-xl text-slate-500 relative hover:bg-slate-100 duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white text-sm">AD</div>
              <div className="hidden md:block text-left">
                <p className="font-bold text-sm text-slate-800">Admin Panel</p>
                <p className="text-xs text-slate-500">Super Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 text-sm mt-0.5">Overview of system analytics and user management.</p>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-soft text-sm flex items-center gap-2 transition duration-300">
              <ArrowRight className="h-4 w-4" /> System Analytics
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

          {/* Charts Row layout */}
          <div className="card-premium bg-white">
            <h3 className="font-bold text-slate-800 mb-6">Aggregate match analytics</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="students" fill="#3d63ff" radius={[8, 8, 0, 0]} name="Students Rate (%)" />
                  <Bar dataKey="income" fill="#e0ebff" radius={[8, 8, 0, 0]} name="Value aggregate thresholds configurations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User management basic table layout view */}
          <div className="card-premium bg-white">
            <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
              <h3 className="font-bold text-slate-800">Assigned Verification Pending</h3>
              <button className="text-primary-600 font-semibold text-xs flex items-center gap-1">View All <ChevronRight className="h-3 w-3" /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left font-semibold text-slate-400 py-3">User</th>
                    <th className="text-left font-semibold text-slate-400 py-3">Applied For</th>
                    <th className="text-left font-semibold text-slate-400 py-3">Type</th>
                    <th className="text-left font-semibold text-slate-400 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { n: 'Rahul Varma', e: 'rahul@example.com', a: 'JEE Main (IIT Bombay)', t: 'Student', s: 'Pending' },
                    { n: 'Deepa Gupta', e: 'deepa@example.com', a: 'NEET (AIIMS Delhi)', t: 'Student', s: 'Verified' },
                  ].map((u, i) => (
                    <tr className="hover:bg-slate-50 duration-150" key={i}>
                      <td className="py-4">
                        <div>
                          <p className="font-bold text-slate-800">{u.n}</p>
                          <p className="text-xs text-slate-500">{u.e}</p>
                        </div>
                      </td>
                      <td className="py-4 text-slate-600 font-medium">{u.a}</td>
                      <td className="py-4 text-slate-600 font-medium">{u.t}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.s === 'Verified' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{u.s}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
