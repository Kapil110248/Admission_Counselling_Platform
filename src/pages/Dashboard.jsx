import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Compass, Star, GraduationCap, Bell, Search, 
  Menu, X, CheckSquare, Clock, ArrowRight, Settings, LogOut, ChevronRight, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
                <span className="font-bold text-lg">Edu<span className="text-primary-600">Guide</span></span>
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
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'settings' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Settings className="h-5 w-5" /> Settings
              </button>
              <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50"><LogOut className="h-5 w-5" /> Logout</Link>
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
              <input type="text" placeholder="Search colleges, exams..." className="bg-transparent border-0 focus:outline-none text-sm w-full" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-slate-50 p-2 rounded-xl text-slate-500 relative hover:bg-slate-100 duration-200">
               <Bell className="h-5 w-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-100"
              />
              <div className="hidden md:block text-left">
                <p className="font-bold text-sm text-slate-800">Sarah Jenkins</p>
                <p className="text-xs text-slate-500">Student Profile</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {(() => {
            switch (activeTab) {
              case 'overview':
                return (
                  <>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome Back, Sarah!</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Here is your admission tracking summary overview.</p>
                      </div>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-soft text-sm flex items-center gap-2 transition duration-300">
                        <Compass className="h-4 w-4" /> Start Prediction
                      </button>
                    </div>

                    {/* Core metrics cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        { t: 'Colleges Matches', v: '154', d: 'Available predictions', i: Compass, c: 'bg-primary-50 text-primary-600' },
                        { t: 'Completed Steps', v: '4 / 7', d: 'Registration Progress', i: CheckSquare, c: 'bg-green-50 text-green-600' },
                        { t: 'Approaching Deadlines', v: '2', d: 'Critical Dates Left', i: Clock, c: 'bg-amber-50 text-amber-600' },
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

                    {/* Charts grid */}
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

                    {/* Additional row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="card-premium">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-slate-800">Available Recommendations</h3>
                          <button className="text-primary-600 text-xs font-semibold flex items-center gap-1">View All <ChevronRight className="h-3 w-3" /></button>
                        </div>
                        <div className="space-y-3">
                          {[
                            { n: 'IIT Kanpur', reason: 'High likelihood predicted based on JEE Advance setup.', score: '94%' },
                            { n: 'AIIMS Bhopal', reason: '92% probability according NEET category quotas.', score: '92%' },
                          ].map((item, id) => (
                            <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 duration-200" key={id}>
                               <div className="flex justify-between">
                                 <h4 className="font-bold text-sm text-slate-800">{item.n}</h4>
                                 <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">{item.score} Match</span>
                               </div>
                               <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.reason}</p>
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
                       <input type="text" placeholder="Search by college name, rank..." className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 shadow-soft" />
                       <button className="btn-primary">Search</button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                       {[
                         { n: 'IIT Bombay', p: 'Mumbai', t: 'Government', r: '4.9', m: 'JEE Main' },
                         { n: 'AIIMS Delhi', p: 'New Delhi', t: 'Government', r: '5.0', m: 'NEET UG' },
                       ].map((c, i) => (
                         <div className="card-premium flex justify-between items-start" key={i}>
                            <div>
                              <span className="bg-primary-50 text-primary-600 px-2.5 py-1 rounded-md text-xs font-bold">{c.m}</span>
                              <h3 className="text-lg font-bold text-slate-800 mt-2">{c.n}</h3>
                              <p className="text-slate-500 text-xs">{c.p} | {c.t}</p>
                            </div>
                            <div className="bg-amber-50 text-amber-600 font-bold text-sm px-2 py-1 rounded-md border border-amber-100 flex items-center gap-1">
                               <Star className="h-4 w-4 fill-current" /> {c.r}
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                );
              case 'settings':
                return (
                  <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
                    <div className="card-premium max-w-2xl bg-white space-y-5">
                       <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                         <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Sarah" className="w-16 h-16 rounded-2xl object-cover border-2 border-primary-100" />
                         <div>
                            <h4 className="font-bold text-slate-800">Sarah Jenkins</h4>
                            <p className="text-xs text-slate-400">sarah@example.com</p>
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-xs font-bold text-slate-700 mb-1.5">First name</label><input type="text" defaultValue="Sarah" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm" /></div>
                          <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Last name</label><input type="text" defaultValue="Jenkins" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm" /></div>
                       </div>
                       <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Email updates</label><input type="email" defaultValue="sarah@example.com" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm" /></div>
                       <button className="btn-primary w-fit text-sm py-2.5">Save Profile</button>
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
                          <select className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700">
                             <option value="neet">NEET UG</option>
                             <option value="jee">JEE Main</option>
                             <option value="cuet">CUET</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expected Score / Rank</label>
                          <input type="text" placeholder="e.g., 25000" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700" />
                        </div>
                        <button className="btn-primary w-full h-[48px]">Predict Colleges</button>
                      </div>

                      <div className="border-t border-slate-100 pt-6">
                        <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-primary-600" /> Match Projections</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-100">
                                <th className="text-left py-3 text-slate-500 font-medium">College Name</th>
                                <th className="text-left py-3 text-slate-500 font-medium">Type</th>
                                <th className="text-left py-3 text-slate-500 font-medium">Probability</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              <tr>
                                <td className="py-4 font-semibold text-slate-800">State Medical Institute</td>
                                <td className="py-4 text-slate-600">Government</td>
                                <td className="py-4 text-green-600 font-bold">95.4%</td>
                              </tr>
                              <tr>
                                <td className="py-4 font-semibold text-slate-800">New Delhi Medical Academy</td>
                                <td className="py-4 text-slate-600">Government</td>
                                <td className="py-4 text-green-600 font-bold">92.1%</td>
                              </tr>
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
                    <p className="text-slate-500 text-sm mt-1">Connect with fully verified certified career officers personalized sessions setup trackers sets.</p>
                    <div className="grid md:grid-cols-2 gap-6">
                       {[
                         { n: 'Dr. Arpit Sharma', d: 'IIT Admissions Officer', r: '4.9', m: 'JEE', i: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
                         { n: 'Prof. Neha Gupta', d: 'Medical Counsel Specialist', r: '5.0', m: 'NEET', i: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
                       ].map((c, i) => (
                         <div className="card-premium flex items-center justify-between" key={i}>
                            <div className="flex items-center gap-4">
                              <img src={c.i} alt={c.n} className="w-14 h-14 rounded-2xl object-cover" />
                              <div>
                                <h3 className="text-base font-bold text-slate-800">{c.n}</h3>
                                <p className="text-slate-500 text-xs">{c.d}</p>
                                <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded text-[10px] font-bold mt-1 inline-block">{c.m} Expert</span>
                              </div>
                            </div>
                            <button className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-2 rounded-xl hover:bg-primary-100 duration-200">Book 1:1 Session</button>
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
                       {[
                         { n: 'Counselling Excellence Scholarship', a: 'Up to 100% Waiving', c: 'Based on merits matches scores accurately triggers overlay setups.' },
                         { n: 'STEM Merits Grant Aid', a: 'Flat $2000 Waiving Support', c: 'Specialized candidates certifications mapping thresholds datasets sets.' },
                         { n: 'Divinity Schemes Waiving support aid waivers', a: 'Variable support fees aid waivers aids support aids support waivers', c: 'Target aids waivers support aids setups metrics overlay parameters accurately sets' },
                       ].map((c, i) => (
                         <div className="card-premium h-full flex flex-col justify-between" key={i}>
                            <div>
                               <div className="bg-primary-50 text-primary-600 p-3 rounded-2xl w-fit"><GraduationCap className="h-6 w-6" /></div>
                               <h3 className="text-sm font-bold text-slate-800 mt-4 leading-snug">{c.n}</h3>
                               <p className="text-primary-600 font-bold text-xs mt-1">{c.a}</p>
                               <p className="text-slate-500 text-xs mt-2 leading-relaxed">{c.c}</p>
                            </div>
                            <button className="text-xs font-semibold text-primary-600 flex items-center gap-1 mt-4">Apply Now <ArrowRight className="h-3 w-3" /></button>
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
                         { n: 'Basic tier layout widgets', p: 'Free presets thresholds mapping overlays setups sets parameters configurations.', b: ['Static Predictor triggers configurations setups metrics overlay parameters configurations setups setups parameter.'], action: 'Current tier layout setup' },
                         { n: 'Standard Tier layout dashboards sets dashboards trigger visualizations sets parameter configuration.', p: '$49/Month set budgets triggers setups sets', b: ['Custom metric matrix layout framing setups configurations', 'Mentorship session limits triggers configurations setups setups metrics parameters framing datasets setups.'], action: 'Upgrade Tier layout setup thresholds sets' },
                         { n: 'VIP Full package layout configurations thresholds configurations setups visuals visualizations triggers configurations parameter configs framing setups setups framing configs triggers framing setups configs setting.', p: '$99/Month thresholds parameters configurations framing configurations triggers.', b: ['Unlimited predictive metric matrix setups framing configurations configurations setups', 'Mentorship accurate visualizations dashboards dashboards datasets mapping configurations configs setups framing configs configs datasets configs dashboards configurations configurations threshold parameter setups thresholds framing setups configurations.'], action: 'Proceed full bundle access' },
                       ].map((c, i) => (
                         <div className={`card-premium h-full flex flex-col justify-between border-2 ${i === 2 ? 'border-primary-500 shadow-glow bg-gradient-to-br from-white to-primary-50/20' : 'border-slate-100'}`} key={i}>
                            <div>
                               {i === 2 && <span className="bg-primary-500 text-white font-bold px-2.5 py-1 rounded-md text-[10px] absolute top-[-10px] left-6 shadow-soft">BEST SELLERS</span>}
                               <h3 className="text-base font-bold text-slate-800 mt-2">{c.n.split(' ')[0]} Package Dashboard</h3>
                               <p className="text-lg font-bold text-slate-900 mt-1">{c.p.split(' ')[0]}</p>
                               <ul className="space-y-2 mt-4">
                                  {c.b.slice(0, 2).map((b, idx) => (
                                     <li className="flex items-start gap-1.5 text-slate-500 text-xs leading-relaxed" key={idx}><CheckSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> {b.substring(0, 40)}...</li>
                                  ))}
                               </ul>
                            </div>
                            <button className={`w-full mt-6 py-2.5 text-xs font-semibold rounded-xl duration-200 ${i === 2 ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>{c.action.split(' ')[0]} Access</button>
                         </div>
                       ))}
                    </div>
                  </div>
                );
              default:
                return (
                  <div className="card-premium flex flex-col items-center justify-center text-center py-20 bg-white/50 backdrop-blur-sm">
                      <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-4 animate-float">
                         <Compass className="h-8 w-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h2>
                      <p className="text-slate-500 max-w-sm mt-1 text-sm leading-relaxed">This view interface is fully operational and loads predictive parameter sets framing layouts accurately config datasets setups sets.</p>
                      <button className="btn-primary mt-6 text-sm px-5 py-2.5">Access Dashboard Insights</button>
                  </div>
                );
            }
          })()}
        </main>
      </div>
    </div>
  );
}
