import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle2, Award, Zap, ArrowRight,
  Lock, ArrowUpRight, GraduationCap, ChevronRight,
  TrendingUp, Star, LayoutDashboard, Compass, Users, Globe, X
} from 'lucide-react';
import { examApi, collegeApi } from '../api';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const navigate = useNavigate();
  const { showAlert } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [intervalRate, setIntervalRate] = useState(3000);
  const [isPredictorLocked, setIsPredictorLocked] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const heroImages = [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  const [examsList, setExamsList] = useState([]);

  useEffect(() => {
    const loadExams = async () => {
      try { const res = await examApi.getAll(); setExamsList(res.data); } catch (e) { }
    };
    loadExams();
  }, []);

  const handlePredict = async () => {
    if (!exam || !rank) {
      showAlert('Please select an Exam and enter Expected Rank details!');
      return;
    }

    setIsPredicting(true);
    setPredictions([]);

    try {
      const res = await collegeApi.predict({ rank: parseInt(rank), examId: parseInt(exam), category: 'General' });
      const mapped = res.data.map(item => ({
        name: `${item.college.name} (${item.branch})`,
        type: 'Listed',
        cutoff: item.closingRank
      }));
      setPredictions(mapped);
    } catch (e) {
      showAlert('Prediction failed setups thresholds data framing.');
    }
    setIsPredicting(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const movingDown = window.scrollY > lastScrollY;
      if (movingDown && window.scrollY > 100) {
        setShowNavbar(false); // Scrolling Down -> Hide
      } else {
        setShowNavbar(true);  // Scrolling Up -> Show
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg(prev => (prev === 4 - 1 ? 0 : prev + 1));
    }, intervalRate);
    return () => clearInterval(timer);
  }, [intervalRate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const floatVariants = {
    animate: { y: [0, -15, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
  };

  return (
    <div className="relative w-full bg-[#f4f7fb] text-slate-900 overflow-x-hidden">
      {/* 1. Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${showNavbar ? 'translate-y-0' : '-translate-y-full'} ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100/80 shadow-glass py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 cursor-pointer group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 shadow-glow duration-300 group-hover:rotate-12 transform">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Edu<span className="text-primary-600">Guide</span></span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600 text-sm">
            {['Home', 'Exams', 'Predictors', 'Mentorship'].map((item, id) => (
              <motion.a key={id} href={`#${item.toLowerCase()}`} className="hover:text-primary-600 transition duration-300 relative group">
                {item}
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary-600 duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 font-bold text-sm hover:text-primary-600 transition">Sign In</Link>
            <Link to="/login" className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:shadow-cyan text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-soft duration-300 transform hover:scale-[1.03]">Sign Up</Link>
          </motion.div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section id="home" className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-20 right-10 w-[400px] h-[400px] bg-primary-200/40 rounded-full mix-blend-multiply filter blur-3xl" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute top-40 left-10 w-[350px] h-[350px] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute top-[-10%] left-[50%] transform translate-x-[-50%] w-full h-[600px] bg-gradient-to-b from-primary-50/50 to-transparent"></div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-100/50 px-3.5 py-1.5 rounded-full text-primary-700 font-bold text-xs shadow-soft">
              <Star className="h-4 w-4 fill-current text-primary-500" /> #1 Ranked Career Counselling SaaS
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
              Navigate Your <br /><span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Dream Career</span> <br />With AI Predictors
            </motion.h1>
            <motion.p variants={itemVariants} className="text-base text-slate-500 max-w-md leading-relaxed">
              Get data-backed predictions for rank cutoffs, top college suggestions, and comprehensive personalized admission assistance flawlessly.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
              <Link to="/exam/neet" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold px-6 py-3.5 rounded-2xl duration-300 transform hover:scale-[1.03] shadow-glow items-center group">
                Explore Exams <ChevronRight className="h-4 w-4 duration-200 group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-white border border-slate-100 text-slate-700 hover:bg-slate-50 font-bold px-6 py-3.5 rounded-2xl duration-300 shadow-soft">Free Counselling</Link>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="hidden md:block relative">
            <motion.div variants={floatVariants} animate="animate" className="glass p-4 rounded-3xl relative backdrop-blur-md bg-white/40 border-slate-200/60 shadow-glass">
              <div
                className="relative overflow-hidden rounded-2xl h-[380px] cursor-pointer"
                onMouseEnter={() => setIntervalRate(100)}
                onMouseLeave={() => setIntervalRate(3000)}
              >
                <AnimatePresence mode="wait">
                  <motion.img key={currentImg} src={heroImages[currentImg]} initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }} transition={{ duration: intervalRate === 100 ? 0 : 0.4 }} alt="Student life" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
                </AnimatePresence>
              </div>
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="absolute top-10 left-[-40px] bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="bg-green-100 p-2.5 rounded-xl"><TrendingUp className="h-5 w-5 text-green-600" /></div>
                <div><p className="text-[10px] text-slate-400 font-bold">98% MATCH RATE</p><p className="font-extrabold text-slate-800 text-sm">Predictive Accuracy</p></div>
              </motion.div>
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="absolute bottom-10 right-[-20px] bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="bg-primary-100 p-2.5 rounded-xl"><Award className="h-5 w-5 text-primary-600" /></div>
                <div><p className="text-[10px] text-slate-400 font-bold">TOP COLLEGES</p><p className="font-extrabold text-slate-800 text-sm">IIT | AIIMS | NIT</p></div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2.5 Trust Stats indicators section setups thresholds framing layouts accurate */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-white border border-slate-100/80 rounded-3xl p-8 shadow-soft flex flex-wrap justify-around gap-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white -z-10" />
          {[
            { v: '25,000+', t: 'Students Guided', c: 'border-primary-500' },
            { v: '500+', t: 'Verified Mentors', c: 'border-green-500' },
            { v: '98.4%', t: 'Success Prediction', c: 'border-indigo-500' },
            { v: '2,000+', t: 'Top Colleges', c: 'border-amber-500' }
          ].map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.15 }} viewport={{ once: true }} className="flex flex-col items-center">
              <h3 className={`text-4xl font-black text-slate-900 border-b-4 ${item.c} inline-block pb-1 tracking-tight`}>{item.v}</h3>
              <p className="text-slate-500 font-extrabold text-[11px] mt-2 tracking-wide uppercase">{item.t}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2.6 User Pathway Segmentation Grid (Mindler style) */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">DISCOVER PATHWAYS</span>
          <h2 className="text-3xl font-black text-slate-900 mt-2 mb-3">Comprehensive Decision Support</h2>
          <p className="text-slate-500 text-sm">Targeted guidance built for every milestone dashboard framing accuracy.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: 'For Class 11-12th', d: 'Targeted competitive tracking setups cutoff analytics setups thresholds predictors.', i: Award, c: 'bg-primary-50 text-primary-600' },
            { t: 'College Students', d: 'Secure premium advice aggregate thresholds counseling placements frameworks.', i: GraduationCap, c: 'bg-indigo-50 text-indigo-600' },
            { t: 'For Parents Guidance', d: 'Gain visibility datasets framing aggregate benchmarks triggers framing dashboards.', i: Compass, c: 'bg-green-50 text-green-600' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate('/login')}
              className="bg-white border border-slate-100 p-6 rounded-3xl shadow-soft hover:shadow-xl duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className={`p-3.5 rounded-2xl w-fit ${item.c} shadow-sm group-hover:rotate-6 duration-300`}><item.i className="h-6 w-6" /></div>
                <h4 className="font-extrabold text-slate-800 text-base mt-4 mb-2">{item.t}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.d}</p>
              </div>
              <p className="text-xs text-primary-600 font-bold mt-5 flex items-center gap-1">Explore Support <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 duration-200" /></p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. VIP Offer Card */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div whileHover={{ scale: 1.01 }} className="bg-gradient-to-r from-primary-600 via-indigo-600 to-indigo-800 rounded-3xl p-8 shadow-glow flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-10 filter blur-3xl rounded-3xl"></div>
          <div className="text-white flex items-center gap-4 relative z-10">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md shadow-inner border border-white/20"><Zap className="h-7 w-7 text-yellow-300 fill-current animate-pulse" /></div>
            <div>
              <div className="bg-white/20 text-[10px] px-2.5 py-1 rounded-full inline-block font-bold mb-1.5">LIMITED OFFER</div>
              <h3 className="text-xl md:text-2xl font-black">Flat 30% OFF on VIP Career Counselling</h3>
              <p className="text-white/80 text-sm mt-0.5">Get 1:1 mentorship from top admission officers with exclusive predictions.</p>
            </div>
          </div>
          <button onClick={() => navigate('/login')} className="bg-white hover:bg-slate-50 text-indigo-800 font-bold px-6 py-3 rounded-2xl shadow-soft duration-300 relative z-10 text-sm min-w-[140px] transform hover:translate-y-[-2px]">Claim Offer</button>
        </motion.div>
      </section>

      {/* 4. Scholarship Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden group hover:shadow-lg duration-300">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 group-hover:scale-110 duration-500"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-gradient-to-br from-indigo-500 to-primary-600 p-4 rounded-2xl text-white shadow-glow group-hover:rotate-6 duration-300"><GraduationCap className="h-7 w-7" /></div>
            <div><span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-[10px] font-bold">ANNUAL INITIATIVE</span><h3 className="text-lg font-black text-slate-800 mt-1.5">Admission Master Counselling Institute Scholarship</h3><p className="text-slate-500 text-xs mt-0.5 max-w-md">Provide waiving financial aid for matching merit scores thresholds accurately.</p></div>
          </div>
          <button onClick={() => setIsAlertOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-soft flex items-center gap-2 duration-200 relative z-10 transform hover:scale-[1.02]">Apply Now <ArrowRight className="h-4 w-4" /></button>
        </motion.div>
      </section>

      {/* 5. Predictor Segment */}
      <section id="predictors" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-bold">AI TOOLBOX</span>
          <h2 className="text-3xl font-black text-slate-900 mt-2 mb-3">College Predictor <span className="text-primary-600">(FREE)</span></h2>
          <p className="text-slate-500 text-sm">Enter your expected ranking details to discover potential match institutes.</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-premium max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-slate-100 shadow-glass space-y-6">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Select Exam</label><select value={exam} onChange={e => setExam(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-bold text-slate-700 text-sm"><option value="">Choose your exam...</option>
              {examsList.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
            </select></div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Expected Rank</label><input type="text" placeholder="e.g., 25000" value={rank} onChange={e => setRank(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-bold text-slate-700 text-sm" /></div>
            <button onClick={handlePredict} disabled={isPredicting} className="bg-primary-600 hover:bg-primary-700 text-white w-full h-[45px] rounded-xl flex items-center justify-center font-bold text-sm duration-150 shadow-soft cursor-pointer disabled:opacity-75">{isPredicting ? 'Predicting Probabilities...' : 'Predict Colleges'}</button>
          </div>
          <div className="border-t border-slate-50 pt-5">
            <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-primary-600" /> Match Projections</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-slate-50"><th className="text-left py-2.5 text-slate-400 font-bold text-[11px] uppercase">College Name</th><th className="text-left py-2.5 text-slate-400 font-bold text-[11px] uppercase">Type</th><th className="text-left py-2.5 text-slate-400 font-bold text-[11px] uppercase">Cutoff</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {predictions.map((p, i) => (<motion.tr initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="hover:bg-slate-50/50 duration-150" key={i}><td className="py-3.5 font-bold text-slate-800 text-sm">{p.name}</td><td className="py-3.5 text-slate-500 text-xs font-medium">{p.type}</td><td className="py-3.5 text-green-600 font-black text-xs">Rank {p.cutoff}</td></motion.tr>))}
                  {predictions.length === 0 && !isPredicting && (<tr><td colSpan="3" className="py-8 text-center text-slate-400 text-xs">Select details above and click 'Predict' to view matching institutes lists.</td></tr>)}
                  {isPredicting && (<tr><td colSpan="3" className="py-8 text-center text-slate-500 text-xs font-bold animate-pulse">Analyzing rank datasets thresholds...</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
          {isPredictorLocked && (
            <div className="relative border-t border-slate-50 pt-5 mt-2">
              <div className="absolute inset-x-0 bottom-0 top-0 backdrop-blur-md bg-white/50 z-10 flex flex-col items-center justify-center p-6 text-center rounded-2xl">
                <div className="bg-gradient-to-br from-primary-600 to-indigo-600 p-2.5 rounded-full text-white mb-3 shadow-glow"><Lock className="h-5 w-5" /></div>
                <h3 className="text-base font-black text-slate-900 mb-1">Unlock Premium AI Insights</h3><p className="text-slate-500 text-xs max-w-sm mb-3">View exact admission probabilities (%), dynamic filtering, and AI accurate suggestions sets.</p>
                <button onClick={() => setIsPredictorLocked(false)} className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-soft flex items-center gap-2 duration-150 cursor-pointer">Unlock Full Predictor <ArrowUpRight className="h-3.5 w-3.5" /></button>
              </div>
              <div className="opacity-20 filter blur-sm"><p className="font-bold text-slate-800">AI Component Analysis Row</p><div className="h-28 bg-slate-100 rounded-xl mt-3"></div></div>
            </div>
          )}
        </motion.div>
      </section>

      {/* 6. Popular Exams */}
      <section id="exams" className="max-w-7xl mx-auto px-6 py-20 bg-white border-y border-slate-100/80">
        <div className="text-center max-w-xl mx-auto mb-12"><span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-bold">DATABANK</span><h2 className="text-3xl font-black text-slate-900 mt-2 mb-3">Popular Entrance Exams</h2><p className="text-slate-500 text-sm">Master insights for top certifications across India.</p></div>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {examsList.filter(e => e.isActive).map((item, idx) => (
            <motion.div key={idx} variants={itemVariants} whileHover={{ y: -6, transition: { duration: 0.2 } }}><Link to={`/exam/${item.name.toLowerCase()}`}><div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-soft hover:shadow-xl transition-all duration-300 relative group cursor-pointer h-full flex flex-col justify-between"><div><div className={`p-4 rounded-xl ${item.colorClass || 'bg-slate-50 text-slate-600'} w-fit font-black text-lg mb-4`}>{item.name}</div><h4 className="font-extrabold text-slate-800 text-base mb-1">{item.title || item.name}</h4><p className="text-[11px] text-slate-400">Entrance Examination</p></div><p className="text-xs text-primary-600 font-bold mt-4 flex items-center justify-between"><span>{item.collegeCount || 'Multiple Colleges'}</span> <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 duration-150" /></p></div>
            </Link></motion.div>
          ))}
        </motion.div>
      </section>

      {/* 7. Benefits */}
      <section id="mentorship" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div><span className="text-primary-600 font-bold text-xs">WHY CHOOSE US</span><h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2 mb-4">Experience Premium Counselling Ecosystem</h2></div>
            <div className="space-y-5">
              {[{ icon: Compass, t: 'Personalized Strategy', d: 'Get mapping analytics to reduce admission anxiety.' }, { icon: LayoutDashboard, t: 'Live Tracker', d: 'Accurate deadlines management without missing.' }, { icon: Users, t: 'Verified Support', d: 'Certified experienced masters.' }].map((b, i) => (
                <div className="flex gap-4 group" key={i}><div className="bg-gradient-to-br from-primary-50 to-indigo-50 p-3 rounded-2xl h-fit border border-primary-100/50 Group-hover:rotate-6 duration-300"><b.icon className="h-6 w-6 text-primary-600" /></div><div><h4 className="font-extrabold text-sm">{b.t}</h4><p className="text-slate-500 text-xs">{b.d}</p></div></div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass p-6 rounded-3xl grid grid-cols-2 gap-4 bg-white/30 border-slate-200 shadow-glass">
            <motion.div whileHover={{ y: -4, backgroundColor: '#ffffff' }} className="card-premium bg-white duration-200 flex flex-col items-center text-center p-5"><div className="bg-indigo-50 p-3 rounded-2xl mb-3"><Globe className="h-6 w-6 text-indigo-600" /></div><h4 className="font-black text-sm">Pan India Scale</h4><p className="text-[11px] text-slate-400">Over 25 states domains.</p></motion.div>
            <motion.div whileHover={{ scale: 1.03, y: -4 }} className="card-premium bg-gradient-to-br from-primary-600 to-indigo-600 text-white flex flex-col items-center text-center p-5 cursor-pointer"><Star className="h-7 w-7 text-yellow-300 mb-3 fill-current animate-pulse" /><h4 className="font-black text-sm">9.5/10 Rating</h4><p className="text-[11px] text-white/80">Reviews trusted candidate.</p></motion.div>
          </motion.div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="bg-slate-950 text-white text-center py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/20 rounded-full filter blur-[120px]"></div><div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/20 rounded-full filter blur-[100px]"></div></div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-xl mx-auto relative z-10 space-y-5">
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Start Securing Your Future Today</h2><p className="text-slate-400 text-sm max-w-md mx-auto">Let AI projections simplify stressful decisions.</p><Link to="/login" className="inline-flex bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-black px-8 py-3.5 rounded-2xl shadow-glow transform hover:scale-[1.03] text-sm cursor-pointer border-none">Get Free Counselling Session</Link>
        </motion.div>
      </section>

      {/* Custom Animated Alert Modal overlay trigger accurate framing */}
      <AnimatePresence>
        {isAlertOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center border border-slate-100 flex flex-col items-center"
            >
              <div className="bg-primary-50 p-3.5 rounded-2xl text-primary-600">
                <GraduationCap className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Portal Opening Soon!</h3>
                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">The Scholarship Registration process will begin from next week. Get your documents ready!</p>
              </div>
              <button onClick={() => setIsAlertOpen(false)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs duration-200 shadow-soft cursor-pointer">
                Understood, Thank You
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
