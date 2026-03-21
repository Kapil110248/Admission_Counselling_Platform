import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Compass, Star, GraduationCap, Bell, Search, 
  Menu, X, CheckSquare, Clock, ArrowRight, Settings, LogOut, ChevronRight, Award, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { examApi, collegeApi, userApi, sessionApi, chatApi } from '../api';
import Preloader from '../components/Preloader';

export default function StudentDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(localStorage.getItem('studentTab') || 'overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
  const [collegeSearch, setCollegeSearch] = useState('');

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
      } catch (e) { console.error('Profile load error:', e); }
    };
    loadProfile();
  }, []);

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
        } else if (tab === 'chat') {
          // Chat: fetch sessions to get assigned counsellors
          if (userObj && sessionsList.length === 0) {
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
        }
        // settings tab: profile is already loaded at mount, nothing extra needed
        loadedTabs.current.add(tab);
      } catch (e) { console.error(`Tab [${tab}] load error:`, e); }
    };

    fetchTabData();
  }, [activeTab]);

  // Load chat messages when counsellor is selected
  useEffect(() => {
    if (!selectedChatCounsellor || !studentProfile.id) return;
    chatApi.getMessages(studentProfile.id, selectedChatCounsellor.id)
      .then(res => {
        setChatMessages(res.data);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      })
      .catch(() => setChatMessages([]));
  }, [selectedChatCounsellor, studentProfile.id]);

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
      alert('Profile updated successfully!');
    } catch (e) { alert('Failed to update profile.'); }
    finally { setIsUpdatingS(false); }
  };

  const handleUpdateStudentPassword = async () => {
    if (!passwordDataS.currentPassword || !passwordDataS.newPassword) return alert('Please fill all fields');
    if (passwordDataS.newPassword !== passwordDataS.confirmPassword) return alert('Passwords do not match');
    try {
      setIsUpdatingPwdS(true);
      await userApi.changePassword({
        id: studentProfile.id,
        currentPassword: passwordDataS.currentPassword,
        newPassword: passwordDataS.newPassword
      });
      alert('Password updated successfully!');
      setPasswordDataS({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) { alert(e.response?.data?.error || 'Failed to update password.'); }
    finally { setIsUpdatingPwdS(false); }
  };

  // Derive unique counsellors from sessions
  const assignedCounsellors = [...new Map(
    sessionsList.map(s => [s.counsellorId, { id: s.counsellorId, name: s.counsellorName }])
  ).values()];

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setIsNotificationsOpen(false);
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
    { id: 'chat', icon: MessageSquare, label: 'Support Chat' },
  ];

  return (
    <div className="flex h-screen bg-[#f3f6fc] overflow-hidden">
      {/* Sidebar */}
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
                <span className="font-bold text-lg">Edu<span className="text-primary-600">Guide</span></span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500"><X className="h-5 w-5" /></button>
            </div>
            <nav className="p-4 flex-1 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === item.id ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-50 space-y-1">
              <button
                onClick={() => handleTabChange('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'settings' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Settings className="h-5 w-5" /> Settings
              </button>
              <Link to="/login" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50"><LogOut className="h-5 w-5" /> Logout</Link>
            </div>
          </motion.div>
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
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 p-4 space-y-2"
                >
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                    <span className="text-xs text-primary-600 font-semibold cursor-pointer">Mark all</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 border border-slate-50 rounded-xl hover:bg-slate-50 duration-150 cursor-pointer">
                      <p className="font-bold text-slate-800 text-xs">New Session Scheduled</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Your session with Counsellor is scheduled. Check Sessions tab.</p>
                    </div>
                    <div className="p-2.5 border border-slate-50 rounded-xl hover:bg-slate-50 duration-150 cursor-pointer">
                      <p className="font-bold text-slate-800 text-xs">College Rank Update</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">New colleges have been added to your predictor list.</p>
                    </div>
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
            <Preloader />
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
                            <input type="text" value={studentProfile.name || ''} onChange={e => setStudentProfile({...studentProfile, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                            <input type="email" value={studentProfile.email || ''} onChange={e => setStudentProfile({...studentProfile, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                            <input type="text" value={studentProfile.phone || ''} onChange={e => setStudentProfile({...studentProfile, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm font-medium" />
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
                            <input type="password" value={passwordDataS.currentPassword} onChange={e => setPasswordDataS({...passwordDataS, currentPassword: e.target.value})} placeholder="Current password" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                            <input type="password" value={passwordDataS.newPassword} onChange={e => setPasswordDataS({...passwordDataS, newPassword: e.target.value})} placeholder="Set new" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                            <input type="password" value={passwordDataS.confirmPassword} onChange={e => setPasswordDataS({...passwordDataS, confirmPassword: e.target.value})} placeholder="Confirm" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm" />
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
                              if (!predictRank || !predictExam) { alert('Please enter both details.'); return; }
                              setIsPredicting(true);
                              try {
                                const res = await collegeApi.predict({ rank: parseInt(predictRank), examId: parseInt(predictExam), category: 'General' });
                                setPredictions(res.data);
                              } catch (err) { alert('Prediction failed.'); }
                              setIsPredicting(false);
                            }}
                            className="btn-primary w-full h-[48px] cursor-pointer"
                          >
                            {isPredicting ? 'Analyzing...' : 'Predict Colleges'}
                          </button>
                        </div>
                        <div className="border-t border-slate-100 pt-6">
                          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-primary-600" /> Match Projections</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-slate-100">
                                  <th className="text-left py-3 text-slate-500 font-medium">College Name</th>
                                  <th className="text-left py-3 text-slate-500 font-medium">Branch</th>
                                  <th className="text-left py-3 text-slate-500 font-medium">Closing Rank</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {predictions.map((p, idx) => (
                                  <tr key={idx}>
                                    <td className="py-4 font-semibold text-slate-800">{p.college.name}</td>
                                    <td className="py-4 text-slate-600">{p.branch}</td>
                                    <td className="py-4 text-green-600 font-bold">{p.closingRank}</td>
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
                      <h1 className="text-2xl font-bold text-slate-900">Mentorship & Guidance</h1>
                      <p className="text-slate-500 text-sm mt-1">Connect with fully verified certified career counsellors for personalized sessions.</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        {counsellorsList.length === 0 ? (
                          <div className="col-span-2 py-20 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200">
                             <p className="text-slate-400 text-sm">No counsellors available at the moment.</p>
                          </div>
                        ) : counsellorsList.map((c, i) => (
                          <div className="card-premium flex items-center justify-between" key={c.id || i}>
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl overflow-hidden">
                                {c.name?.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-base font-bold text-slate-800">{c.name}</h3>
                                <p className="text-slate-500 text-xs">{c.specialized || 'Admissions Expert'}</p>
                                <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded text-[10px] font-bold mt-1 inline-block">
                                  {c.specialized?.split(' ')[0] || 'Top'} Expert
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                setActiveTab('chat');
                                setSelectedChatCounsellor({ id: c.id, name: c.name });
                              }}
                              className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-2 rounded-xl hover:bg-primary-100 duration-200 cursor-pointer"
                            >
                              Book 1:1 Session
                            </button>
                          </div>
                        ))}
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
                            <button className="text-xs font-semibold text-primary-600 flex items-center gap-1 mt-4 cursor-pointer">Apply Now <ArrowRight className="h-3 w-3" /></button>
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
                        {[
                          { n: 'Basic', p: 'Free', b: ['Static Predictor access', 'College Explorer access'], action: 'Current Plan' },
                          { n: 'Standard', p: '₹499/Month', b: ['Custom rank prediction', 'Mentorship sessions (2/month)'], action: 'Upgrade Now' },
                          { n: 'VIP Full', p: '₹999/Month', b: ['Unlimited predictions', 'Unlimited mentorship sessions', 'Priority counsellor access'], action: 'Get VIP Access' },
                        ].map((c, i) => (
                          <div className={`card-premium h-full flex flex-col justify-between border-2 ${i === 2 ? 'border-primary-500 shadow-glow bg-gradient-to-br from-white to-primary-50/20' : 'border-slate-100'}`} key={i}>
                            <div>
                              {i === 2 && <span className="bg-primary-500 text-white font-bold px-2.5 py-1 rounded-md text-[10px]">BEST VALUE</span>}
                              <h3 className="text-base font-bold text-slate-800 mt-2">{c.n} Package</h3>
                              <p className="text-lg font-bold text-slate-900 mt-1">{c.p}</p>
                              <ul className="space-y-2 mt-4">
                                {c.b.map((b, idx) => (
                                  <li className="flex items-start gap-1.5 text-slate-500 text-xs leading-relaxed" key={idx}><CheckSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> {b}</li>
                                ))}
                              </ul>
                            </div>
                            <button className={`w-full mt-6 py-2.5 text-xs font-semibold rounded-xl duration-200 ${i === 2 ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>{c.action}</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                case 'chat':
                  return (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900">Support Chat</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Directly message your assigned counsellor for resolving doubts.</p>
                      </div>
                      {sessionsList.length === 0 ? (
                        <div className="card-premium bg-white flex flex-col items-center justify-center py-16 text-center">
                          <p className="text-slate-500 font-semibold">No counsellor assigned yet</p>
                          <p className="text-xs text-slate-400 mt-1">Your counsellor will be assigned once you have a scheduled session.</p>
                        </div>
                      ) : (
                        <div className="card-premium bg-white h-[500px] border border-slate-100 rounded-2xl overflow-hidden flex flex-col shadow-soft">
                          {/* Counsellor selector tabs if multiple */}
                          {assignedCounsellors.length > 1 && (
                            <div className="p-3 border-b border-slate-100 flex gap-2 overflow-x-auto">
                              {assignedCounsellors.map((c, i) => (
                                <button
                                  key={i}
                                  onClick={() => { setSelectedChatCounsellor(c); setChatMessages([]); }}
                                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${selectedChatCounsellor?.id === c.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                                >
                                  {c.name}
                                </button>
                              ))}
                            </div>
                          )}
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
        </main>
      </div>
    </div>
  );
}
