filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\CounsellorDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

if "sessionApi" not in content:
    content = content.replace("import { userApi } from '../api';", "import { userApi, sessionApi } from '../api';")

target_state = "const [studentsList, setStudentsList] = useState([]);"
if "sessionsList" not in content:
    content = content.replace(target_state, target_state + "\n  const [sessionsList, setSessionsList] = useState([]);")

target_effect = '''          const userStr = localStorage.getItem('user');
          if (userStr) {
             const userObj = JSON.parse(userStr);
             const userRes = await userApi.getProfile(userObj.id);
             setCounsellorProfile(userRes.data);
          }'''

replace_effect = '''          const userStr = localStorage.getItem('user');
          if (userStr) {
             const userObj = JSON.parse(userStr);
             const userRes = await userApi.getProfile(userObj.id);
             setCounsellorProfile(userRes.data);

             try {
                const resSessions = await sessionApi.getAll({ counsellorId: userObj.id });
                setSessionsList(resSessions.data.map(s => ({
                   id: s.id, studentId: s.studentId, n: s.student?.name || "Student", m: s.topic, s: `${s.date} ${s.time}`, url: s.url, status: s.status
                })));
             } catch (e) { console.error(e); }
          }'''

content = content.replace(target_effect, replace_effect)

target_create = '''                             setCustomAlert({ isOpen: true, t: 'Warning', m: 'Please fill all fields correctly.', tp: 'warning' });
                                return;
                             }
                             setCustomAlert({ isOpen: true, t: 'Success', m: `Session scheduled for ${sessionFormData.student} on ${sessionFormData.date} at ${sessionFormData.time}!`, tp: 'success' });
                             setIsScheduleModalOpen(false);'''

replace_create = '''                             setCustomAlert({ isOpen: true, t: 'Warning', m: 'Please fill all fields correctly.', tp: 'warning' });
                                return;
                             }
                             try {
                                const matchedStudent = studentsList.find(s => s.n === sessionFormData.student);
                                if (matchedStudent) {
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
                                    setSessionsList(resSessions.data.map(s => ({
                                       id: s.id, studentId: s.studentId, n: s.student?.name || "Student", m: s.topic, s: `${s.date} ${s.time}`, url: s.url, status: s.status
                                    })));
                                }
                             } catch (e) { console.error(e); }
                             setIsScheduleModalOpen(false);'''

content = content.replace(target_create, replace_create)

target_overview_card = '''                                 <h4 className="font-bold text-slate-800 text-sm">No Live Session At This Moment</h4>
                                <p className="text-xs text-slate-400 mt-1 max-w-xs">Loads schedule filters parameters dashboards metric updates framing configurations properly framing thresholds configurations setups.</p>'''

replace_overview_card = '''                                 {sessionsList.length > 0 ? (
                                    <div className="w-full space-y-3">
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
                                    <>
                                       <h4 className="font-bold text-slate-800 text-sm">No Live Session At This Moment</h4>
                                       <p className="text-xs text-slate-400 mt-1 max-w-xs">Loads schedule filters parameters dashboards metric updates framing configurations properly framing thresholds configurations setups.</p>
                                    </>
                                 )}'''

content = content.replace(target_overview_card, replace_overview_card)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
