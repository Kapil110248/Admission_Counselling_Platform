import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard, Compass, Star, GraduationCap, Bell, Search,
  Menu, X, CheckSquare, Clock, ArrowRight, Settings, LogOut, ChevronRight, Award, Users, ShieldAlert, BookOpen, Check, Edit3, Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi, examApi, collegeApi, authApi, scholarshipApi, packageApi, notificationApi } from '../api';
import { useToast } from '../context/ToastContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { showAlert } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(localStorage.getItem('adminActiveTab') || 'overview');
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const u = JSON.parse(userStr);
      const res = await notificationApi.getAll(u.id);
      setNotificationsList(res.data);
    } catch (e) { console.error(e); }
  };

  const handleMarkAllRead = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const u = JSON.parse(userStr);
      await notificationApi.markAllRead(u.id);
      fetchNotifications();
    } catch (e) { console.error(e); }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      fetchNotifications();
    } catch (e) { console.error(e); }
  };

  // Custom Alert Mode settings setups thresholds configuration
  const [customAlert, setCustomAlert] = useState({ isOpen: false, t: 'Success', m: '', tp: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, t: 'Delete', m: '', onConfirm: null });

  // Users State Logic for Manage Users Dashboard
  const [usersList, setUsersList] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentUserEdit, setCurrentUserEdit] = useState(null);
  const [userFormData, setUserFormData] = useState({ n: '', e: '', r: 'Student', v: false, p: '', ph: '', spec: '' });
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  // Exams State Logic for Manage Exams Dashboard
  const [examsList, setExamsList] = useState([]);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [currentExamEdit, setCurrentExamEdit] = useState(null);
  const [examFormData, setExamFormData] = useState({ name: '', date: '', applicants: '', board: 'NTA', stream: 'Engineering', url: '', title: '', collegeCount: '', colorClass: 'bg-blue-50 text-blue-600 border-blue-100/50' });

  // Colleges State Logic for List Dashboard
  const [collegesList, setCollegesList] = useState([]);
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
  const [currentCollegeEdit, setCurrentCollegeEdit] = useState(null);
  const [collegeFormData, setCollegeFormData] = useState({ n: '', l: '', r: '', f: '', p: '', u: '' });

  const [statsData, setStatsData] = useState({ students: 0, counsellors: 0, pendingVerify: 0 });

  const fetchUsers = async () => { try { const res = await userApi.getAll(); setUsersList(res.data); } catch (e) { console.error(e); } };
  const fetchExams = async () => { try { const res = await examApi.getAll(); setExamsList(res.data); } catch (e) { console.error(e); } };
  const fetchColleges = async () => { try { const res = await collegeApi.getAll(); setCollegesList(res.data); } catch (e) { console.error(e); } };
  const [cutoffsList, setCutoffsList] = useState([]);
  const fetchCutoffs = async () => { try { const res = await collegeApi.getCutoffs(); setCutoffsList(res.data); } catch (e) { console.error(e); } };

  const [isCutoffModalOpen, setIsCutoffModalOpen] = useState(false);
  const [cutoffFormData, setCutoffFormData] = useState({ collegeId: '', examId: '', branch: '', category: 'General', closingRank: '', round: '1', quota: 'All India', year: '2025' });

  // Scholarship State Logic
  const [scholarshipsList, setScholarshipsList] = useState([]);
  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [currentScholarshipEdit, setCurrentScholarshipEdit] = useState(null);
  const [scholarshipFormData, setScholarshipFormData] = useState({ name: '', description: '', amount: '', eligibility: '', officialUrl: '' });
  // Package State for admin package triggers configs
  const [packagesList, setPackagesList] = useState([]);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [currentPackageEdit, setCurrentPackageEdit] = useState(null);
  const [packageFormData, setPackageFormData] = useState({ name: '', price: '', benefits: '', actionText: '', isFeatured: false });

  const [adminProfile, setAdminProfile] = useState({ name: '', email: '', phone: '', role: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const fetchScholarships = async () => { try { const res = await scholarshipApi.getAll(); setScholarshipsList(res.data); } catch (e) { console.error(e); } };
  const fetchPackages = async () => { try { const res = await packageApi.getAll(); setPackagesList(res.data); } catch (e) { console.error(e); } };

  const fetchAdminProfile = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const u = JSON.parse(userStr);
      const res = await userApi.getProfile(u.id);
      setAdminProfile(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchStats = async () => { try { const res = await userApi.getStats(); console.log('STATS_API_SUCCESS:', res.data); setStatsData(res.data); } catch (e) { console.error('STATS_API_ERR:', e); } };

  useEffect(() => {
    const init = async () => {
      await fetchStats();
      await fetchAdminProfile();
      setPageLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'exams') fetchExams();
    if (activeTab === 'colleges') fetchColleges();
    if (activeTab === 'cutoffs') fetchCutoffs();
    if (activeTab === 'scholarships') fetchScholarships();
    if (activeTab === 'packages') fetchPackages();



    if (activeTab === 'settings') fetchAdminProfile();
    if (activeTab === 'overview') { fetchStats(); fetchUsers(); fetchExams(); fetchColleges(); fetchCutoffs(); fetchScholarships(); }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setIsNotificationsOpen(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile after click
    setActiveTab(tab);
    localStorage.setItem('adminActiveTab', tab);
    setTimeout(() => setIsLoading(false), 600);
  };

  const stats = [
    { t: 'Total Students', v: statsData.students, d: 'Total from database', i: Users, c: 'bg-primary-50 text-primary-600' },
    { t: 'Active Counselors', v: statsData.councellors, d: 'Total registered counts', i: GraduationCap, c: 'bg-green-50 text-green-600' },
    { t: 'Unverified Accounts', v: statsData.pendingVerify, d: 'Needs verification setups', i: Clock, c: 'bg-amber-50 text-amber-600' },
  ];

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Manage Users' },
    { id: 'exams', icon: BookOpen, label: 'Manage Exams' },
    { id: 'colleges', icon: Compass, label: 'Colleges List' },
    { id: 'cutoffs', icon: Award, label: 'Cutoff Data' },
    { id: 'scholarships', icon: GraduationCap, label: 'Scholarships' },
    { id: 'packages', icon: Award, label: 'Packages' },
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

  if (pageLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[99999] flex flex-col items-center justify-center space-y-4">
        <motion.div animate={{ scale: [0.9, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="p-4 rounded-3xl bg-gradient-to-br from-primary-600 to-indigo-600 shadow-glow">
          <GraduationCap className="h-10 w-10 text-white" />
        </motion.div>
        <p className="text-white font-black text-sm tracking-widest animate-pulse uppercase">Initializing EduAdmin...</p>
        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden relative"><motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="absolute inset-y-0 w-12 bg-gradient-to-r from-primary-400 to-cyan-400" /></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f3f6fc] overflow-hidden">
      {/* Sidebar Navigation - Fixed Drawer for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden"
            />

            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed md:relative h-full bg-white border-r border-slate-100 flex flex-col z-[101] md:z-20 shadow-2xl md:shadow-none w-[280px]"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-7 w-7 text-primary-600" />
                  <span className="font-bold text-lg">Edu<span className="text-primary-600">Admin</span></span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500 hover:bg-slate-50 p-1 rounded-lg"><X className="h-5 w-5" /></button>
              </div>

              <nav className="p-4 flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === item.id ? 'bg-primary-50 text-primary-600 border border-primary-100/50 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-primary-600' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-slate-50 space-y-1">
                <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 group transition-colors">
                  <LogOut className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-[50]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className={`text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-colors md:${isSidebarOpen ? 'hidden' : 'block'}`}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 gap-2 w-72">
              <Search className="h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search users, records..." className="bg-transparent border-0 focus:outline-none text-sm w-full font-medium" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="bg-slate-50 p-2 rounded-xl text-slate-500 relative hover:bg-slate-100 duration-200"
              >
                <Bell className="h-5 w-5" />
                {notificationsList.some(n => !n.isRead) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 p-4 space-y-2 max-h-96 overflow-y-auto"
                >
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                    {notificationsList.some(n => !n.isRead) && (
                      <span onClick={handleMarkAllRead} className="text-xs text-primary-600 font-semibold cursor-pointer hover:underline">Mark all</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {notificationsList.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No new notifications.</p>
                    ) : (
                      notificationsList.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => !n.isRead && handleMarkRead(n.id)}
                          className={`p-2.5 border border-slate-50 rounded-xl transition duration-150 ${n.isRead ? 'opacity-60 bg-white' : 'bg-slate-50 hover:bg-slate-100 cursor-pointer shadow-soft'}`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-slate-800 text-xs">{n.title}</p>
                            {!n.isRead && <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1"></span>}
                          </div>
                          <p className={`text-[10px] mt-0.5 ${n.isRead ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <div onClick={() => handleTabChange('settings')} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-xl duration-200">
              <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white text-sm">AD</div>
              <div className="hidden md:block text-left">
                <p className="font-bold text-sm text-slate-800">Admin Panel</p>
                <p className="text-xs text-slate-500">Super Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-soft"
            >
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.15, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-16 h-16 rounded-full bg-primary-200"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-[3px] border-slate-200 border-t-primary-600 rounded-full"
                />
              </div>
              <p className="font-bold text-slate-700 text-sm mt-4 tracking-wide animate-pulse">Loading {activeTab.replace('-', ' ')}...</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
              {activeTab === 'overview' && (
                <>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                      <p className="text-slate-500 text-sm mt-0.5">Overview of system analytics and user management.</p>
                    </div>
                    <button
                      onClick={() => setIsAnalyticsModalOpen(true)}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-soft text-sm flex items-center gap-2 transition duration-300 cursor-pointer"
                    >
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
                    <div className="overflow-x-auto custom-scrollbar shadow-inner rounded-xl border border-slate-100">
                      <table className="w-full text-sm min-w-[600px]">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">User</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Applied For</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Type</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {usersList.filter(u => !u.isVerified && u.role === 'Student').slice(0, 3).map((u, i) => (
                            <tr className="hover:bg-slate-50 duration-150" key={i}>
                              <td className="py-4 px-4 whitespace-nowrap"><div><p className="font-bold text-slate-800 text-xs">{u.name}</p><p className="text-[10px] text-slate-500">{u.email}</p></div></td>
                              <td className="py-4 px-4 text-slate-600 font-medium text-xs whitespace-nowrap">N/A</td>
                              <td className="py-4 px-4 text-slate-600 font-medium text-xs whitespace-nowrap">{u.role}</td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600">Pending</span></td>
                            </tr>
                          ))}
                          {usersList.filter(u => !u.isVerified && u.role === 'Student').length === 0 && (
                            <tr><td colSpan="4" className="py-6 text-center text-slate-400 text-xs">No pending approvals found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {isAnalyticsModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
                        <h3 className="font-bold text-lg text-slate-800">System Analytics Overview</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                            <p className="text-xs text-primary-700 font-bold">Network Health</p>
                            <p className="font-extrabold text-2xl text-primary-900 mt-1">99.98%</p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                            <p className="text-xs text-green-700 font-bold">Realtime Load</p>
                            <p className="font-extrabold text-2xl text-green-900 mt-1">Light</p>
                          </div>
                          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <p className="text-xs text-amber-700 font-bold">Queries / Min</p>
                            <p className="font-extrabold text-2xl text-amber-900 mt-1">1,412</p>
                          </div>
                          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <p className="text-xs text-indigo-700 font-bold">Active Traffic</p>
                            <p className="font-extrabold text-2xl text-indigo-900 mt-1">204 Users</p>
                          </div>
                        </div>
                        <button onClick={() => setIsAnalyticsModalOpen(false)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-3 rounded-xl text-xs w-full mt-4 duration-150">Close Dashboard</button>
                      </motion.div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
                      <p className="text-slate-500 text-sm mt-0.5">Approve, Edit, and monitor user profiles.</p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentUserEdit(null);
                        setUserFormData({ n: '', e: '', r: 'Student', v: false, p: '', ph: '', spec: '' });
                        setIsUserModalOpen(true);
                      }}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer duration-200"
                    >
                      <Users className="h-4 w-4" /> Add New User
                    </button>
                  </div>
                  <div className="card-premium bg-white p-0 overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-sm min-w-[800px]">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">User</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Email Address</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Phone</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Role</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Verification</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {usersList.map((u, i) => (
                            <tr className="hover:bg-slate-50 duration-150" key={i}>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm shadow-soft">
                                    {u.name ? u.name[0].toUpperCase() : 'U'}
                                  </div>
                                  <p className="font-bold text-slate-800">{u.name}</p>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">{u.email}</td>
                              <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap font-mono">{u.phone || '98765-43210'}</td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ring-1 ring-inset ${u.role === 'Admin' ? 'bg-purple-50 text-purple-700 ring-purple-100' : u.role === 'Counsellor' ? 'bg-indigo-50 text-indigo-700 ring-indigo-100' : 'bg-blue-50 text-blue-700 ring-blue-100'}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold leading-none ${u.isVerified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${u.isVerified ? 'bg-green-600 animate-pulse' : 'bg-amber-500'}`}></div>
                                  {u.isVerified ? 'Verified' : 'Pending'}
                                </span>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {!u.isVerified && (
                                    <button
                                      onClick={() => {
                                        setConfirmDialog({
                                          isOpen: true, t: 'Verify Profile', m: `Do you want to verify and approve ${u.name}?`,
                                          onConfirm: async () => { try { await userApi.update(u.id, { isVerified: true }); fetchUsers(); } catch (err) { console.error('Verify failed:', err); } }
                                        });
                                      }}
                                      className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-xl border border-green-100 duration-150 cursor-pointer shadow-soft group"
                                      title="Verify Profile"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setCurrentUserEdit(u);
                                      setUserFormData({ n: u.name, e: u.email, r: u.role, v: u.isVerified, p: '********', ph: u.phone || '9876543210', spec: u.specialized || 'General' });
                                      setIsUserModalOpen(true);
                                    }}
                                    className="bg-primary-50 hover:bg-primary-100 text-primary-600 p-2 rounded-xl border border-primary-100 duration-150 cursor-pointer shadow-soft"
                                    title="Edit Profile"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      setConfirmDialog({ isOpen: true, t: 'Delete Profile', m: `Are you sure you want to permanently remove ${u.name}?`, onConfirm: async () => { try { await userApi.delete(u.id); fetchUsers(); } catch (e) { console.error(e); } } }); if (false) {
                                        try {
                                          await userApi.delete(u.id);
                                          fetchUsers();
                                        } catch (e) { showAlert('Delete failed setups threshold configs.'); }
                                      }
                                    }}
                                    className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-xl border border-red-100 duration-150 cursor-pointer shadow-soft"
                                    title="Delete Profile"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add / Edit User Modal Dialog Overlay triggers setup layouts accurately sets */}
                  {isUserModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-5">
                        <h3 className="font-bold text-lg text-slate-800 border-b border-slate-50 pb-3">{currentUserEdit ? 'Edit User Details' : 'Add New User Details'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Full Name</label>
                            <input type="text" value={userFormData.n} onChange={e => setUserFormData({ ...userFormData, n: e.target.value })} placeholder="John Doe" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Email Address</label>
                            <input type="email" value={userFormData.e} onChange={e => setUserFormData({ ...userFormData, e: e.target.value })} placeholder="john@example.com" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Role</label>
                            <select value={userFormData.r} onChange={e => setUserFormData({ ...userFormData, r: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium">
                              <option value="Student">Student</option>
                              <option value="Counsellor">Counsellor</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Verification</label>
                            <select value={userFormData.v ? "true" : "false"} onChange={e => setUserFormData({ ...userFormData, v: e.target.value === "true" })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium">
                              <option value="true">Verified</option>
                              <option value="false">Pending</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                            <input type="text" value={userFormData.ph} onChange={e => setUserFormData({ ...userFormData, ph: e.target.value })} placeholder="+91 98765-43210" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          {!currentUserEdit && (
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Temporary Password</label>
                              <input type="password" value={userFormData.p} onChange={e => setUserFormData({ ...userFormData, p: e.target.value })} placeholder="Set unique password" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                            </div>
                          )}
                          {userFormData.r === 'Counsellor' && (
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Counseling Specialization</label>
                              <select value={userFormData.spec} onChange={e => setUserFormData({ ...userFormData, spec: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium">
                                <option value="Medical">Medical (NEET)</option>
                                <option value="Engineering">Engineering (JEE)</option>
                                <option value="General">Commerce (CUET)</option>
                              </select>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 justify-end mt-6 pt-3 border-t border-slate-100">
                          <button onClick={() => setIsUserModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs duration-150">Cancel</button>
                          <button
                            onClick={async () => {
                              if (!userFormData.n || !userFormData.e) {
                                setCustomAlert({ isOpen: true, t: 'Validation Error', m: 'Please fill name and email fields accurately.', tp: 'error' });
                                return;
                              }
                              try {
                                if (currentUserEdit) {
                                  await userApi.update(currentUserEdit.id, { name: userFormData.n, email: userFormData.e, role: userFormData.r, isVerified: userFormData.v, phone: userFormData.ph, specialized: userFormData.spec });
                                  setCustomAlert({ isOpen: true, t: 'Success', m: 'User details updated successfully!', tp: 'success' });
                                } else {
                                  await authApi.register({ name: userFormData.n, email: userFormData.e, password: userFormData.p || '123456', role: userFormData.r, isVerified: userFormData.v, phone: userFormData.ph, specialized: userFormData.spec });
                                  setCustomAlert({ isOpen: true, t: 'Success', m: 'New User added successfully!', tp: 'success' });
                                }
                                fetchUsers();
                                setIsUserModalOpen(false);
                              } catch (e) {
                                setCustomAlert({ isOpen: true, t: 'Operation Failed', m: e.response?.data?.error || 'Validation sets setups threshold failures.', tp: 'error' });
                              }
                            }}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-soft duration-150"
                          >
                            Save Changes
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'exams' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">Manage Exams</h1>
                      <p className="text-slate-500 text-sm mt-0.5">Overview of entrance examinations.</p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentExamEdit(null);
                        setExamFormData({ name: '', date: '', applicants: '', board: 'NTA', stream: 'Engineering', url: '', title: '', collegeCount: '', colorClass: 'bg-blue-50 text-blue-600 border-blue-100/50' });
                        setIsExamModalOpen(true);
                      }}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer duration-200"
                    >
                      <BookOpen className="h-4 w-4" /> Add Exam
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {examsList.map((exam, i) => (
                      <div className="card-premium bg-white p-6 space-y-4" key={i}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-slate-800">{exam.name}</h3>
                            <p className="text-xs text-slate-500">{exam.board}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              onClick={async () => {
                                try { await examApi.update(exam.id, { isActive: !exam.isActive }); fetchExams(); } catch (e) { console.error(e); }
                              }}
                              className={`text-xs px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${exam.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                            >
                              {exam.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true, t: 'Delete Exam', m: `Are you sure you want to permanently delete the exam metadata for ${exam.name}?`,
                                  onConfirm: async () => { try { await examApi.delete(exam.id); fetchExams(); } catch (e) { console.error(e); } }
                                });
                              }}
                              className="bg-red-50 hover:bg-red-100 p-1 rounded-lg text-red-500 duration-150 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400 font-medium text-xs">Exam Date</p>
                            <p className="text-slate-800 font-semibold mt-1">{exam.date}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-medium text-xs">Applicants</p>
                            <p className="text-slate-800 font-semibold mt-1">{exam.applicants}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentExamEdit(exam);
                            setExamFormData({ name: exam.name, date: exam.date, applicants: exam.applicants, board: exam.board, stream: exam.stream || 'Engineering', url: exam.url || 'https://example.com', title: exam.title || '', collegeCount: exam.collegeCount || '', colorClass: exam.colorClass || 'bg-blue-50 text-blue-600 border-blue-100/50' });
                            setIsExamModalOpen(true);
                          }}
                          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl text-sm transition duration-200 cursor-pointer"
                        >
                          Manage Details
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add / Edit Exam Modal Dialog Overlay triggers setup layouts accurately sets */}
                  {isExamModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-5">
                        <h3 className="font-bold text-lg text-slate-800 border-b border-slate-50 pb-3">{currentExamEdit ? 'Edit Exam Details' : 'Add New Exam Details'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Exam Name</label>
                            <input type="text" value={examFormData.name} onChange={e => setExamFormData({ ...examFormData, name: e.target.value })} placeholder="e.g., JEE Main 2026" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Conducted Board</label>
                            <input type="text" value={examFormData.board} onChange={e => setExamFormData({ ...examFormData, board: e.target.value })} placeholder="e.g., NTA" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Scheduled Date</label>
                            <input type="date" value={examFormData.date} onChange={e => setExamFormData({ ...examFormData, date: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Applicants Count</label>
                            <input type="text" value={examFormData.applicants} onChange={e => setExamFormData({ ...examFormData, applicants: e.target.value })} placeholder="e.g., 1.5M+" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Eligible Stream</label>
                            <select value={examFormData.stream} onChange={e => setExamFormData({ ...examFormData, stream: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium">
                              <option value="Engineering">Engineering</option>
                              <option value="Medical">Medical</option>
                              <option value="Management">Management (CAT)</option>
                              <option value="General">General (CUET)</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Official Website/Apply Link</label>
                            <input type="url" value={examFormData.url} onChange={e => setExamFormData({ ...examFormData, url: e.target.value })} placeholder="e.g., https://jeemain.nta.nic.in" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Display Title (For Landing Page)</label>
                            <input type="text" value={examFormData.title} onChange={e => setExamFormData({ ...examFormData, title: e.target.value })} placeholder="e.g., NEET UG" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">College Count (For Landing Page)</label>
                            <input type="text" value={examFormData.collegeCount} onChange={e => setExamFormData({ ...examFormData, collegeCount: e.target.value })} placeholder="e.g., 200+ Colleges" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Card Theme Color</label>
                            <select value={examFormData.colorClass} onChange={e => setExamFormData({ ...examFormData, colorClass: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium">
                              <option value="bg-red-50 text-red-600 border-red-100/50">Red</option>
                              <option value="bg-blue-50 text-blue-600 border-blue-100/50">Blue</option>
                              <option value="bg-purple-50 text-purple-600 border-purple-100/50">Purple</option>
                              <option value="bg-orange-50 text-orange-600 border-orange-100/50">Orange</option>
                              <option value="bg-green-50 text-green-600 border-green-100/50">Green</option>
                              <option value="bg-slate-50 text-slate-600 border-slate-100/50">Gray/Slate</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-slate-100">
                          <button onClick={() => setIsExamModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs duration-150">Cancel</button>
                          <button
                            onClick={async () => {
                              if (!examFormData.name || !examFormData.date) {
                                showAlert('Please fill all required information tags.');
                                return;
                              }
                              try {
                                if (currentExamEdit) {
                                  await examApi.update(currentExamEdit.id, { name: examFormData.name, date: examFormData.date, applicants: examFormData.applicants, board: examFormData.board, stream: examFormData.stream, officialUrl: examFormData.url, title: examFormData.title, collegeCount: examFormData.collegeCount, colorClass: examFormData.colorClass });
                                } else {
                                  await examApi.create({ name: examFormData.name, date: examFormData.date, applicants: examFormData.applicants, board: examFormData.board, stream: examFormData.stream, officialUrl: examFormData.url, title: examFormData.title, collegeCount: examFormData.collegeCount, colorClass: examFormData.colorClass });
                                }
                                fetchExams();
                                setIsExamModalOpen(false);
                              } catch (e) {
                                showAlert('Exam saving failed setups threshold configurations dashboards preset.');
                              }
                            }}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-soft duration-150"
                          >
                            Save Changes
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'colleges' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">Colleges List</h1>
                      <p className="text-slate-500 text-sm mt-0.5">Database of listed institutions.</p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentCollegeEdit(null);
                        setCollegeFormData({ n: '', l: '', r: '', f: '', p: '', u: '' });
                        setIsCollegeModalOpen(true);
                      }}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer duration-150"
                    >
                      <Compass className="h-4 w-4" /> Add College
                    </button>
                  </div>
                  <div className="card-premium bg-white p-0 overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto custom-scrollbar shadow-inner">
                      <table className="w-full text-sm min-w-[800px]">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">College Name</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Location</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">NIRF Rank</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Avg Package</th>
                            <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {collegesList.map((c, i) => (
                            <tr className="hover:bg-slate-50 duration-150" key={c.id}>
                              <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">{c.name}</td>
                              <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">{c.location}</td>
                              <td className="py-4 px-4 font-semibold text-slate-700 whitespace-nowrap">{c.nirfRank}</td>
                              <td className="py-4 px-4 font-semibold text-green-600 whitespace-nowrap">{c.avgPackage || 'N/A'}</td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setCurrentCollegeEdit(c);
                                      setCollegeFormData({ n: c.name, l: c.location, r: c.nirfRank, f: c.fees || '', p: c.avgPackage || '', u: c.officialUrl || '' });
                                      setIsCollegeModalOpen(true);
                                    }}
                                    className="bg-primary-50 hover:bg-primary-100 text-primary-600 p-2 rounded-xl duration-150 shadow-soft"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setConfirmDialog({
                                        isOpen: true, t: 'Delete College', m: `Are you sure you want to remove ${c.name} from the directory list?`,
                                        onConfirm: async () => { try { await collegeApi.delete(c.id); fetchColleges(); } catch (e) { console.error(e); } }
                                      });
                                    }}
                                    className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-xl duration-150 shadow-soft"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add / Edit College Modal Dialog Overlay triggers setup layouts accurately sets */}
                  {isCollegeModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-5">
                        <h3 className="font-bold text-lg text-slate-800 border-b border-slate-50 pb-3">{currentCollegeEdit ? 'Edit College Details' : 'Add New Institution'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">College Name</label>
                            <input type="text" value={collegeFormData.n} onChange={e => setCollegeFormData({ ...collegeFormData, n: e.target.value })} placeholder="e.g., IIT Bombay" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Location (City, State)</label>
                            <input type="text" value={collegeFormData.l} onChange={e => setCollegeFormData({ ...collegeFormData, l: e.target.value })} placeholder="e.g., Mumbai, Maharashtra" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">NIRF Ranking</label>
                            <input type="text" value={collegeFormData.r} onChange={e => setCollegeFormData({ ...collegeFormData, r: e.target.value })} placeholder="e.g., 3" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Annual Fee</label>
                            <input type="text" value={collegeFormData.f} onChange={e => setCollegeFormData({ ...collegeFormData, f: e.target.value })} placeholder="e.g., 2.5L/Year" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Median/Avg Package</label>
                            <input type="text" value={collegeFormData.p} onChange={e => setCollegeFormData({ ...collegeFormData, p: e.target.value })} placeholder="e.g., 20 LPA" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Official Website URL</label>
                            <input type="url" value={collegeFormData.u} onChange={e => setCollegeFormData({ ...collegeFormData, u: e.target.value })} placeholder="https://iitb.ac.in" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-slate-100">
                          <button onClick={() => setIsCollegeModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs duration-150">Cancel</button>
                          <button
                            onClick={async () => {
                              if (!collegeFormData.n || !collegeFormData.l) {
                                setCustomAlert({ isOpen: true, t: 'Validation', m: 'Please fill College Name and Location.', tp: 'error' });
                                return;
                              }
                              try {
                                const payload = {
                                  name: collegeFormData.n,
                                  location: collegeFormData.l,
                                  nirfRank: collegeFormData.r,
                                  fees: collegeFormData.f,
                                  avgPackage: collegeFormData.p,
                                  officialUrl: collegeFormData.u
                                };
                                if (currentCollegeEdit) {
                                  await collegeApi.update(currentCollegeEdit.id, payload);
                                } else {
                                  await collegeApi.create(payload);
                                }
                                fetchColleges();
                                setIsCollegeModalOpen(false);
                                setCustomAlert({ isOpen: true, t: 'Success', m: 'College metadata updated successfully!', tp: 'success' });
                              } catch (e) { console.error(e); setCustomAlert({ isOpen: true, t: 'Error', m: 'Failed saving college details setups config.', tp: 'error' }); }
                            }}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-soft duration-150"
                          >
                            Save Changes
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'cutoffs' && (
                <>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900">Cutoff Data</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Previous years opening and closing ranks.</p>
                      </div>
                      <button onClick={() => { setCutoffFormData({ collegeId: collegesList[0]?.id || '', examId: examsList[0]?.id || '', branch: '', category: 'General', closingRank: '', round: '1', quota: 'All India', year: '2025' }); setIsCutoffModalOpen(true); fetchColleges(); fetchExams(); }} className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer duration-150">
                        <Award className="h-4 w-4" /> Add Cutoff
                      </button>
                    </div>
                    <div className="card-premium bg-white p-0 overflow-hidden border border-slate-100">
                      <div className="overflow-x-auto custom-scrollbar shadow-inner">
                        <table className="w-full text-sm min-w-[900px]">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">College</th>
                              <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Branch</th>
                              <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Category</th>
                              <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Rank</th>
                              <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Round</th>
                              <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Quota</th>
                              <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Year</th>
                              <th className="text-right font-semibold text-slate-400 py-3 px-4 whitespace-nowrap pr-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {cutoffsList.map((d, i) => (
                              <tr className="hover:bg-slate-50 duration-150" key={i}>
                                <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">{d.college?.name || 'N/A'}</td>
                                <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">{d.branch}</td>
                                <td className="py-4 px-4 text-slate-500 whitespace-nowrap">{d.category}</td>
                                <td className="py-4 px-4 font-bold text-slate-700 whitespace-nowrap">{d.closingRank}</td>
                                <td className="py-4 px-4 text-slate-500 font-medium whitespace-nowrap">{d.round || '1'}</td>
                                <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap">{d.quota || 'All India'}</td>
                                <td className="py-4 px-4 text-slate-500 whitespace-nowrap">{d.year || '2025'}</td>
                                <td className="py-4 text-right pr-4">
                                  <div className="flex items-center justify-end gap-1">
                                    <button onClick={() => { setCutoffFormData({ ...d, collegeId: d.collegeId.toString(), examId: d.examId.toString() }); setIsCutoffModalOpen(true); }} className="hover:bg-slate-100 p-1.5 rounded-lg text-slate-600 cursor-pointer duration-150">
                                      <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => { setConfirmDialog({ isOpen: true, t: 'Delete Cutoff', m: `Are you sure you want to delete the cutoff record for ${d.branch}?`, onConfirm: async () => { try { await collegeApi.deleteCutoff(d.id); fetchCutoffs(); setCustomAlert({ isOpen: true, t: 'Deleted', m: 'Record removed successfully!', tp: 'success' }); } catch (e) { console.error(e); } } }); }} className="hover:bg-red-50 p-1.5 rounded-lg text-red-500 cursor-pointer duration-150">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {isCutoffModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
                        <h3 className="font-bold text-lg text-slate-800">Add Cutoff Record</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-600">College</label>
                            <select value={cutoffFormData.collegeId} onChange={e => setCutoffFormData({ ...cutoffFormData, collegeId: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1">
                              {collegesList.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-600">Exam</label>
                            <select value={cutoffFormData.examId} onChange={e => setCutoffFormData({ ...cutoffFormData, examId: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1">
                              {examsList.map(e => <option value={e.id} key={e.id}>{e.name}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-600">Branch/Course</label>
                            <input type="text" value={cutoffFormData.branch} onChange={e => setCutoffFormData({ ...cutoffFormData, branch: e.target.value })} placeholder="e.g., Computer Science" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1" />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-slate-600">Category</label>
                              <select value={cutoffFormData.category} onChange={e => setCutoffFormData({ ...cutoffFormData, category: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1">
                                <option value="General">General</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-600">Closing Rank</label>
                              <input type="number" value={cutoffFormData.closingRank} onChange={e => setCutoffFormData({ ...cutoffFormData, closingRank: e.target.value })} placeholder="e.g., 500" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1" />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-slate-600">Round</label>
                              <select value={cutoffFormData.round} onChange={e => setCutoffFormData({ ...cutoffFormData, round: e.target.value })} className="w-full border border-slate-200 rounded-xl px-2 py-2.5 text-sm mt-1">
                                <option value="1">Round 1</option>
                                <option value="2">Round 2</option>
                                <option value="3">Round 3</option>
                                <option value="4">Mop-Up</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-600">Year</label>
                              <input type="number" value={cutoffFormData.year} onChange={e => setCutoffFormData({ ...cutoffFormData, year: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm mt-1" placeholder="2025" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-600">Quota</label>
                              <select value={cutoffFormData.quota} onChange={e => setCutoffFormData({ ...cutoffFormData, quota: e.target.value })} className="w-full border border-slate-200 rounded-xl px-2 py-2.5 text-sm mt-1">
                                <option value="All India">All India</option>
                                <option value="State">State Quota</option>
                                <option value="NRI">NRI Quota</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 mt-2">
                          <button onClick={() => setIsCutoffModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold duration-150">Cancel</button>
                          <button onClick={async () => {
                            try {
                              const payload = { ...cutoffFormData, collegeId: cutoffFormData.collegeId || collegesList[0]?.id, examId: cutoffFormData.examId || examsList[0]?.id };
                              if (cutoffFormData.id) {
                                await collegeApi.updateCutoff(cutoffFormData.id, payload);
                              } else {
                                await collegeApi.createCutoff(payload);
                              }
                              fetchCutoffs();
                              setIsCutoffModalOpen(false);
                              setCustomAlert({ isOpen: true, t: 'Success', m: `Cutoff entry ${cutoffFormData.id ? 'updated' : 'added'} successfully!`, tp: 'success' });
                            } catch (e) { console.error(e); }
                          }} className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-soft duration-150">{cutoffFormData.id ? 'Update' : 'Save'} Record</button>
                          |                        </div>
                      </motion.div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'scholarships' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">Scholarships Management</h1>
                      <p className="text-slate-500 text-sm mt-0.5">Add, edit or remove scholarship opportunities shown to students.</p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentScholarshipEdit(null);
                        setScholarshipFormData({ name: '', description: '', amount: '', eligibility: '', officialUrl: '' });
                        setIsScholarshipModalOpen(true);
                      }}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-soft text-xs duration-150 flex items-center gap-2"
                    >
                      + Add Scholarship
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {scholarshipsList.length === 0 ? (
                      <div className="col-span-3 card-premium bg-white flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-4">
                          <GraduationCap className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold text-slate-800">No Scholarships Yet</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">Click "+ Add Scholarship" to add the first one. It will appear on the Student Dashboard instantly.</p>
                      </div>
                    ) : scholarshipsList.map((s) => (
                      <div key={s.id} className="card-premium bg-white flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl">
                              <GraduationCap className="h-5 w-5" />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setCurrentScholarshipEdit(s);
                                  setScholarshipFormData({ name: s.name, description: s.description, amount: s.amount, eligibility: s.eligibility || '', officialUrl: s.officialUrl || '' });
                                  setIsScholarshipModalOpen(true);
                                }}
                                className="p-1.5 bg-slate-50 hover:bg-primary-50 rounded-lg text-slate-500 hover:text-primary-600 duration-150"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setConfirmDialog({
                                  isOpen: true,
                                  t: 'Delete Scholarship',
                                  m: `Are you sure you want to delete "${s.name}"? This will remove it from the student dashboard.`,
                                  onConfirm: async () => {
                                    try {
                                      await scholarshipApi.delete(s.id);
                                      await fetchScholarships();
                                      setCustomAlert({ isOpen: true, t: 'Deleted!', m: 'Scholarship removed successfully.', tp: 'success' });
                                    } catch (e) {
                                      setCustomAlert({ isOpen: true, t: 'Error', m: 'Failed to delete scholarship.', tp: 'error' });
                                    }
                                  }
                                })}
                                className="p-1.5 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-500 duration-150"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm leading-snug">{s.name}</h3>
                          <p className="text-primary-600 font-bold text-xs mt-1">{s.amount}</p>
                          <p className="text-slate-500 text-xs mt-2 leading-relaxed">{s.description}</p>
                          {s.eligibility && (
                            <p className="text-slate-400 text-[10px] mt-2 leading-relaxed border-t border-slate-50 pt-2">
                              <span className="font-bold text-slate-500">Eligible: </span>{s.eligibility}
                            </p>
                          )}
                        </div>
                        {s.officialUrl && (
                          <a href={s.officialUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-600 font-semibold flex items-center gap-1 mt-4 hover:underline">
                            View Link <ArrowRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Scholarship Add/Edit Modal */}
                  <AnimatePresence>
                    {isScholarshipModalOpen && (
                      <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.85, y: 20 }}
                          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4 border border-slate-100"
                        >
                          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                            <h3 className="font-bold text-slate-800 text-base">
                              {currentScholarshipEdit ? 'Edit Scholarship' : 'Add New Scholarship'}
                            </h3>
                            <button onClick={() => setIsScholarshipModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg duration-150">
                              <X className="h-4 w-4 text-slate-500" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Scholarship Name *</label>
                              <input
                                type="text"
                                value={scholarshipFormData.name}
                                onChange={e => setScholarshipFormData({ ...scholarshipFormData, name: e.target.value })}
                                placeholder="e.g. Merit Excellence Scholarship"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Amount / Benefit *</label>
                              <input
                                type="text"
                                value={scholarshipFormData.amount}
                                onChange={e => setScholarshipFormData({ ...scholarshipFormData, amount: e.target.value })}
                                placeholder="e.g. Up to 100% Waiver / ₹50,000"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Description *</label>
                              <textarea
                                value={scholarshipFormData.description}
                                onChange={e => setScholarshipFormData({ ...scholarshipFormData, description: e.target.value })}
                                placeholder="Brief description of this scholarship"
                                rows={2}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium resize-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Eligibility Criteria</label>
                              <input
                                type="text"
                                value={scholarshipFormData.eligibility}
                                onChange={e => setScholarshipFormData({ ...scholarshipFormData, eligibility: e.target.value })}
                                placeholder="e.g. Top 10% rank holders in JEE/NEET"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Official Apply URL</label>
                              <input
                                type="url"
                                value={scholarshipFormData.officialUrl}
                                onChange={e => setScholarshipFormData({ ...scholarshipFormData, officialUrl: e.target.value })}
                                placeholder="https://example.com/apply"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                            <button
                              onClick={() => setIsScholarshipModalOpen(false)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold duration-150"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={async () => {
                                if (!scholarshipFormData.name || !scholarshipFormData.amount || !scholarshipFormData.description) {
                                  setCustomAlert({ isOpen: true, t: 'Missing Fields', m: 'Please fill Name, Amount, and Description.', tp: 'error' });
                                  return;
                                }
                                try {
                                  const payload = {
                                    name: scholarshipFormData.name,
                                    description: scholarshipFormData.description,
                                    amount: scholarshipFormData.amount,
                                    eligibility: scholarshipFormData.eligibility,
                                    officialUrl: scholarshipFormData.officialUrl
                                  };
                                  if (currentScholarshipEdit) {
                                    await scholarshipApi.update(currentScholarshipEdit.id, payload);
                                    setCustomAlert({ isOpen: true, t: 'Updated!', m: 'Scholarship updated successfully. Students will see the new data.', tp: 'success' });
                                  } else {
                                    await scholarshipApi.create(payload);
                                    setCustomAlert({ isOpen: true, t: 'Added!', m: 'New scholarship added. Students can now see and apply for it!', tp: 'success' });
                                  }
                                  await fetchScholarships();
                                  setIsScholarshipModalOpen(false);
                                } catch (e) {
                                  setCustomAlert({ isOpen: true, t: 'Error', m: e.response?.data?.error || 'Failed to save scholarship.', tp: 'error' });
                                }
                              }}
                              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-soft duration-150"
                            >
                              {currentScholarshipEdit ? 'Update Scholarship' : 'Add Scholarship'}
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeTab === 'packages' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">VIP Packages Management</h1>
                      <p className="text-slate-500 text-sm mt-0.5">Add, edit or remove subscription plans for students.</p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPackageEdit(null);
                        setPackageFormData({ name: '', price: '', benefits: '', actionText: '', isFeatured: false });
                        setIsPackageModalOpen(true);
                      }}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-soft text-xs duration-150 flex items-center gap-2"
                    >
                      + Add Package
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {packagesList.length === 0 ? (
                      <div className="col-span-3 card-premium bg-white flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-4">
                          <Award className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold text-slate-800">No Packages Yet</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">Click "+ Add Package" to add the first one.</p>
                      </div>
                    ) : packagesList.map((p) => (
                      <div key={p.id} className="card-premium bg-white flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl">
                              <Award className="h-5 w-5" />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setCurrentPackageEdit(p);
                                  setPackageFormData({ name: p.name, price: p.price, benefits: Array.isArray(p.benefits) ? p.benefits.join(', ') : p.benefits, actionText: p.actionText, isFeatured: p.isFeatured });
                                  setIsPackageModalOpen(true);
                                }}
                                className="p-1.5 bg-slate-50 hover:bg-primary-50 rounded-lg text-slate-500 hover:text-primary-600 duration-150"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setConfirmDialog({
                                  isOpen: true,
                                  t: 'Delete Package',
                                  m: `Are you sure you want to delete "${p.name}"?`,
                                  onConfirm: async () => {
                                    try {
                                      await packageApi.delete(p.id);
                                      await fetchPackages();
                                      setCustomAlert({ isOpen: true, t: 'Deleted!', m: 'Package removed successfully.', tp: 'success' });
                                    } catch (e) {
                                      setCustomAlert({ isOpen: true, t: 'Error', m: 'Failed to delete package.', tp: 'error' });
                                    }
                                  }
                                })}
                                className="p-1.5 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-500 duration-150"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm leading-snug">{p.name} Package</h3>
                          <p className="text-primary-600 font-bold text-xs mt-1">{p.price}</p>
                          <ul className="space-y-1 mt-3">
                            {(Array.isArray(p.benefits) ? p.benefits : JSON.parse(p.benefits || '[]')).map((b, idx) => (
                              <li className="flex items-start gap-1.5 text-slate-500 text-[11px]" key={idx}><Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" /> {b}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add/Edit Modal */}
                  <AnimatePresence>
                    {isPackageModalOpen && (
                      <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4 border border-slate-100">
                          <h3 className="font-bold text-slate-800 text-base border-b border-slate-50 pb-2">{currentPackageEdit ? 'Edit Package' : 'Add New Package'}</h3>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Package Name</label>
                              <input type="text" value={packageFormData.name} onChange={e => setPackageFormData({ ...packageFormData, name: e.target.value })} placeholder="e.g. Standard" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Price Display</label>
                              <input type="text" value={packageFormData.price} onChange={e => setPackageFormData({ ...packageFormData, price: e.target.value })} placeholder="e.g. ₹499/Month" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Benefits (Comma separated)</label>
                              <textarea value={packageFormData.benefits} onChange={e => setPackageFormData({ ...packageFormData, benefits: e.target.value })} placeholder="Benefit 1, Benefit 2" rows={2} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm resize-none" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Action Button Text</label>
                              <input type="text" value={packageFormData.actionText} onChange={e => setPackageFormData({ ...packageFormData, actionText: e.target.value })} placeholder="e.g. Upgrade Now" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm" />
                            </div>
                            <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
                              <input type="checkbox" checked={packageFormData.isFeatured} onChange={e => setPackageFormData({ ...packageFormData, isFeatured: e.target.checked })} className="rounded text-primary-600" id="featured_check" />
                              <label htmlFor="featured_check" className="text-xs text-slate-600 font-medium">Highlight as Best Value</label>
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                            <button onClick={() => setIsPackageModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold">Cancel</button>
                            <button onClick={async () => {
                              if (!packageFormData.name || !packageFormData.price) return showAlert('Fill name & price');
                              try {
                                const list = packageFormData.benefits.split(',').map(b => b.trim()).filter(Boolean);
                                const payload = { ...packageFormData, benefits: list };
                                if (currentPackageEdit) await packageApi.update(currentPackageEdit.id, payload);
                                else await packageApi.create(payload);
                                fetchPackages();
                                setIsPackageModalOpen(false);
                                setCustomAlert({ isOpen: true, t: 'Success', m: 'Package saved!', tp: 'success' });
                              } catch (e) { console.error(e); }
                            }} className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold">Save</button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage details and system configurations.</p>
                  </div>

                  {/* Administrator Profile Card */}
                  <div className="card-premium bg-white p-6 space-y-4">
                    <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">Administrator Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Full Name</label>
                        <input type="text" value={adminProfile.name || ''} onChange={e => setAdminProfile({ ...adminProfile, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Email Address</label>
                        <input type="email" value={adminProfile.email || ''} onChange={e => setAdminProfile({ ...adminProfile, email: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                        <input type="text" value={adminProfile.phone || ''} onChange={e => setAdminProfile({ ...adminProfile, phone: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Assigned Role</label>
                        <input type="text" value={adminProfile.role || 'Super Administrator'} disabled className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed" />
                      </div>
                    </div>
                    <button onClick={async () => {
                      try {
                        await userApi.update(adminProfile.id, adminProfile);
                        setCustomAlert({ isOpen: true, t: 'Updated', m: 'Profile updated successfully!', tp: 'success' });
                        fetchAdminProfile();
                      } catch (e) { console.error(e); }
                    }} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-soft cursor-pointer duration-200">Save Changes</button>
                  </div>

                  {/* Change Password Card */}
                  <div className="card-premium bg-white p-6 space-y-4">
                    <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">Security Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Current Password</label>
                        <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">New Password</label>
                        <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="Set new" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Confirm Password</label>
                        <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Confirm new" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
                      </div>
                    </div>
                    <button onClick={async () => {
                      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                        setCustomAlert({ isOpen: true, t: 'Error', m: 'Passwords do not match!', tp: 'error' });
                        return;
                      }
                      try {
                        await userApi.changePassword({ id: adminProfile.id, currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
                        setCustomAlert({ isOpen: true, t: 'Success', m: 'Password updated successfully!', tp: 'success' });
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      } catch (e) {
                        setCustomAlert({ isOpen: true, t: 'Error', m: e.response?.data?.error || 'Failed to update!', tp: 'error' });
                      }
                    }} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-soft cursor-pointer duration-200">Update Password</button>
                  </div>

                  {/* System Preferences Toggles Card */}
                  <div className="card-premium bg-white p-6 space-y-4">
                    <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">System Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">Email Notifications</p>
                          <p className="text-xs text-slate-500 text-wrap-tight">Receive daily summary reports and verification updates via Email address.</p>
                        </div>
                        <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in mb-2 mt-2">
                          <input type="checkbox" name="toggle" id="email_notifs" className="sr-only" defaultChecked />
                          <label htmlFor="email_notifs" className="block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer"></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">Maintenance Mode</p>
                          <p className="text-xs text-slate-500 text-wrap-tight">Temporarily restrict client access to dashboard for system updates.</p>
                        </div>
                        <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in mb-2 mt-2">
                          <input type="checkbox" name="toggle" id="maint_mode" className="sr-only" />
                          <label htmlFor="maint_mode" className="block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          )}
        </main>
        <AnimatePresence>
          {customAlert.isOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[999] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center">
                <div className={`p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center ${customAlert.tp === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                  {customAlert.tp === 'success' ? <Check className="h-8 w-8 text-green-600" /> : <ShieldAlert className="h-8 w-8 text-red-500" />}
                </div>
                <h3 className="font-bold text-lg text-slate-800">{customAlert.t}</h3>
                <p className="text-slate-500 text-sm">{customAlert.m}</p>
                <div className="pt-2">
                  <button onClick={() => setCustomAlert({ ...customAlert, isOpen: false })} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs duration-150">Okay</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {confirmDialog.isOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[998] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center border border-slate-50">
                <div className={`p-4 rounded-full mx-auto w-16 h-16 ${confirmDialog.t?.includes('Verify') ? 'bg-green-50' : 'bg-amber-50'} flex items-center justify-center`}>
                  {confirmDialog.t?.includes('Verify') ? <Check className="h-8 w-8 text-green-600" /> : <ShieldAlert className="h-8 w-8 text-amber-500" />}
                </div>
                <h3 className="font-bold text-lg text-slate-800">{confirmDialog.t}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{confirmDialog.m}</p>
                <div className="pt-2 grid grid-cols-2 gap-3">
                  <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs duration-150">Cancel</button>
                  <button onClick={() => { if (confirmDialog.onConfirm) confirmDialog.onConfirm(); setConfirmDialog({ ...confirmDialog, isOpen: false }); }} className={`w-full ${confirmDialog.t?.includes('Verify') ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white font-semibold py-2.5 rounded-xl text-xs shadow-soft duration-150`}>Yes, Confirm</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isLogoutModalOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[999] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
                <div className="p-4 rounded-full mx-auto w-16 h-16 bg-red-50 flex items-center justify-center mb-4">
                  <LogOut className="h-8 w-8 text-red-500 animate-pulse" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Ready to leave?</h3>
                <p className="text-slate-500 text-sm">You are about to log out from your session. You'll need to sign in again to access your dashboard.</p>

                <div className="pt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setIsLogoutModalOpen(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-xl text-sm duration-150">Cancel</button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user');
                      localStorage.removeItem('token');
                      navigate('/login', { replace: true });
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl text-sm shadow-soft duration-150 flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
