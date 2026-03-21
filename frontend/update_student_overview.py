filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\StudentDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Replace stat cards (lines 235-252, idx 234-251)
stat_replacement = '''                     {/* Core metrics cards - Live from backend */}
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
                     </div>\n'''

# Line 234 is '{/* Core metrics cards */}'
# Lines 234-252 (idx 233-251) are the entire block
lines[233] = stat_replacement
for i in range(234, 253):
    lines[i] = ""

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Done stat cards replacement")
