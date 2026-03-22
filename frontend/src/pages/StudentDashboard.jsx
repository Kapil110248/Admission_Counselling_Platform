import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Compass, Star, GraduationCap, Bell, Search,
  Menu, X, CheckSquare, Clock, ArrowRight, Settings, LogOut, ChevronRight, Award, MessageSquare, FileText
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { examApi, collegeApi, userApi, sessionApi, chatApi, scholarshipApi, packageApi, notificationApi, enquiryApi } from '../api';
import { useToast } from '../context/ToastContext';
import Preloader from '../components/Preloader';
import { io } from 'socket.io-client';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { showAlert } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(localStorage.getItem('studentTab') || 'overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [examsList, setExamsList] = useState([]);
  const [predictExam, setPredictExam] = useState('');
  const [predictRank, setPredictRank] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [studentProfile, setStudentProfile] = useState({ name: 'Student', email: '', phone: '', specialized: '', id: null });
  const [sessionsList, setSessionsList] = useState([]);
  const [collegesList, setCollegesList] = useState([]);
  const [counsellorsList, setCounsellorsList] = useState([]);
  const [scholarshipsList, setScholarshipsList] = useState([]);
  const [packagesList, setPackagesList] = useState([]);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [counsellorSearch, setCounsellorSearch] = useState('');
  const [enquiriesList, setEnquiriesList] = useState([]);

  // Chat state
  const [selectedChatCounsellor, setSelectedChatCounsellor] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const chatEndRef = useRef(null);

  // Settings state
  const [passwordDataS, setPasswordDataS] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isUpdatingS, setIsUpdatingS] = useState(false);
  const [isUpdatingPwdS, setIsUpdatingPwdS] = useState(false);

  // Mock Upgrade flow states triggers config trigger overlays dashboards configurations correctly framing securely responsibly appropriately loads setups framing datasets dashboards config thresholds benchmarks setups controllers safely accurately fully.
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPackageForUpgrade, setSelectedPackageForUpgrade] = useState(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);

  const [successPopup, setSuccessPopup] = useState({ isOpen: false, message: '' });
  const showSuccess = (msg) => {
    setSuccessPopup({ isOpen: true, message: msg });
    setTimeout(() => setSuccessPopup({ isOpen: false, message: '' }), 2500);
  };

  // Enquiry state
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedEnquiryCounsellor, setSelectedEnquiryCounsellor] = useState(null);
  const [enquirySubject, setEnquirySubject] = useState('');
  const [enquiryQuery, setEnquiryQuery] = useState('');
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);

  const socketRef = useRef(null);
  const selectedCounsellorRef = useRef(null);
  useEffect(() => { selectedCounsellorRef.current = selectedChatCounsellor; }, [selectedChatCounsellor]);

  // Track which tabs have already fetched data to avoid redundant API calls
  const loadedTabs = useRef(new Set());
  const studentIdRef = useRef(null);

  // Load profile ONCE on mount — always needed for the header
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const userObj = JSON.parse(userStr);
        studentIdRef.current = userObj.id;
        const profileRes = await userApi.getProfile(userObj.id);
        if (profileRes.data) setStudentProfile(profileRes.data);

        try {
          const notifs = await notificationApi.getAll(userObj.id);
          setNotifications(notifs.data);
        } catch (e) { console.error('Notifications load error', e); }
      } catch (e) { console.error('Profile load error:', e); }
    };
    loadProfile();
  }, []);

  const handleMarkAllRead = async () => {
    if (!studentIdRef.current) return;
    try {
      await notificationApi.markAllRead(studentIdRef.current);
      setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })));
    } catch (e) { console.error('Failed to mark read', e); }
  };

  const handleSubmitEnquiry = async () => {
    if (!enquirySubject.trim() || !enquiryQuery.trim()) {
      return showAlert('Please fill both subject and your query.');
    }

    setIsSubmittingEnquiry(true);
    try {
      await enquiryApi.create({
        studentId: studentProfile.id,
        counsellorId: selectedEnquiryCounsellor.id,
        subject: enquirySubject,
        query: enquiryQuery
      });
      showSuccess('Enquiry sent! You can chat directly in the Support Chat tab once the counsellor approves it.');
      setIsEnquiryModalOpen(false);
      setEnquirySubject('');
      setEnquiryQuery('');
    } catch (error) {
      showAlert(error.response?.data?.error || 'Failed to send enquiry.');
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  // Per-tab lazy loader — fires only when activeTab changes
  useEffect(() => {
    const tab = activeTab;
    if (loadedTabs.current.has(tab)) return; // already loaded, skip

    const fetchTabData = async () => {
      const userStr = localStorage.getItem('user');
      const userObj = userStr ? JSON.parse(userStr) : null;

      try {
        if (tab === 'overview') {
          // Overview needs: colleges count, sessions count, exams count
          const [resColleges, resExams] = await Promise.all([
            collegeApi.getAll(),
            examApi.getAll(),
          ]);
          setCollegesList(resColleges.data);
          setExamsList(resExams.data);
          if (userObj) {
            const resSessions = await sessionApi.getAll({ studentId: userObj.id });
            const mapped = resSessions.data.map(s => ({
              id: s.id, counsellorId: s.counsellorId,
              counsellorName: s.counsellor?.name || 'Counsellor',
              topic: s.topic, date: s.date, time: s.time, url: s.url, status: s.status,
            }));
            setSessionsList(mapped);
            if (mapped.length > 0 && !selectedChatCounsellor) {
              setSelectedChatCounsellor({ id: mapped[0].counsellorId, name: mapped[0].counsellorName });
            }
          }
        } else if (tab === 'explorer') {
          // College Explorer: fetch colleges if not already loaded
          if (collegesList.length === 0) {
            const res = await collegeApi.getAll();
            setCollegesList(res.data);
          }
        } else if (tab === 'predictor') {
          // Predictor: fetch exams if not already loaded
          if (examsList.length === 0) {
            const res = await examApi.getAll();
            setExamsList(res.data);
          }
        } else if (tab === 'guidance') {
          // Guidance: fetch all counsellors
          if (counsellorsList.length === 0) {
            const res = await userApi.getAll();
            const filtered = res.data.filter(u => u.role === 'Counsellor');
            setCounsellorsList(filtered);
          }
        } else if (tab === 'scholarships') {
          // Scholarships: fetch all from backend
          if (scholarshipsList.length === 0) {
            try {
              const res = await scholarshipApi.getAll();
              setScholarshipsList(res.data);
            } catch (err) {
              console.warn('Scholarship fetch failed, using fallback.');
              // Fallback to dummy data if backend isn't ready
              setScholarshipsList([
                { name: 'Counselling Excellence Scholarship', amount: 'Up to 100% Waiver', description: 'Based on merit scores and academic performance.' },
                { name: 'STEM Merits Grant Aid', amount: 'Flat ₹50,000 Support', description: 'Specialized STEM candidates with strong entrance scores.' },
                { name: 'Need-Based Aid Waiver', amount: 'Variable support', description: 'For students from economically weaker sections with good academics.' },
              ]);
            }
          }
        } else if (tab === 'vip') {
          if (packagesList.length === 0) {
            try {
              const res = await packageApi.getAll();
              setPackagesList(res.data);
            } catch (err) { console.warn('VIP Package load failed'); }
          }
        } else if (tab === 'enquiries') {
          if (userObj && enquiriesList.length === 0) {
            try {
              const res = await enquiryApi.getStudent(userObj.id);
              setEnquiriesList(res.data);
            } catch (err) { console.error('Failed to load enquiries', err); }
          }
        } else if (tab === 'chat') {
          let updatedSessions = sessionsList;
          if (userObj && sessionsList.length === 0) {
            const resSessions = await sessionApi.getAll({ studentId: userObj.id });
            const mapped = resSessions.data.map(s => ({
              id: s.id, counsellorId: s.counsellorId,
              counsellorName: s.counsellor?.name || 'Counsellor',
              topic: s.topic, date: s.date, time: s.time, url: s.url, status: s.status,
            }));
            setSessionsList(mapped);
            updatedSessions = mapped;
          }

          let updatedEnquiries = enquiriesList;
          if (userObj && enquiriesList.length === 0) {
            const resEnq = await enquiryApi.getStudent(userObj.id);
            setEnquiriesList(resEnq.data);
            updatedEnquiries = resEnq.data;
          }

          if (counsellorsList.length === 0) {
            const res = await userApi.getAll();
            const filtered = res.data.filter(u => u.role === 'Counsellor');
            setCounsellorsList(filtered);
          }

          if (!selectedChatCounsellor) {
            const sessionC = updatedSessions.map(s => ({ id: s.counsellorId, name: s.counsellorName }));
            const enqC = updatedEnquiries.filter(e => e.status === 'Approved').map(e => ({ id: e.counsellorId, name: e.counsellor?.name || 'Counsellor' }));
            const combined = [...sessionC, ...enqC];
            if (combined.length > 0) {
              setSelectedChatCounsellor(combined[0]);
            }
          }
        }
        // settings tab: profile is already loaded at mount, nothing extra needed
        loadedTabs.current.add(tab);
      } catch (e) { console.error(`Tab [${tab}] load error:`, e); }
    };

    fetchTabData();
  }, [activeTab]);

  // Load chat messages when counsellor is selected with real-time sync
  useEffect(() => {
    if (!selectedChatCounsellor || !studentProfile.id) return;

    chatApi.getMessages(studentProfile.id, selectedChatCounsellor.id)
      .then(res => {
        setChatMessages(res.data);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      })
      .catch(() => setChatMessages([]));
  }, [selectedChatCounsellor, studentProfile.id]);

  useEffect(() => {
    if (studentProfile.id) {
      const socket = io('http://localhost:5000');
      socketRef.current = socket;
      socket.emit('join_room', studentProfile.id);

      socket.on('receive_message', (data) => {
        if (selectedCounsellorRef.current?.id === data.senderId) {
          setChatMessages(prev => [...prev, data]);
          setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        }
      });

      return () => socket.disconnect();
    }
  }, [studentProfile.id]);

  const handleSendStudentMessage = async () => {
    if (!chatInput.trim() || !selectedChatCounsellor || !studentProfile.id) return;
    const content = chatInput.trim();
    setChatInput('');
    setIsSendingMsg(true);
    try {
      const res = await chatApi.sendMessage({
        senderId: studentProfile.id,
        receiverId: selectedChatCounsellor.id,
        content
      });
      setChatMessages(prev => [...prev, res.data]);
      socketRef.current?.emit('send_message', { senderId: studentProfile.id, receiverId: selectedChatCounsellor.id, content, createdAt: new Date() });
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (e) { console.error('Send failed:', e); }
    finally { setIsSendingMsg(false); }
  };

  const handleUpdateStudentProfile = async () => {
    try {
      setIsUpdatingS(true);
      await userApi.update(studentProfile.id, {
        name: studentProfile.name,
        email: studentProfile.email,
        phone: studentProfile.phone
      });
      const userStr = localStorage.getItem('user');
      if (userStr) {
        localStorage.setItem('user', JSON.stringify({
          ...JSON.parse(userStr),
          name: studentProfile.name,
          email: studentProfile.email
        }));
      }
      showSuccess('Profile updated successfully!');
    } catch (e) { showAlert('Failed to update profile.'); }
    finally { setIsUpdatingS(false); }
  };

  const handleUpdateStudentPassword = async () => {
    if (!passwordDataS.currentPassword || !passwordDataS.newPassword) return showAlert('Please fill all fields');
    if (passwordDataS.newPassword !== passwordDataS.confirmPassword) return showAlert('Passwords do not match');
    try {
      setIsUpdatingPwdS(true);
      await userApi.changePassword({
        id: studentProfile.id,
        currentPassword: passwordDataS.currentPassword,
        newPassword: passwordDataS.newPassword
      });
      showSuccess('Password updated successfully!');
      setPasswordDataS({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) { showAlert(e.response?.data?.error || 'Failed to update password.'); }
    finally { setIsUpdatingPwdS(false); }
  };

  // Derive unique counsellors from sessions AND approved enquiries
  const sessionCounsellors = sessionsList.map(s => ({ id: s.counsellorId, name: s.counsellorName }));
  const approvedEnquiryCounsellors = enquiriesList
    .filter(e => e.status === 'Approved')
    .map(e => ({ id: e.counsellorId, name: e.counsellor?.name || 'Counsellor' }));

  const displayCounsellors = [...new Map(
    [...sessionCounsellors, ...approvedEnquiryCounsellors].map(c => [c.id, c])
  ).values()];

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setIsNotificationsOpen(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    localStorage.setItem('studentTab', tab);
    setActiveTab(tab);
    setTimeout(() => setIsLoading(false), 600);
  };

  const chartData = [
    { name: 'NEET', match: 85, threshold: 90 },
    { name: 'JEE', match: 62, threshold: 75 },
    { name: 'CUET', match: 95, threshold: 85 },
  ];

  const pieData = [
    { name: 'Completed', value: 3, color: '#3d63ff' },
    { name: 'Pending', value: 2, color: '#adc2ff' },
    { name: 'Missed', value: 1, color: '#fca5a5' },
  ];

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'explorer', icon: Compass, label: 'College Explorer' },
    { id: 'predictor', icon: Star, label: 'Predictor' },
    { id: 'guidance', icon: Star, label: 'Career Guidance' },
    { id: 'scholarships', icon: GraduationCap, label: 'Scholarships' },
    { id: 'vip', icon: Star, label: 'VIP Package' },
    { id: 'enquiries', icon: FileText, label: 'My Enquiries' },
    { id: 'chat', icon: MessageSquare, label: 'Support Chat' },
  ];

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
                <button
                  onClick={() => handleTabChange('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'settings' ? 'bg-primary-50 text-primary-600 border border-primary-100/50 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Settings className={`h-5 w-5 ${activeTab === 'settings' ? 'text-primary-600' : 'text-slate-400'}`} />
                  Settings
                </button>
                <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 group transition-colors">
                  <LogOut className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-10 relative">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><Menu className="h-5 w-5" /></button>
            )}
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 gap-2 w-72">
              <Search className="h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search colleges, exams..." className="bg-transparent border-0 focus:outline-none text-sm w-full" />
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
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg border-2 border-primary-200">
                {studentProfile.name?.charAt(0) || 'S'}
              </div>
              <div className="hidden md:block text-left">
                <p className="font-bold text-sm text-slate-800">{studentProfile.name}</p>
                <p className="text-xs text-slate-500">Student Profile</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.15, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute w-16 h-16 rounded-full bg-primary-200" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 border-[3px] border-slate-200 border-t-primary-600 rounded-full" />
              </div>
              <p className="font-bold text-slate-700 text-sm mt-4 tracking-wide animate-pulse">Loading {activeTab.replace('-', ' ')}...</p>
            </div>
          ) : (
            (() => {
              switch (activeTab) {
                case 'overview':
                  return (
                    <>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                          <h1 className="text-2xl font-bold text-slate-900">Welcome Back, {studentProfile.name}!</h1>
                          <p className="text-slate-500 text-sm mt-0.5">Here is your admission tracking summary overview.</p>
                        </div>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-soft text-sm flex items-center gap-2 transition duration-300">
                          <Compass className="h-4 w-4" /> Start Prediction
                        </button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        {[
                          { t: 'Available Colleges', v: String(collegesList.length || 0), d: 'Colleges in database', i: Compass, c: 'bg-primary-50 text-primary-600' },
                          { t: 'My Sessions', v: String(sessionsList.length || 0), d: `Scheduled: ${sessionsList.length}`, i: Clock, c: 'bg-green-50 text-green-600' },
                          { t: 'Available Exams', v: String(examsList.length || 0), d: 'Active exams to apply', i: CheckSquare, c: 'bg-amber-50 text-amber-600' },
                        ].map((m, i) => (
                          <div className="card-premium flex items-center justify-between" key={i}>
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

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 card-premium">
                          <h3 className="font-bold text-slate-800 mb-6">Aggregate match analytics</h3>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="match" fill="#3d63ff" radius={[8, 8, 0, 0]} name="Match Rate (%)" />
                                <Bar dataKey="threshold" fill="#e0ebff" radius={[8, 8, 0, 0]} name="Aggregate Threshold" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="card-premium flex flex-col justify-between">
                          <h3 className="font-bold text-slate-800 mb-4">Steps Completion</h3>
                          <div className="h-[200px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-600 mt-2">
                            {pieData.map((p, i) => (
                              <div className="flex items-center gap-1.5" key={i}>
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></div>
                                <span>{p.name} ({p.value})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="card-premium">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800">Available Recommendations</h3>
                            <button className="text-primary-600 text-xs font-semibold flex items-center gap-1">View All <ChevronRight className="h-3 w-3" /></button>
                          </div>
                          <div className="space-y-3">
                            {collegesList.slice(0, 2).map((c, id) => (
                              <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 duration-200" key={id}>
                                <div className="flex justify-between">
                                  <h4 className="font-bold text-sm text-slate-800">{c.name}</h4>
                                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">High Match</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{c.location}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="card-premium bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full filter blur-xl"></div>
                          <div>
                            <span className="bg-yellow-400 text-slate-900 font-bold px-2 py-0.5 rounded text-[10px]">EXCLUSIVE</span>
                            <h3 className="text-xl font-bold mt-2">Upgrade to VIP Package Counselling</h3>
                            <p className="text-white/70 text-xs mt-1 leading-relaxed max-w-sm">Unlock personalized filters with interactive matrices tracking now.</p>
                          </div>
                          <div className="mt-8">
                            <button className="bg-white text-slate-900 font-bold px-4 py-2.5 rounded-xl shadow-soft text-sm flex items-center gap-2 hover:bg-slate-50 duration-200">
                              Get VIP package <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  );

                case 'sessions':
                  return (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Sessions</h1>
                        <p className="text-slate-500 text-sm mt-0.5">All your scheduled counselling sessions.</p>
                      </div>
                      {sessionsList.length === 0 ? (
                        <div className="card-premium bg-white flex flex-col items-center justify-center py-20 text-center">
                          <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-4">
                            <Clock className="h-8 w-8" />
                          </div>
                          <h3 className="font-bold text-slate-800">No Sessions Scheduled Yet</h3>
                          <p className="text-xs text-slate-400 mt-1 max-w-xs">Your counsellor will schedule sessions for you. Check back soon.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {sessionsList.map((s, i) => (
                            <div key={s.id || i} className="card-premium bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="bg-primary-50 text-primary-600 p-3 rounded-2xl">
                                  <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800">{s.topic}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">Counsellor: {s.counsellorName}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">{s.date} at {s.time}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${s.status === 'Completed' ? 'bg-green-50 text-green-600' :
                                  s.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                    'bg-primary-50 text-primary-600'
                                  }`}>{s.status}</span>
                                {s.url && (
                                  <a href={s.url} target="_blank" rel="noreferrer" className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2 rounded-xl duration-150 flex items-center gap-1">
                                    Join Meeting <ArrowRight className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );

                case 'explorer':
                  return (
                    <div className="space-y-6">
                      <h1 className="text-2xl font-bold text-slate-900">College Explorer</h1>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={collegeSearch}
                          onChange={e => setCollegeSearch(e.target.value)}
                          placeholder="Search by college name, location..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 shadow-soft"
                        />
                        <button className="btn-primary">Search</button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {collegesList
                          .filter(c => !collegeSearch || c.name.toLowerCase().includes(collegeSearch.toLowerCase()) || (c.location || '').toLowerCase().includes(collegeSearch.toLowerCase()))
                          .map((c, i) => (
                            <div className="card-premium flex justify-between items-start" key={i}>
                              <div>
                                <span className="bg-primary-50 text-primary-600 px-2.5 py-1 rounded-md text-xs font-bold">
                                  {c.nirfRank ? `NIRF #${c.nirfRank}` : 'College'}
                                </span>
                                <h3 className="text-lg font-bold text-slate-800 mt-2">{c.name}</h3>
                                <p className="text-slate-500 text-xs">{c.location}</p>
                                {c.fees && <p className="text-xs text-primary-600 font-semibold mt-1">Fees: {c.fees}</p>}
                              </div>
                              <div className="text-right">
                                {c.website ? (
                                  <a href={c.website} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl block hover:bg-primary-100">Visit</a>
                                ) : (
                                  <span className="text-xs text-slate-400">No website</span>
                                )}
                              </div>
                            </div>
                          ))}
                        {collegesList.filter(c => !collegeSearch || c.name.toLowerCase().includes(collegeSearch.toLowerCase())).length === 0 && (
                          <p className="text-slate-400 text-sm col-span-2 text-center py-8">No colleges found.</p>
                        )}
                      </div>
                    </div>
                  );

                case 'settings':
                  return (
                    <div className="space-y-6 max-w-3xl">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Manage academic details, contact information, and security preferences.</p>
                      </div>
                      <div className="card-premium bg-white space-y-5">
                        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">Personal Details</h3>
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                          <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-2xl border-2 border-primary-200">
                            {studentProfile.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">{studentProfile.name}</h4>
                            <p className="text-xs text-slate-400">{studentProfile.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                            <input type="text" value={studentProfile.name || ''} onChange={e => setStudentProfile({ ...studentProfile, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                            <input type="email" value={studentProfile.email || ''} onChange={e => setStudentProfile({ ...studentProfile, email: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                            <input type="text" value={studentProfile.phone || ''} onChange={e => setStudentProfile({ ...studentProfile, phone: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm font-medium" />
                          </div>
                        </div>
                        <button
                          onClick={handleUpdateStudentProfile}
                          disabled={isUpdatingS}
                          className={`bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-soft cursor-pointer duration-200 ${isUpdatingS ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {isUpdatingS ? 'Saving...' : 'Save Profile'}
                        </button>
                      </div>
                      <div className="card-premium bg-white p-6 space-y-4">
                        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">Security Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password</label>
                            <input type="password" value={passwordDataS.currentPassword} onChange={e => setPasswordDataS({ ...passwordDataS, currentPassword: e.target.value })} placeholder="Current password" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                            <input type="password" value={passwordDataS.newPassword} onChange={e => setPasswordDataS({ ...passwordDataS, newPassword: e.target.value })} placeholder="Set new" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                            <input type="password" value={passwordDataS.confirmPassword} onChange={e => setPasswordDataS({ ...passwordDataS, confirmPassword: e.target.value })} placeholder="Confirm" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm" />
                          </div>
                        </div>
                        <button
                          onClick={handleUpdateStudentPassword}
                          disabled={isUpdatingPwdS}
                          className={`bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-soft cursor-pointer duration-200 ${isUpdatingPwdS ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {isUpdatingPwdS ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  );

                case 'predictor':
                  return (
                    <div className="space-y-6">
                      <h1 className="text-2xl font-bold text-slate-900">Advanced Rank Predictor</h1>
                      <div className="card-premium grid md:grid-cols-1 gap-6 bg-white/50 backdrop-blur-sm">
                        <div className="grid md:grid-cols-3 gap-4 items-end">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Exam</label>
                            <select value={predictExam} onChange={e => setPredictExam(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700">
                              <option value="">Choose Exam...</option>
                              {examsList.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expected Score / Rank</label>
                            <input type="text" value={predictRank} onChange={e => setPredictRank(e.target.value)} placeholder="e.g., 25000" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700" />
                          </div>
                          <button
                            onClick={async () => {
                              if (!predictRank || !predictExam) { showAlert('Please enter both details.'); return; }
                              setIsPredicting(true);
                              try {
                                const res = await collegeApi.predict({ rank: parseInt(predictRank), examId: parseInt(predictExam), category: 'General' });
                                setPredictions(res.data);
                              } catch (err) { showAlert('Prediction failed.'); }
                              setIsPredicting(false);
                            }}
                            className="btn-primary w-full h-[48px] cursor-pointer"
                          >
                            {isPredicting ? 'Analyzing...' : 'Predict Colleges'}
                          </button>
                        </div>
                        <div className="border-t border-slate-100 pt-6">
                          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-primary-600" /> Match Projections</h4>
                          <div className="overflow-x-auto custom-scrollbar shadow-inner rounded-2xl border border-slate-100 bg-white">
                            <table className="w-full text-sm min-w-[600px]">
                              <thead>
                                <tr className="border-b border-slate-100">
                                  <th className="text-left py-3 px-4 text-slate-500 font-medium whitespace-nowrap">College Name</th>
                                  <th className="text-left py-3 px-4 text-slate-500 font-medium whitespace-nowrap">Branch</th>
                                  <th className="text-left py-3 px-4 text-slate-500 font-medium whitespace-nowrap">Closing Rank</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {predictions.map((p, idx) => (
                                  <tr key={idx}>
                                    <td className="py-4 px-4 font-semibold text-slate-800 whitespace-nowrap">{p.college.name}</td>
                                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">{p.branch}</td>
                                    <td className="py-4 px-4 text-green-600 font-bold whitespace-nowrap">{p.closingRank}</td>
                                  </tr>
                                ))}
                                {predictions.length === 0 && (
                                  <tr><td colSpan="3" className="py-4 text-center text-slate-400 text-xs">Enter your rank above and click Predict Colleges.</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                case 'guidance':
                  return (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <h1 className="text-2xl font-bold text-slate-900">Mentorship & Guidance</h1>
                          <p className="text-slate-500 text-sm mt-1">Connect with verified certified career counsellors for personalized sessions.</p>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 md:max-w-[40%]">
                          <span className="bg-indigo-200 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">i</span>
                          Send an Enquiry to an expert. Once approved, you will permanently unlock direct Support Chat access with them!
                        </div>
                      </div>
                      {/* Expertise Search Bar */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search for an exam (e.g., NEET) or subject expertise..."
                          value={counsellorSearch}
                          onChange={(e) => setCounsellorSearch(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 shadow-soft"
                        />
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {counsellorsList.length === 0 ? (
                          <div className="col-span-2 py-20 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400 text-sm">No counsellors available at the moment.</p>
                          </div>
                        ) : (() => {
                          const filtered = counsellorsList.filter(c => {
                            if (!counsellorSearch) return true;
                            const query = counsellorSearch.toLowerCase();
                            return (c.name && c.name.toLowerCase().includes(query)) ||
                              (c.specialized && c.specialized.toLowerCase().includes(query));
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="col-span-2 py-10 text-center bg-white/50 rounded-2xl border border-slate-100">
                                <p className="text-slate-500 text-sm">No counsellors found matching "{counsellorSearch}".</p>
                              </div>
                            );
                          }

                          return filtered.map((c, i) => (
                            <div className="card-premium flex items-center justify-between" key={c.id || i}>
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 min-w-[56px] rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
                                  {c.name?.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="text-base font-bold text-slate-800">{c.name}</h3>
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {c.specialized ? c.specialized.split(/[,]+/).map((tag, idx) => (
                                      <span key={idx} className="bg-primary-50 text-primary-600 border border-primary-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                        {tag.trim()}
                                      </span>
                                    )) : (
                                      <span className="bg-primary-50 text-primary-600 border border-primary-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                        Admissions Expert
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedEnquiryCounsellor({ id: c.id, name: c.name });
                                  setIsEnquiryModalOpen(true);
                                }}
                                className="text-xs font-semibold text-primary-600 bg-primary-50 px-4 py-2 rounded-xl hover:bg-primary-100 duration-200 cursor-pointer shrink-0 ml-2"
                              >
                                Send Enquiry
                              </button>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  );

                case 'scholarships':
                  return (
                    <div className="space-y-6">
                      <h1 className="text-2xl font-bold text-slate-900">Scholarships & Grant Aid</h1>
                      <div className="grid md:grid-cols-3 gap-6">
                        {scholarshipsList.map((c, i) => (
                          <div className="card-premium h-full flex flex-col justify-between" key={c.id || i}>
                            <div>
                              <div className="bg-primary-50 text-primary-600 p-3 rounded-2xl w-fit"><GraduationCap className="h-6 w-6" /></div>
                              <h3 className="text-sm font-bold text-slate-800 mt-4 leading-snug">{c.name}</h3>
                              <p className="text-primary-600 font-bold text-xs mt-1">{c.amount}</p>
                              <p className="text-slate-500 text-xs mt-2 leading-relaxed">{c.description}</p>
                            </div>
                            {c.officialUrl ? (
                              <a
                                href={c.officialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-primary-600 flex items-center gap-1 mt-4 hover:text-primary-800 transition-colors duration-150"
                              >
                                Apply Now <ArrowRight className="h-3 w-3" />
                              </a>
                            ) : (
                              <button
                                onClick={() => showAlert('Application link coming soon for: ' + c.name)}
                                className="text-xs font-semibold text-primary-600 flex items-center gap-1 mt-4 hover:text-primary-800 transition-colors duration-150"
                              >
                                Apply Now <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                case 'vip':
                  return (
                    <div className="space-y-6">
                      <h1 className="text-2xl font-bold text-slate-900">VIP Package Comparison</h1>
                      <div className="grid md:grid-cols-3 gap-6">
                        {packagesList.map((c, i) => (
                          <div className={`card-premium h-full flex flex-col justify-between border-2 ${c.isFeatured ? 'border-primary-500 shadow-glow bg-gradient-to-br from-white to-primary-50/20' : 'border-slate-100'}`} key={c.id || i}>
                            <div>
                              {c.isFeatured && <span className="bg-primary-500 text-white font-bold px-2.5 py-1 rounded-md text-[10px]">BEST VALUE</span>}
                              <h3 className="text-base font-bold text-slate-800 mt-2">{c.name} Package</h3>
                              <p className="text-lg font-bold text-slate-900 mt-1">{c.price}</p>
                              <ul className="space-y-2 mt-4">
                                {(Array.isArray(c.benefits) ? c.benefits : JSON.parse(c.benefits || '[]')).map((b, idx) => (
                                  <li className="flex items-start gap-1.5 text-slate-500 text-xs leading-relaxed" key={idx}><CheckSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> {b}</li>
                                ))}
                              </ul>
                            </div>
                            <button
                              onClick={() => {
                                if (studentProfile.currentPlan === c.name) return;
                                setSelectedPackageForUpgrade(c);
                                setIsUpgradeModalOpen(true);
                              }}
                              disabled={studentProfile.currentPlan === c.name}
                              className={`w-full mt-6 py-2.5 text-xs font-semibold rounded-xl duration-200 ${studentProfile.currentPlan === c.name
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : c.isFeatured
                                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                              {studentProfile.currentPlan === c.name ? 'Current Plan' : c.actionText}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                case 'enquiries':
                  return (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Enquiries</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Track the status of your queries sent to career counsellors.</p>
                      </div>
                      {enquiriesList.length === 0 ? (
                        <div className="card-premium bg-white flex flex-col items-center justify-center py-20 text-center">
                          <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-4">
                            <FileText className="h-8 w-8" />
                          </div>
                          <h3 className="font-bold text-slate-800">No Enquiries Found</h3>
                          <p className="text-xs text-slate-400 mt-1 max-w-xs">You haven't sent any queries yet. Explore the Career Guidance section to connect with a counsellor.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {enquiriesList.map((enq, i) => (
                            <div key={enq.id || i} className="card-premium bg-white flex flex-col items-start gap-4">
                              <div className="flex w-full justify-between items-start border-b border-slate-50 pb-4">
                                <div>
                                  <h3 className="font-bold text-slate-800 text-base">{enq.subject}</h3>
                                  <p className="text-xs text-slate-500 mt-1">
                                    To: <span className="font-semibold">{enq.counsellor?.name || 'Assigned Counsellor'}</span> • {new Date(enq.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${enq.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                  enq.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                    'bg-amber-50 text-amber-600'
                                  }`}>
                                  {enq.status || 'Pending'}
                                </span>
                              </div>
                              <div className="w-full">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Query Details</h4>
                                <p className="text-sm text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">{enq.query}</p>
                              </div>
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
                        <p className="text-slate-500 text-sm mt-0.5">Directly message your assigned counsellor for resolving doubts.</p>
                      </div>
                      {displayCounsellors.length === 0 ? (
                        <div className="card-premium bg-white flex flex-col items-center justify-center py-20 px-6 text-center max-w-2xl mx-auto border border-slate-100 shadow-soft">
                          <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-5">
                            <MessageSquare className="h-10 w-10" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">How to Unlock Support Chat</h3>
                          <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-md mx-auto">
                            To ensure the highest quality of mentorship responses, chat is restricted to assigned sessions and approved enquiries. Follow these steps to connect:
                          </p>

                          <div className="grid md:grid-cols-3 gap-6 w-full text-left relative z-10">
                            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl h-full shadow-sm hover:shadow-md transition-shadow">
                              <span className="bg-slate-200 text-slate-700 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-3">1</span>
                              <h4 className="font-bold text-slate-800 text-sm">Find an Expert</h4>
                              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Go to the Career Guidance tab and browse our list of verified counsellors.</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl h-full shadow-sm hover:shadow-md transition-shadow">
                              <span className="bg-slate-200 text-slate-700 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-3">2</span>
                              <h4 className="font-bold text-slate-800 text-sm">Send Enquiry</h4>
                              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Submit your academic details and briefly describe what you need help with.</p>
                            </div>
                            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl h-full shadow-[0_0_15px_rgba(99,102,241,0.15)] relative transform md:scale-105 duration-200">
                              <span className="bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-3 shadow-sm">3</span>
                              <h4 className="font-bold text-indigo-900 text-sm">Chat Unlocked</h4>
                              <p className="text-xs text-indigo-700 mt-1.5 leading-relaxed">Once they approve your request, you can message them directly here at any time!</p>
                            </div>
                          </div>
                          <button onClick={() => handleTabChange('guidance')} className="mt-10 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-[0_4px_12px_rgba(37,99,235,0.25)] flex items-center gap-2">
                            Get Started Now <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="card-premium bg-white h-[500px] border border-slate-100 rounded-2xl overflow-hidden flex flex-row shadow-soft">
                          {/* Left Sidebar: Counsellors List */}
                          <div className="w-1/3 border-r border-slate-100 flex flex-col h-full bg-slate-50/10">
                            <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm">Counsellors</div>
                            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                              {displayCounsellors.map((c, i) => (
                                <button
                                  key={c.id || i}
                                  onClick={() => { setSelectedChatCounsellor(c); setChatMessages([]); }}
                                  className={`w-full p-4 flex items-center gap-3 text-left hover:bg-slate-50 duration-150 ${selectedChatCounsellor?.id === c.id ? 'bg-primary-50/50 border-l-4 border-primary-500' : ''}`}
                                >
                                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                                    {c.name?.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-800 text-sm">{c.name}</p>
                                    <p className="text-[10px] text-slate-400">{c.specialized || 'General Counsellor'}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Right Column: Chat Box */}
                          <div className="flex-1 flex flex-col h-full bg-white">
                            {/* Counsellor header bar */}
                            {selectedChatCounsellor && (
                              <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                    {selectedChatCounsellor.name?.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                      {selectedChatCounsellor.name}
                                      <span className="bg-green-500 w-1.5 h-1.5 rounded-full inline-block ml-1"></span>
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium">Your Assigned Counsellor</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* Messages */}
                            <div className="flex-1 p-4 bg-slate-50/50 space-y-4 overflow-y-auto">
                              {chatMessages.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                  <p className="text-sm text-slate-400">No messages yet. Say hello!</p>
                                </div>
                              ) : chatMessages.map((msg, i) => {
                                const isMine = msg.senderId === studentProfile.id;
                                return (
                                  <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3.5 rounded-2xl max-w-sm text-sm ${isMine ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none shadow-soft border border-slate-100/50'}`}>
                                      {msg.content}
                                      <p className={`text-[10px] text-right mt-1 ${isMine ? 'text-primary-200' : 'text-slate-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                              <div ref={chatEndRef} />
                            </div>
                            {/* Input bar */}
                            <div className="p-4 border-t border-slate-50 flex gap-2 bg-white">
                              <input
                                type="text"
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendStudentMessage()}
                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm font-medium"
                                placeholder={selectedChatCounsellor ? `Message ${selectedChatCounsellor.name}...` : 'Select a counsellor to chat'}
                              />
                              <button
                                onClick={handleSendStudentMessage}
                                disabled={isSendingMsg || !chatInput.trim() || !selectedChatCounsellor}
                                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-5 rounded-xl font-bold text-xs duration-150 shadow-soft cursor-pointer"
                              >
                                {isSendingMsg ? '...' : 'Send'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );

                default:
                  return (
                    <div className="card-premium flex flex-col items-center justify-center text-center py-20 bg-white/50 backdrop-blur-sm">
                      <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-4 animate-float">
                        <Compass className="h-8 w-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h2>
                      <p className="text-slate-500 max-w-sm mt-1 text-sm leading-relaxed">This section is coming soon with more features.</p>
                      <button className="btn-primary mt-6 text-sm px-5 py-2.5">Back to Dashboard</button>
                    </div>
                  );
              }
            })()
          )}
          <AnimatePresence>
            {successPopup.isOpen && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-3 max-w-xs w-full border border-slate-100/50">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 animate-bounce">
                    <CheckSquare className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">Success!</h3>
                  <p className="text-slate-500 text-sm font-medium">{successPopup.message}</p>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isEnquiryModalOpen && selectedEnquiryCounsellor && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[999] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Counselling Enquiry</h3>
                    <button onClick={() => setIsEnquiryModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full duration-200">
                      <X className="h-5 w-5 text-slate-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Counsellor</label>
                      <div className="bg-primary-50 px-4 py-3 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center font-bold text-sm">
                          {selectedEnquiryCounsellor.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700">{selectedEnquiryCounsellor.name}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Subject / Goal</label>
                      <input
                        type="text"
                        placeholder="e.g., NEET UG Preparation, Engineering Branch Selection"
                        value={enquirySubject}
                        onChange={(e) => setEnquirySubject(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Detailed Query</label>
                      <textarea
                        rows="4"
                        placeholder="Describe what you want to discuss with the counsellor..."
                        value={enquiryQuery}
                        onChange={(e) => setEnquiryQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 shadow-inner resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setIsEnquiryModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 duration-200">
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitEnquiry}
                      disabled={isSubmittingEnquiry}
                      className="flex-1 py-3 text-sm font-bold text-white bg-primary-600 rounded-2xl hover:bg-primary-700 duration-200 shadow-soft disabled:opacity-50"
                    >
                      {isSubmittingEnquiry ? 'Sending...' : 'Submit Request'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isUpgradeModalOpen && selectedPackageForUpgrade && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[999] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center">
                  <div className="p-4 rounded-full mx-auto w-16 h-16 bg-primary-50 flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary-600 animate-bounce" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">Complete Upgrade</h3>
                  <p className="text-slate-500 text-sm">You are upgrading to the <span className="font-bold text-primary-600">{selectedPackageForUpgrade.name}</span> package.</p>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-400">Total Amount</p>
                    <p className="text-xl font-bold text-slate-900">{selectedPackageForUpgrade.price}</p>
                  </div>

                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <button onClick={() => setIsUpgradeModalOpen(false)} disabled={isProcessingUpgrade} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs duration-150">Cancel</button>
                    <button
                      onClick={async () => {
                        setIsProcessingUpgrade(true);
                        try {
                          await userApi.upgradePlan({ id: studentProfile.id, plan: selectedPackageForUpgrade.name });
                          setStudentProfile(prev => ({ ...prev, currentPlan: selectedPackageForUpgrade.name }));
                          setIsUpgradeModalOpen(false);
                          showAlert('Upgrade Successful! You are now a ' + selectedPackageForUpgrade.name + ' user.');
                        } catch (e) { console.error(e); showAlert('Upgrade failed.'); }
                        finally { setIsProcessingUpgrade(false); }
                      }}
                      disabled={isProcessingUpgrade}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-soft duration-150 flex items-center justify-center"
                    >
                      {isProcessingUpgrade ? 'Processing...' : 'Pay & Upgrade'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
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
        </main>
      </div>
    </div>
  );
}
