import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  LayoutDashboard, Compass, Star, GraduationCap, Bell, Search, 
  Menu, X, CheckSquare, Clock, ArrowRight, Settings, LogOut, ChevronRight, Award, Users, ShieldAlert, BookOpen, MessageSquare, ClipboardList
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi, sessionApi, chatApi, notificationApi, enquiryApi } from '../api';
import { useToast } from '../context/ToastContext';
import { useRef } from 'react';
import Preloader from '../components/Preloader';
import { io } from 'socket.io-client';

export default function CounsellorDashboard() {
  const navigate = useNavigate();
  const { showAlert } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(localStorage.getItem('counsellorTab') || 'overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [customAlert, setCustomAlert] = useState({ isOpen: false, t: '', m: '', tp: '' });
  
  // Schedule Session State Logic
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [sessionFormData, setSessionFormData] = useState({ student: '', date: '', time: '', topic: 'Document Verification', url: '' });

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setIsNotificationsOpen(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    localStorage.setItem('counsellorTab', tab);
    setActiveTab(tab);
    setTimeout(() => setIsLoading(false), 600);
  };

  const [stats, setStats] = useState([
    { t: 'Assigned Students', v: '0', d: 'Total students registered', i: Users, c: 'bg-primary-50 text-primary-600' },
    { t: 'Sessions Scheduled', v: '4', d: 'Today sessions: 2', i: Clock, c: 'bg-green-50 text-green-600' },
    { t: 'Query Support Requests', v: '3', d: 'Needs review response', i: MessageSquare, c: 'bg-amber-50 text-amber-600' },
  ]);

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'My Students' },
    { id: 'sessions', icon: Clock, label: 'Sessions' },
    { id: 'enquiries', icon: ClipboardList, label: 'Student Enquiries' },
    { id: 'chat', icon: MessageSquare, label: 'Support Chat' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const [studentsList, setStudentsList] = useState([]);
  const [sessionsList, setSessionsList] = useState([]);
  const [allStudentsForSchedule, setAllStudentsForSchedule] = useState([]);
  const [counsellorProfile, setCounsellorProfile] = useState({ name: 'Neha Gupta', email: 'neha@educounsel.com', phone: '+91 9876543211', specialized: 'IIT/NEET Guidance', id: null });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Chat state
  const [selectedChatStudent, setSelectedChatStudent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const chatEndRef = useRef(null);

  // Enquiry State
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [isUpdatingEnquiry, setIsUpdatingEnquiry] = useState(false);

  const fetchEnquiries = async (id) => {
    try {
      const res = await enquiryApi.getCounsellor(id);
      setEnquiriesList(res.data);
    } catch (e) { console.error('Enquiry fetch error:', e); }
  };

  const handleEnquiryStatus = async (id, status) => {
    try {
      setIsUpdatingEnquiry(true);
      await enquiryApi.updateStatus(id, status);
      showAlert(`Enquiry ${status} successfully!`, 'success');
      fetchEnquiries(counsellorProfile.id);
    } catch (e) {
      showAlert(`Failed to ${status} enquiry.`);
    } finally {
      setIsUpdatingEnquiry(false);
    }
  };

  const socketRef = useRef(null);
  const selectedStudentRef = useRef(null);
  useEffect(() => { selectedStudentRef.current = selectedChatStudent; }, [selectedChatStudent]);

  // Load all students for scheduling dropdown to enable assigning any student flaws triggers overlay triggers
  useEffect(() => {
    if (isScheduleModalOpen) {
      userApi.getAll()
        .then(res => {
          const filtered = res.data.filter(u => u.role === 'Student').map(u => ({ id: u.id, n: u.name }));
          setAllStudentsForSchedule(filtered);
          if (filtered.length > 0) {
            setSessionFormData(prev => ({ ...prev, student: filtered[0].n }));
          }
        })
        .catch(err => console.error('Load all students failed:', err));
    }
  }, [isScheduleModalOpen]);

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      await userApi.update(counsellorProfile.id, {
        name: counsellorProfile.name,
        email: counsellorProfile.email,
        phone: counsellorProfile.phone,
        specialized: counsellorProfile.specialized
      });
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        localStorage.setItem('user', JSON.stringify({ ...userObj, name: counsellorProfile.name, email: counsellorProfile.email, phone: counsellorProfile.phone, specialized: counsellorProfile.specialized }));
      }
      setCustomAlert({ isOpen: true, t: 'Success', m: 'Profile updated successfully!', tp: 'success' });
    } catch (e) {
      setCustomAlert({ isOpen: true, t: 'Error', m: e.response?.data?.message || 'Failed to update profile.', tp: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setCustomAlert({ isOpen: true, t: 'Warning', m: 'Please fill all password fields.', tp: 'warning' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setCustomAlert({ isOpen: true, t: 'Warning', m: 'New passwords do not match.', tp: 'warning' });
      return;
    }
    try {
      setIsUpdatingPassword(true);
      await userApi.changePassword({ 
        id: counsellorProfile.id,
        currentPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword 
      });
      setCustomAlert({ isOpen: true, t: 'Success', m: 'Password updated successfully!', tp: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setCustomAlert({ isOpen: true, t: 'Error', m: e.response?.data?.error || 'Failed to update password.', tp: 'error' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Track which tabs have already loaded data
  const loadedTabs = useRef(new Set());

  // Load profile ONCE at mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const userObj = JSON.parse(userStr);
        const userRes = await userApi.getProfile(userObj.id);
        setCounsellorProfile(userRes.data);

        try {
          const notifs = await notificationApi.getAll(userObj.id);
          setNotifications(notifs.data);
        } catch (e) { console.error('Notifications load error', e); }
      } catch (e) { console.error('Profile load error:', e); }
    };
    loadProfile();
  }, []);

  const handleMarkAllRead = async () => {
    if (!counsellorProfile.id) return;
    try {
      await notificationApi.markAllRead(counsellorProfile.id);
      setNotifications(prev => prev.map(n => ({...n, read: true, isRead: true})));
    } catch (e) { console.error('Failed to mark read', e); }
  };

  // Per-tab lazy loader
  useEffect(() => {
    const tab = activeTab;
    if (loadedTabs.current.has(tab)) return;

    const fetchTabData = async () => {
      const userStr = localStorage.getItem('user');
      const userObj = userStr ? JSON.parse(userStr) : null;
      if (!userObj) return;
      try {
        if (tab === 'overview' || tab === 'students' || tab === 'chat') {
          if (studentsList.length === 0) {
            const resSessions = await sessionApi.getAll({ counsellorId: userObj.id });
            const resChats = await chatApi.getConversations(userObj.id);

            const sessionStudents = resSessions.data.filter(s => s.student).map(s => ({
              id: s.studentId, n: s.student.name, e: s.student.email,
              m: s.student.specialized || 'General Counselling',
              s: 'Session scheduled', status: s.status,
              rank: 'N/A', doc: s.student.isVerified ? 'Approved' : 'Pending'
            }));

            const chatStudents = resChats.data.filter(u => u.role === 'Student').map(u => ({
              id: u.id, n: u.name, e: u.email,
              m: u.specialized || 'General Counselling',
              s: 'New Message', status: 'Chat Contact',
              rank: 'N/A', doc: u.isVerified ? 'Approved' : 'Pending'
            }));

            const uniqueStudents = [...new Map([...sessionStudents, ...chatStudents].map(s => [s.id, s])).values()];
            setStudentsList(uniqueStudents);
            setSessionFormData(prev => ({ ...prev, student: uniqueStudents[0]?.n || '' }));

            const mappedS = resSessions.data.map(s => ({
              id: s.id, studentId: s.studentId,
              n: s.student?.name || 'Student',
              m: s.topic, s: `${s.date} ${s.time}`, url: s.url, status: s.status
            }));
            setSessionsList(mappedS);
            setSessionsList(mappedS);

            setStats([
              { t: 'Assigned Students', v: String(uniqueStudents.length), d: 'Total students registered', i: Users, c: 'bg-primary-50 text-primary-600' },
              { t: 'Sessions Scheduled', v: String(mappedS.length), d: `Upcoming: ${mappedS.length}`, i: Clock, c: 'bg-green-50 text-green-600' },
              { t: 'Query Support Requests', v: '0', d: 'Needs review response', i: MessageSquare, c: 'bg-amber-50 text-amber-600' }
            ]);
            fetchEnquiries(userObj.id);
          }
        } else if (tab === 'sessions') {
          if (sessionsList.length === 0) {
            const resSessions = await sessionApi.getAll({ counsellorId: userObj.id });
            const mappedS = resSessions.data.map(s => ({
              id: s.id, studentId: s.studentId,
              n: s.student?.name || 'Student',
              m: s.topic, s: `${s.date} ${s.time}`, url: s.url, status: s.status
            }));
            setSessionsList(mappedS);
          }
        } else if (tab === 'enquiries') {
          fetchEnquiries(userObj.id);
        }
        loadedTabs.current.add(tab);
      } catch (e) { console.error(`Counsellor tab [${tab}] load error:`, e); }
    };
    fetchTabData();
  }, [activeTab]);

  // Auto-select first student for chat when students are loaded
  useEffect(() => {
    if (studentsList.length > 0 && !selectedChatStudent) {
      setSelectedChatStudent(studentsList[0]);
    }
  }, [studentsList]);

  // Load chat messages when student is selected with real-time sync
  useEffect(() => {
    if (!selectedChatStudent || !counsellorProfile.id) return;

    chatApi.getMessages(counsellorProfile.id, selectedChatStudent.id)
      .then(res => {
        setChatMessages(res.data);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      })
      .catch(() => setChatMessages([]));
  }, [selectedChatStudent, counsellorProfile.id]);

  useEffect(() => {
    if (counsellorProfile.id) {
      const socket = io('http://localhost:5000');
      socketRef.current = socket;
      socket.emit('join_room', counsellorProfile.id);

      socket.on('receive_message', (data) => {
        if (selectedStudentRef.current?.id === data.senderId) {
          setChatMessages(prev => [...prev, data]);
          setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        } else {
             // Dynamically append new chatting student to list triggers overlay flaws triggers overlay flawlessly
             userApi.getProfile(data.senderId).then(res => {
                const u = res.data;
                setStudentsList(prev => {
                   if (prev.find(s => s.id === u.id)) return prev;
                   return [...prev, {
                      id: u.id, n: u.name, e: u.email,
                      m: u.specialized || 'General Counselling',
                      s: 'New Message', status: 'Chat Contact',
                      rank: 'N/A', doc: u.isVerified ? 'Approved' : 'Pending'
                   }];
                });
             }).catch(console.error);
        }
      });

      return () => socket.disconnect();
    }
  }, [counsellorProfile.id]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedChatStudent || !counsellorProfile.id) return;
    const content = chatInput.trim();
    setChatInput('');
    setIsSendingMsg(true);
    try {
      const res = await chatApi.sendMessage({
        senderId: counsellorProfile.id,
        receiverId: selectedChatStudent.id,
        content
      });
      setChatMessages(prev => [...prev, res.data]);
      socketRef.current?.emit('send_message', { senderId: counsellorProfile.id, receiverId: selectedChatStudent.id, content, createdAt: new Date() });
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (e) {
      console.error('Send message failed:', e);
    } finally {
      setIsSendingMsg(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f6fc] overflow-hidden">
      {/* Sidebar - Fixed Drawer for Mobile */}
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
                  <span className="font-bold text-lg">Edu<span className="text-primary-600">Guide</span></span>
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
              <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50"><LogOut className="h-5 w-5" /> Logout</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

      {/* Main content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-10 relative">
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
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                className="bg-slate-50 p-2 rounded-xl text-slate-500 relative hover:bg-slate-100 duration-200"
              >
                <Bell className="h-5 w-5" />
                {notifications.some(n => !n.isRead && !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
                )}
              </button>
              {isNotificationsOpen && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 p-4 space-y-2"
                 >
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                       <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                       <span onClick={handleMarkAllRead} className="text-xs text-primary-600 font-semibold cursor-pointer">Mark all read</span>
                    </div>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">No new notifications.</p>
                      ) : (
                        notifications.map((n, i) => (
                          <div key={n.id || i} className={`p-3 border rounded-xl hover:bg-slate-50 duration-150 cursor-pointer ${n.isRead || n.read ? 'border-slate-50 bg-white' : 'border-primary-100 bg-primary-50/30'}`}>
                            <p className={`font-bold text-xs ${n.isRead || n.read ? 'text-slate-700' : 'text-primary-800'}`}>{n.title || n.type || 'Notification'}</p>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                            <p className="text-[9px] text-slate-400 mt-2 font-medium">{new Date(n.createdAt || Date.now()).toLocaleString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                 </motion.div>
              )}
            </div>

            <div onClick={() => handleTabChange('settings')} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-xl duration-200">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-100"
              />
              <div className="hidden md:block text-left">
                <p className="font-bold text-sm text-slate-800">{counsellorProfile.name}</p>
                <p className="text-xs text-slate-500">{counsellorProfile.specialized || 'Counsellor Profile'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {isLoading ? (
             <Preloader />
          ) : (
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, ease: "easeOut" }}
             >
               {(() => {
                 switch (activeTab) {
                   case 'overview':
                   return (
                     <>
                       <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                         <div>
                           <h1 className="text-2xl font-bold text-slate-900">Counsellor Dashboard</h1>
                           <p className="text-slate-500 text-sm mt-0.5">Overview of assigned students and upcoming sessions analytics dashboard metrics.</p>
                         </div>
                          <button 
                            onClick={() => {
                               setSessionFormData({ student: studentsList[0]?.n, date: '', time: '', topic: 'Document Verification', url: '' });
                               setIsScheduleModalOpen(true);
                            }}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-soft text-sm flex items-center gap-2 cursor-pointer duration-300"
                          >
                            <ArrowRight className="h-4 w-4" /> Schedule Session
                          </button>
                       </div>

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
                          <div className="card-premium bg-white">
                             <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                                <h3 className="font-bold text-slate-800">Assigned Verification Pending</h3>
                                <button className="text-primary-600 font-semibold text-xs flex items-center gap-1">View All <ChevronRight className="h-3 w-3" /></button>
                             </div>
                             <div className="space-y-4">
                                 {studentsList.filter(u => u.doc === 'Pending').map((u, i) => (
                                   <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 duration-150 flex items-center justify-between" key={i}>
                                      <div>
                                         <p className="font-bold text-slate-800 text-sm">{u.n}</p>
                                         <p className="text-xs text-slate-500">{u.m}</p>
                                      </div>
                                       <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.doc === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{u.doc}</span>
                                   </div>
                                ))}
                             </div>
                          </div>

                          <div className="card-premium bg-white">
                             <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                                <h3 className="font-bold text-slate-800">Upcoming Live Counselling Updates</h3>
                             </div>
                                 {sessionsList.length > 0 ? (
                                    <div className="w-full space-y-3 px-4 pb-4">
                                       {sessionsList.slice(0, 3).map((s, i) => (
                                          <div className="p-3.5 border border-slate-100 rounded-xl flex justify-between items-center hover:bg-slate-50 duration-150" key={i}>
                                             <div>
                                                <p className="font-bold text-slate-800 text-xs">{s.n}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{s.m}</p>
                                             </div>
                                             <span className="bg-primary-50 text-primary-600 px-2.5 py-1 rounded-lg text-xs font-bold">{s.s}</span>
                                          </div>
                                       ))}
                                    </div>
                                 ) : (
                                    <div className="flex flex-col items-center justify-center text-center py-12">
                                       <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-4">
                                          <Clock className="h-8 w-8" />
                                       </div>
                                       <h4 className="font-bold text-slate-800 text-sm">No Live Session At This Moment</h4>
                                       <p className="text-xs text-slate-400 mt-1 max-w-xs">Loads schedule filters parameters dashboards.</p>
                                    </div>
                                 )}
                          </div>
                       </div>
                     </>
                   );
                 case 'students':
                   return (
                     <div className="space-y-6">
                       <div>
                         <h1 className="text-2xl font-bold text-slate-900">My Students</h1>
                         <p className="text-slate-500 text-sm mt-0.5">List of students assigned to you for support counselling.</p>
                       </div>
                       <div className="card-premium bg-white p-0 overflow-hidden border border-slate-100">
                          <div className="overflow-x-auto custom-scrollbar shadow-inner">
                             <table className="w-full text-sm min-w-[700px]">
                               <thead>
                                 <tr className="border-b border-slate-100">
                                   <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Student Name</th>
                                   <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Applied Exam</th>
                                   <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Rank/Score</th>
                                   <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Docs Status</th>
                                   <th className="text-left font-semibold text-slate-400 py-3 px-4 whitespace-nowrap">Actions</th>
                                 </tr>
                               </thead>
                              <tbody className="divide-y divide-slate-100">
                                {studentsList.map((u, i) => (
                                  <tr className="hover:bg-slate-50 duration-150" key={i}>
                                    <td className="py-4 px-4">
                                      <div className="flex items-center gap-3">
                                         <div className="w-9 h-9 rounded-2xl bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-sm shadow-soft">
                                            {u.n ? u.n[0].toUpperCase() : 'S'}
                                         </div>
                                         <div>
                                            <p className="font-bold text-slate-800">{u.n}</p>
                                            <p className="text-xs text-slate-400 font-medium">{u.e}</p>
                                         </div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-slate-600 font-bold text-xs whitespace-nowrap">{u.m}</td>
                                    <td className="py-4 px-4 text-slate-700 font-bold text-xs whitespace-nowrap">{u.rank}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                       <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.doc === 'Approved' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>{u.doc}</span>
                                    </td>
                                    <td className="py-4">
                                       <button className="bg-primary-50 hover:bg-primary-100 text-primary-600 px-3 py-2 rounded-xl text-xs font-bold duration-150 cursor-pointer shadow-soft">
                                          View Logs
                                       </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                         </div>
                       </div>
                     </div>
                   );
                  case 'sessions':
                   return (
                     <div className="space-y-6">
                       <div>
                         <h1 className="text-2xl font-bold text-slate-900">Sessions Schedule</h1>
                         <p className="text-slate-500 text-sm mt-0.5">Manage and view scheduled interactions with students.</p>
                       </div>
                       <div className="grid gap-4">
                          {sessionsList.map((u, i) => (
                           <div className="card-premium bg-white p-6 flex flex-col md:flex-row justify-between items-center gap-4" key={i}>
                             <div>
                               <p className="text-xs font-semibold text-primary-600">Upcoming interaction session</p>
                                <h3 className="font-bold text-lg text-slate-800 mt-1">{u.n}</h3>
                                <p className="text-xs text-slate-500 mt-1">{u.m}</p>
                             </div>
                             <div className="flex items-center gap-3">
                               <div className="bg-slate-50 px-4 py-2 rounded-xl text-center">
                                 <p className="text-xs text-slate-400">Scheduled At</p>
                                 <p className="text-sm font-bold text-slate-800">{u.s}</p>
                               </div>
                                <button onClick={() => u.url && window.open(u.url, '_blank')} className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-xl text-xs">Join Room</button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   );
                 case 'enquiries':
                   return (
                     <div className="space-y-6">
                       <div>
                         <h1 className="text-2xl font-bold text-slate-900">Student Enquiries</h1>
                         <p className="text-slate-500 text-sm mt-0.5">Review and respond to counselling requests from students.</p>
                       </div>
                       {enquiriesList.length === 0 ? (
                         <div className="card-premium bg-white flex flex-col items-center justify-center py-20 text-center">
                           <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-4">
                             <ClipboardList className="h-8 w-8" />
                           </div>
                           <h3 className="font-bold text-slate-800">No Pending Enquiries</h3>
                           <p className="text-xs text-slate-400 mt-1 max-w-xs">You have caught up with all student requests.</p>
                         </div>
                       ) : (
                         <div className="space-y-4">
                           {enquiriesList.map((enq, i) => (
                             <div key={enq.id || i} className="card-premium bg-white">
                               <div className="flex w-full justify-between items-start border-b border-slate-50 pb-4 mb-4">
                                 <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-sm shadow-soft">
                                      {enq.student?.name ? enq.student.name[0].toUpperCase() : 'S'}
                                   </div>
                                   <div>
                                     <h3 className="font-bold text-slate-800 text-base">{enq.student?.name || 'Student'}</h3>
                                     <p className="text-xs text-slate-500">
                                       Subject: <span className="font-semibold text-slate-700">{enq.subject}</span> • {new Date(enq.createdAt).toLocaleDateString()}
                                     </p>
                                   </div>
                                 </div>
                                 <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                                   enq.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                   enq.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                   'bg-amber-50 text-amber-600'
                                 }`}>
                                   {enq.status || 'Pending'}
                                 </span>
                               </div>
                               <div className="mb-4">
                                 <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Query Details</h4>
                                 <p className="text-sm text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">{enq.query}</p>
                               </div>
                               
                               {enq.status === 'Pending' && (
                                 <div className="flex gap-3 justify-end pt-2 border-t border-slate-50">
                                   <button 
                                     onClick={() => handleEnquiryStatus(enq.id, 'Rejected')}
                                     disabled={isUpdatingEnquiry}
                                     className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-5 py-2 rounded-xl text-xs duration-200"
                                   >
                                     Reject
                                   </button>
                                   <button 
                                     onClick={() => handleEnquiryStatus(enq.id, 'Approved')}
                                     disabled={isUpdatingEnquiry}
                                     className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-soft duration-200"
                                   >
                                     Approve
                                   </button>
                                 </div>
                               )}
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   );
                 case 'chat':
                   return (
                     <div className="space-y-6">
                       <div>
                         <h1 className="text-2xl font-bold text-slate-900">Support Chat</h1>
                         <p className="text-slate-500 text-sm mt-0.5">Quickly respond and guide student doubts directly.</p>
                       </div>
                        <div className="grid grid-cols-12 gap-0 h-[520px] border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-soft">
                          {/* Student list */}
                          <div className="col-span-4 border-r border-slate-100 flex flex-col overflow-y-auto">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students</p>
                            </div>
                            {studentsList.length === 0 ? (
                              <div className="flex-1 flex items-center justify-center text-xs text-slate-400 p-4">No students assigned</div>
                            ) : studentsList.map((s, i) => (
                              <div
                                key={i}
                                onClick={() => { setSelectedChatStudent(s); setChatMessages([]); }}
                                className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-primary-50 transition-colors ${selectedChatStudent?.id === s.id ? "bg-primary-50 border-l-4 border-l-primary-500" : ""}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                    {s.n?.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-800 text-sm truncate">{s.n}</p>
                                    <p className="text-xs text-slate-400 truncate">{s.e}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Chat panel */}
                          <div className="col-span-8 flex flex-col">
                            {selectedChatStudent ? (
                              <>
                                <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                                    {selectedChatStudent.n?.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm text-slate-800">{selectedChatStudent.n}</p>
                                    <p className="text-xs text-slate-400">{selectedChatStudent.e}</p>
                                  </div>
                                </div>
                                <div className="flex-1 p-4 bg-slate-50 space-y-3 overflow-y-auto">
                                  {chatMessages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                      <p className="text-sm text-slate-400">No messages yet. Say hello!</p>
                                    </div>
                                  ) : chatMessages.map((msg, i) => {
                                    const isMine = msg.senderId === counsellorProfile.id;
                                    return (
                                      <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                        <div className={`p-3 rounded-2xl max-w-xs text-sm ${isMine ? "bg-primary-600 text-white rounded-br-none" : "bg-white text-slate-700 rounded-bl-none shadow-soft border border-slate-100"}`}>
                                          {msg.content}
                                          <p className={`text-[10px] mt-1 ${isMine ? "text-primary-200" : "text-slate-400"}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  <div ref={chatEndRef} />
                                </div>
                                <div className="p-4 border-t border-slate-100 flex gap-2 bg-white">
                                  <input
                                    type="text"
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
                                    placeholder="Write a message..."
                                  />
                                  <button
                                    onClick={handleSendMessage}
                                    disabled={isSendingMsg || !chatInput.trim()}
                                    className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-5 rounded-xl font-semibold text-sm transition-colors"
                                  >
                                    {isSendingMsg ? "..." : "Send"}
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                                Select a student to start chatting
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                   );
                 case 'settings':
                   return (
                     <div className="space-y-6 max-w-3xl">
                       <div>
                         <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
                         <p className="text-slate-500 text-sm mt-0.5">Manage counsellor profile, contact info and security configuration settings.</p>
                       </div>

                       {/* Counsellor Profile Card */}
                       <div className="card-premium bg-white p-6 space-y-4">
                         <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">Professional Details</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-1">
                             <label className="text-xs font-semibold text-slate-600">Full Name</label>
                             <input type="text" value={counsellorProfile.name || ''} onChange={(e) => setCounsellorProfile({...counsellorProfile, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />
                           </div>
                           <div className="space-y-1">
                             <label className="text-xs font-semibold text-slate-600">Expertise / Specialization</label>
                             <input type="text" value={counsellorProfile.specialized || ''} onChange={(e) => setCounsellorProfile({...counsellorProfile, specialized: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />
                           </div>
                           <div className="space-y-1">
                             <label className="text-xs font-semibold text-slate-600">Email Address</label>
                             <input type="email" value={counsellorProfile.email || ''} onChange={(e) => setCounsellorProfile({...counsellorProfile, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />
                           </div>
                           <div className="space-y-1">
                             <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                             <input type="text" value={counsellorProfile.phone || ''} onChange={(e) => setCounsellorProfile({...counsellorProfile, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />
                           </div>
                         </div>
                         <button onClick={handleUpdateProfile} disabled={isUpdating} className={`bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-soft cursor-pointer duration-200 ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}>{isUpdating ? 'Updating...' : 'Update Profile'}</button>
                       </div>

                       {/* Security Settings Card */}
                       <div className="card-premium bg-white p-6 space-y-4">
                         <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">Security Settings</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="space-y-1">
                             <label className="text-xs font-semibold text-slate-600">Current Password</label>
                             <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
                           </div>
                           <div className="space-y-1">
                             <label className="text-xs font-semibold text-slate-600">New Password</label>
                             <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} placeholder="Set new" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
                           </div>
                           <div className="space-y-1">
                             <label className="text-xs font-semibold text-slate-600">Confirm Password</label>
                             <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} placeholder="Confirm new" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
                           </div>
                         </div>
                         <button onClick={handleUpdatePassword} disabled={isUpdatingPassword} className={`bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-soft cursor-pointer duration-200 ${isUpdatingPassword ? 'opacity-70 cursor-not-allowed' : ''}`}>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</button>
                       </div>
                     </div>
                   );
                 default:
                   return null;
               }
             })()}
             </motion.div>
          )}

           {/* Add / Edit Schedule Session Modal Dialog Overlay triggers setup layouts accurately sets */}
           {isScheduleModalOpen && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-5">
                    <h3 className="font-bold text-lg text-slate-800 border-b border-slate-50 pb-3">Schedule Live Session</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Select Student</label>
                          <select value={sessionFormData.student} onChange={e => setSessionFormData({...sessionFormData, student: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none">
                             {allStudentsForSchedule.map((s, i) => (
                                <option value={s.n} key={i}>{s.n}</option>
                             ))}
                          </select>
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Session Date</label>
                          <input type="date" value={sessionFormData.date} onChange={e => setSessionFormData({...sessionFormData, date: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Session Time</label>
                          <input type="time" value={sessionFormData.time} onChange={e => setSessionFormData({...sessionFormData, time: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Topic Details</label>
                          <select value={sessionFormData.topic} onChange={e => setSessionFormData({...sessionFormData, topic: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none">
                             <option value="Document Verification">Document Verification</option>
                             <option value="Choice Filling Advice">Choice Filling Advice</option>
                             <option value="Fee Payment Guidance">Fee Payment Guidance</option>
                             <option value="General Counselling Support">General Support</option>
                          </select>
                       </div>
                       <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-semibold text-slate-600">Meeting Link (Google Meet / Zoom)</label>
                          <input type="url" value={sessionFormData.url} onChange={e => setSessionFormData({...sessionFormData, url: e.target.value})} placeholder="e.g., https://meet.google.com/abc-defg-hij" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium" />
                       </div>
                    </div>
                    <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-slate-100">
                       <button onClick={() => setIsScheduleModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs duration-150">Cancel</button>
                       <button 
                          onClick={async () => {
                             if (!sessionFormData.date || !sessionFormData.time || !sessionFormData.url) {
                                setCustomAlert({ isOpen: true, t: 'Warning', m: 'Please fill all fields correctly.', tp: 'warning' });
                                return;
                             }
                             try {
                                 const matchedStudent = allStudentsForSchedule.find(s => s.n === sessionFormData.student);
                                 if (!matchedStudent) {
                                     showAlert("Oops: Please select a valid student from option menu: " + sessionFormData.student);
                                     return;
                                 }
                                
                                await sessionApi.create({
                                    counsellorId: counsellorProfile.id,
                                    studentId: matchedStudent.id,
                                    topic: sessionFormData.topic,
                                    date: sessionFormData.date,
                                    time: sessionFormData.time,
                                    url: sessionFormData.url
                                });

                                setCustomAlert({ isOpen: true, t: 'Success', m: `Session scheduled for ${sessionFormData.student} on ${sessionFormData.date} at ${sessionFormData.time}!`, tp: 'success' });
                                
                                 const resSessions = await sessionApi.getAll({ counsellorId: counsellorProfile.id });
                                 const mappedS = resSessions.data.map(s => ({
                                    id: s.id, studentId: s.studentId, n: s.student?.name || "Student", m: s.topic, s: `${s.date} ${s.time}`, url: s.url, status: s.status
                                 }));
                                 setSessionsList(mappedS);
                                 
                                 setStats([
                                    { t: 'Assigned Students', v: String(studentsList.length || 0), d: 'Total students registered', i: Users, c: 'bg-primary-50 text-primary-600' },
                                    { t: 'Sessions Scheduled', v: String(mappedS.length), d: `Upcoming: ${mappedS.length}`, i: Clock, c: 'bg-green-50 text-green-600' },
                                    { t: 'Query Support Requests', v: '0', d: 'Needs review response', i: MessageSquare, c: 'bg-amber-50 text-amber-600' }
                                 ]);
                             } catch (e) { showAlert("Create failed: " + e.message); console.error(e); }
                             
                             setIsScheduleModalOpen(false);
                          }} 
                         className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-soft duration-150"
                       >
                          Schedule Now
                       </button>
                    </div>
                 </motion.div>
              </div>
           )}
        </main>
        <AnimatePresence>
          {customAlert.isOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[999] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center">
                <div className={`p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center ${customAlert.tp === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                   {customAlert.tp === 'success' ? <div className="h-8 w-8 text-green-600 font-black text-2xl flex items-center justify-center">✓</div> : <ShieldAlert className="h-8 w-8 text-red-500" />}
                </div>
                <h3 className="font-bold text-lg text-slate-800">{customAlert.t}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{customAlert.m}</p>
                <div className="pt-2">
                  <button onClick={() => setCustomAlert({ ...customAlert, isOpen: false })} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs duration-150">Okay</button>
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