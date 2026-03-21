filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\StudentDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix import to include userApi and sessionApi
old_import = "import { examApi, collegeApi } from '../api';"
new_import = "import { examApi, collegeApi, userApi, sessionApi } from '../api';"
content = content.replace(old_import, new_import)

# 2. Add state variables after examsList state
old_state = "  const [examsList, setExamsList] = useState([]);\n  const [predictExam, setPredictExam] = useState('');\n  const [predictRank, setPredictRank] = useState('');\n  const [predictions, setPredictions] = useState([]);\n  const [isPredicting, setIsPredicting] = useState(false);"
new_state = """  const [examsList, setExamsList] = useState([]);
  const [predictExam, setPredictExam] = useState('');
  const [predictRank, setPredictRank] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [studentProfile, setStudentProfile] = useState({ name: 'Student', email: '', phone: '', specialized: '' });
  const [sessionsList, setSessionsList] = useState([]);
  const [collegesList, setCollegesList] = useState([]);"""
content = content.replace(old_state, new_state)

# 3. Replace the useEffect to load all data
old_useeffect = """  useEffect(() => {
     const loadExams = async () => {
       try { const res = await examApi.getAll(); setExamsList(res.data); } catch (e) {}
     };
     loadExams();
  }, []);"""
new_useeffect = """  useEffect(() => {
     const loadStudentData = async () => {
       try {
         // Load exams
         const resExams = await examApi.getAll();
         setExamsList(resExams.data);

         // Load colleges
         const resColleges = await collegeApi.getAll();
         setCollegesList(resColleges.data);

         // Load student profile
         const userStr = localStorage.getItem('user');
         if (userStr) {
           const userObj = JSON.parse(userStr);
           const profileRes = await userApi.getProfile(userObj.id);
           if (profileRes.data) {
             setStudentProfile(profileRes.data);
           }

           // Load sessions for this student
           const resSessions = await sessionApi.getAll({ studentId: userObj.id });
           setSessionsList(resSessions.data.map(s => ({
             id: s.id, counsellorName: s.counsellor?.name || 'Counsellor', topic: s.topic, date: s.date, time: s.time, url: s.url, status: s.status
           })));
         }
       } catch (e) { console.error('Student dashboard load error:', e); }
     };
     loadStudentData();
  }, []);"""
content = content.replace(old_useeffect, new_useeffect)

# 4. Replace "Welcome Back, Sarah!" with dynamic name
content = content.replace(
    '<h1 className="text-2xl font-bold text-slate-900">Welcome Back, Sarah!</h1>',
    '<h1 className="text-2xl font-bold text-slate-900">Welcome Back, {studentProfile.name}!</h1>'
)

# 5. Replace hardcoded header name "Sarah Jenkins"
content = content.replace(
    '<p className="font-bold text-sm text-slate-800">Sarah Jenkins</p>',
    '<p className="font-bold text-sm text-slate-800">{studentProfile.name}</p>'
)

# 6. Replace localStorage tab for student too
content = content.replace(
    "  const [activeTab, setActiveTab] = useState('overview');",
    "  const [activeTab, setActiveTab] = useState(localStorage.getItem('studentTab') || 'overview');"
)

content = content.replace(
    "    setIsNotificationsOpen(false); // close modal on tab change\n    setActiveTab(tab);",
    "    setIsNotificationsOpen(false); // close modal on tab change\n    localStorage.setItem('studentTab', tab);\n    setActiveTab(tab);"
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Done student backend integration")
