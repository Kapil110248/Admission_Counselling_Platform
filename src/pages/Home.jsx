import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, CheckCircle2, Award, Zap, ArrowRight, 
  Lock, ArrowUpRight, GraduationCap, ChevronRight,
  TrendingUp, Star, LayoutDashboard, Compass, Users, Globe, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full bg-[#f8fbff] text-slate-900">
      {/* 1. Header Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-md border-b border-slate-100 shadow-glass py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary-600" />
            <span className="font-bold text-xl tracking-tight">Edu<span className="text-primary-600">Guide</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#home" className="hover:text-primary-600 transition">Home</a>
            <a href="#exams" className="hover:text-primary-600 transition">Exams</a>
            <a href="#predictor" className="hover:text-primary-600 transition">Predictor</a>
            <a href="#counselling" className="hover:text-primary-600 transition">Counselling</a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login"
              className="text-slate-600 font-medium hover:text-primary-600 transition"
            >
              Login
            </Link>
            <Link to="/student-dashboard" className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-soft hover:shadow-glow transform hover:scale-[1.02] transition duration-300">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
          <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full mb-6 text-primary-700 font-medium text-sm">
              <Star className="h-4 w-4 fill-current text-primary-500" /> 
              #1 Ranked Career Counselling SaaS
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-6">
              Navigate Your <span className="gradient-text">Dream Career</span> With AI Predictors
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-md">
              Get data-backed predictions for rank cutoffs, top college suggestions, and comprehensive personalized admission assistance.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/exam/neet" className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3.5 rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-soft hover:shadow-glow">
                Explore Exams <ChevronRight className="h-5 w-5" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-6 py-3.5 rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-soft">
                Free Counselling
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block relative"
          >
            <div className="glass p-4 rounded-3xl relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-37bc4c472850?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Student studying" 
                className="rounded-2xl shadow-md filter brightness-[0.98]"
              />
              {/* Overlapping Badges */}
              <div className="absolute top-10 left-[-40px] bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4 animate-float">
                <div className="bg-green-50 p-3 rounded-xl"><TrendingUp className="h-6 w-6 text-green-600" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">98% Match Rate</p>
                  <p className="font-bold text-slate-800 text-sm">Predictive Accuracy</p>
                </div>
              </div>

              <div className="absolute bottom-10 right-[-20px] bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4" style={{ animationDelay: '1.5s' }}>
                <div className="bg-primary-50 p-3 rounded-xl"><Award className="h-6 w-6 text-primary-600" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Top Colleges</p>
                  <p className="font-bold text-slate-800 text-sm">IIT | AIIMS | NIT</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. VIP Highlight (Offer Card) */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-3xl p-8 shadow-glow flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-white text-center md:text-left flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <Zap className="h-8 w-8 text-yellow-300 fill-current" />
            </div>
            <div>
              <div className="bg-white/20 text-xs px-2.5 py-1 rounded-full inline-block font-semibold mb-2">LIMITED OFFER</div>
              <h3 className="text-2xl font-bold">Flat 30% OFF on VIP Career Counselling</h3>
              <p className="text-white/80">Get 1:1 mentorship from top admission officers with exclusive predictions.</p>
            </div>
          </div>
          <button className="bg-white text-primary-700 font-bold px-6 py-3.5 rounded-xl shadow-soft hover:bg-slate-50 transition min-w-[160px]">
            Claim Offer
          </button>
        </motion.div>
      </section>

      {/* 4. Scholarship Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-50 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-gradient-to-br from-indigo-500 to-primary-600 p-4 rounded-2xl text-white shadow-soft">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider">ANNUAL INITIATIVE</span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Admission Master Counselling Institute Scholarship</h3>
              <p className="text-slate-500 text-sm mt-1">Provide waiving financial aid for matching merit scores thresholds accurately.</p>
            </div>
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 rounded-xl shadow-soft flex items-center gap-2 transition duration-200 relative z-10">
            Apply Now <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </section>

      {/* 5 & 6. College Predictor Segment */}
      <section id="predictor" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">College Predictor <span className="text-primary-600">(FREE)</span></h2>
          <p className="text-slate-600">Enter your expected ranking details to discover potential match institutes.</p>
        </div>

        <div className="card-premium grid md:grid-cols-1 gap-6 mb-8 max-w-4xl mx-auto bg-white/50 backdrop-blur-sm">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Exam</label>
              <select 
                value={exam} 
                onChange={e => setExam(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700"
              >
                <option value="">Choose your exam...</option>
                <option value="neet">NEET UG</option>
                <option value="jee">JEE Main</option>
                <option value="cuet">CUET</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expected Rank</label>
              <input 
                type="text" 
                placeholder="e.g., 25000" 
                value={rank} 
                onChange={e => setRank(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700"
              />
            </div>
            <button className="btn-primary w-full h-[48px]">Predict Colleges</button>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="font-semibold text-slate-700 mb-4">Initial Projections</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 text-slate-500 font-medium text-sm">College Name</th>
                    <th className="text-left py-3 text-slate-500 font-medium text-sm">Type</th>
                    <th className="text-left py-3 text-slate-500 font-medium text-sm">Cutoff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 font-semibold text-slate-800">New Delhi Medical Institute</td>
                    <td className="py-4 text-slate-600">Government</td>
                    <td className="py-4 text-green-600 font-medium">95.4%</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-semibold text-slate-800">State Medical College</td>
                    <td className="py-4 text-slate-600">Government</td>
                    <td className="py-4 text-green-600 font-medium">92.1%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Advanced Predictor Locked Preview Overlay */}
          <div className="relative border-t border-slate-100 pt-6 mt-4">
            <div className="absolute inset-x-0 bottom-0 top-0 backdrop-blur-md bg-white/40 z-10 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-primary-600 p-3 rounded-full text-white mb-4 shadow-glow">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Unlock Premium Insights</h3>
              <p className="text-slate-600 text-sm max-w-md mb-4">View exact admission probabilities (%), dynamic filtering based on budgeting/locations, and AI accurate suggestions.</p>
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-soft flex items-center gap-2">
                Unlock Full Predictor <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="opacity-30 filter blur-sm">
                <p className="font-bold text-slate-800">AI Component Analysis Row</p>
                <div className="h-32 bg-slate-100 rounded-xl mt-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Popular Exams Card Grid */}
      <section id="exams" className="max-w-7xl mx-auto px-6 py-16 bg-slate-50 border-y border-slate-100">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Popular Entrance Exams</h2>
          <p className="text-slate-600">Master counselling insights for top domain certifications across India.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { id: 'neet', title: 'NEET UG', count: '100+ Colleges', color: 'bg-red-50 text-red-600 border-red-100' },
            { id: 'jee', title: 'JEE Main', count: '300+ Colleges', color: 'bg-blue-50 text-blue-600 border-blue-100' },
            { id: 'cuet', title: 'CUET', count: '150+ Colleges', color: 'bg-purple-50 text-purple-600 border-purple-100' },
            { id: 'clat', title: 'CLAT', count: '50+ Law Schools', color: 'bg-orange-50 text-orange-600 border-orange-100' },
          ].map((item, idx) => (
            <Link to={`/exam/${item.id}`} key={idx}>
              <motion.div 
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl border bg-white shadow-soft hover:shadow-xl transition-all duration-300 relative group cursor-pointer`}
              >
                <div className={`p-4 rounded-xl ${item.color} w-fit font-bold text-xl mb-4`}>
                  {item.title.split(' ')[0]}
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500 flex items-center gap-2">
                   {item.count} <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all font-bold" />
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. VIP Counselling Benefits Card (Cards view) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6">Experience Premium Counselling Ecosystem</h2>
            
            <div className="space-y-6">
              {[
                { icon: Compass, t: 'Guaranteed Personalized Strategy', d: 'Get mapping analytics based on academic history to reduce admission anxiety.' },
                { icon: LayoutDashboard, t: 'Live Admission Tracker Dashboard', d: 'Get accurate dates schedules trackers, deadlines management without data missing.' },
                { icon: Users, t: 'Professional Verified Counselling Support', d: 'Our network are strict verification standard certified experienced masters.' },
              ].map((b, i) => (
                <div className="flex gap-4" key={i}>
                  <div className="bg-primary-50 p-3 rounded-xl h-fit border border-primary-100">
                    <b.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">{b.t}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{b.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-8 rounded-3xl grid grid-cols-2 gap-6 bg-white/40">
            <div className="card-premium h-full">
              <Globe className="h-8 w-8 text-indigo-600 mb-4" />
              <h4 className="font-bold text-slate-800 mb-2">Pan India Scale</h4>
              <p className="text-xs text-slate-500">Connecting over 25 states domains network accurately.</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} className="card-premium h-full bg-gradient-to-br from-primary-600 to-indigo-600 text-white border-none shadow-glow">
              <Star className="h-8 w-8 text-yellow-300 mb-4 fill-current" />
              <h4 className="font-bold mb-2">9.5/10 Star Rating</h4>
              <p className="text-xs text-white/80">Reviews trusted from thousands successful placements candidates tier 1.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 text-white text-center py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 filter blur-[100px] opacity-10">
          <div className="absolute inset-0 bg-primary-600 animate-pulse"></div>
        </div>
        <div className="max-w-xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-4">Start Securing Your Future Benchmarks today</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">Let AI data projections simplify stressful decisions within minutes perfectly.</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-soft hover:shadow-glow transform hover:scale-[1.02] transition">Get Free Counselling session</button>
        </div>
      </section>

    </div>
  );
}
