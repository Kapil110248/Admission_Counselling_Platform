filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\CounsellorDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

lines[254] = '                                 {studentsList.filter(u => u.doc === \'Pending\').map((u, i) => (\n'
lines[260] = '                                       <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.doc === \'Approved\' ? \'bg-green-50 text-green-600\' : \'bg-amber-50 text-amber-600\'}`}>{u.doc}</span>\n'

replace_counselling = '''                                 {sessionsList.length > 0 ? (
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
                                 )}\n'''

lines[270] = replace_counselling
for i in range(271, 277):
    lines[i] = ""

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Done index fix for bottom cards")
