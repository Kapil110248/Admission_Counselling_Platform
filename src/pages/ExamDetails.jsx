import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, FileText, CheckCircle2, 
  Lock, TrendingUp, Award, GraduationCap, ChevronRight 
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function ExamDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const examData = {
    neet: { title: 'NEET UG 2026', subtitle: 'National Eligibility cum Entrance Test', date: 'May 4, 2026' },
    jee: { title: 'JEE Main 2026', subtitle: 'Joint Entrance Examination', date: 'April 15, 2026' },
    cuet: { title: 'CUET 2026', subtitle: 'Common University Entrance Test', date: 'May 20, 2026' }
  };

  const currentExam = examData[id] || { title: 'Entrance Exam', subtitle: 'Competitive Entrance Examination', date: 'TBA' };

  return (
    <div className="relative min-h-screen bg-[#f8fbff] text-slate-900 pb-20">
      {/* Back Button and Header */}
      <div className="bg-white border-b border-slate-100 py-6 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium transition">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded-xl shadow-soft text-sm">
            Check Predictor
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid md:grid-cols-3 gap-8">
        {/* Left column (2/3 size): Details */}
        <div className="md:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="card-premium"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-primary-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{id.toUpperCase()}</span>
                <h1 className="text-3xl font-bold text-slate-900 mt-2">{currentExam.title}</h1>
                <p className="text-slate-500 mt-1">{currentExam.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-semibold">{currentExam.date}</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
              {[
                { label: 'Mode', val: 'Online' },
                { label: 'Duration', val: '3 Hours' },
                { label: 'Total Marks', val: '720' },
                { label: 'Negative Marking', val: 'Yes (-1)' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                  <p className="font-bold text-slate-800 mt-0.5">{stat.val}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section tabs */}
          <div className="flex gap-4 border-b border-slate-200">
            {['Overview', 'Syllabus', 'Cutoffs', 'Colleges'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-3 font-semibold text-sm transition-all relative ${activeTab === tab.toLowerCase() ? 'text-primary-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-premium">
                <h3 className="text-xl font-bold mb-4">Eligibility Criteria</h3>
                <ul className="space-y-3">
                  {[
                    'Must have passed 10+2 or equivalent from recognized board.',
                    'Age between 17 to 25 years as of admission year.',
                    'Mandatory subjects: Physics, Chemistry, Biology/Mathematics.'
                  ].map((req, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 text-sm leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {activeTab === 'cutoffs' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-premium">
                <h3 className="text-xl font-bold mb-4">Historical Cutoffs Trends</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="text-left font-bold p-3 text-slate-600">Category</th>
                          <th className="text-left font-bold p-3 text-slate-600">2025 Cutoff</th>
                          <th className="text-left font-bold p-3 text-slate-600">2024 Cutoff</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="p-3 text-slate-800 font-semibold">General</td>
                          <td className="p-3 text-slate-600">720 - 137</td>
                          <td className="p-3 text-slate-600">720 - 134</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-slate-800 font-semibold">OBC-NCL</td>
                          <td className="p-3 text-slate-600">136 - 107</td>
                          <td className="p-3 text-slate-600">133 - 105</td>
                        </tr>
                      </tbody>
                    </table>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'colleges' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'AIIMS, New Delhi', type: 'Govt', rating: '5.0' },
                  { name: 'Maulana Azad Medical College', type: 'Govt', rating: '4.8' },
                  { name: 'KMC Manipal', type: 'Private', rating: '4.5' }
                ].map((c, i) => (
                  <div className="card-premium flex justify-between items-center" key={i}>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{c.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{c.type} Institute</p>
                    </div>
                    <div className="bg-primary-50 px-2 py-1 rounded-md text-primary-700 font-bold text-xs">{c.rating}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right column (1/3 size): Lateral Panels */}
        <div className="space-y-6">
          <div className="card-premium bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm mb-2">
              <TrendingUp className="h-4 w-4" /> AI PREDICTIVE DASHBOARD
            </div>
            <h3 className="text-xl font-bold mb-2">Unlock accurate college match dashboard</h3>
            <p className="text-white/70 text-sm mb-4">Compare 500+ institutes matching your exact ranks probability today.</p>
            
            <div className="relative overflow-hidden p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-4 ">
                <div className="absolute inset-x-0 inset-y-0 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4">
                  <Lock className="h-6 w-6 text-white mb-2" />
                  <p className="font-semibold text-sm">Dashboard is Disabled</p>
                  <button className="text-xs bg-white text-slate-900 font-bold px-3 py-1 bg-white/90 hover:bg-white rounded-md mt-2 shadow-soft">Unlock Now</button>
                </div>
                <div className="h-20 bg-white/10 rounded filter blur-sm"></div>
            </div>
          </div>

          <div className="card-premium">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary-600" /> Scholarship Scheme</h4>
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
               <span className="font-bold text-sm text-primary-800">Counselling Excellence Scholarship</span>
               <p className="text-xs text-slate-600 leading-relaxed mt-1">Provide 100% waiving support fees based on predict rankings.</p>
               <button className="text-xs font-semibold text-primary-600 flex items-center gap-1 mt-2">Learn More <ChevronRight className="h-3 w-3" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
