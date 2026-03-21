filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\CounsellorDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Find the old useEffect block and replace entirely
old_block = '''  useEffect(() => {
    const loadCounsellorData = async () => {
       try {
          const resStats = await userApi.getStats();

          const resUsers = await userApi.getAll();
          const mapped = resUsers.data.filter(u => u.role === 'Student').map(u => ({
             id: u.id, n: u.name, e: u.email, m: u.specialized || 'JEE Main (IIT Delhi)', s: 'Today 2:00 PM', status: 'Scheduled', rank: 'AIR 4510', doc: u.isVerified ? 'Approved' : 'Pending'
          }));
          setStudentsList(mapped);
          setSessionFormData(prev => ({ ...prev, student: mapped[0]?.n || '' }));

          const userStr = localStorage.getItem('user');
          if (userStr) {
             const userObj = JSON.parse(userStr);
             const userRes = await userApi.getProfile(userObj.id);
             setCounsellorProfile(userRes.data);

             try {
                const resSessions = await sessionApi.getAll({ counsellorId: userObj.id });
                const mappedS = resSessions.data.map(s => ({
                   id: s.id, studentId: s.studentId, n: s.student?.name || "Student", m: s.topic, s: `${s.date} ${s.time}`, url: s.url, status: s.status
                }));
                setSessionsList(mappedS);

                // Update Stats dynamically triggering configurations setup thresholds
                setStats([
                   { t: 'Assigned Students', v: String(mapped.length || 0), d: 'Total students registered', i: Users, c: 'bg-primary-50 text-primary-600' },
                   { t: 'Sessions Scheduled', v: String(mappedS.length), d: `Upcoming: ${mappedS.length}`, i: Clock, c: 'bg-green-50 text-green-600' },
                   { t: 'Query Support Requests', v: '0', d: 'Needs review response', i: MessageSquare, c: 'bg-amber-50 text-amber-600' }
                ]);
             } catch (e) { console.error(e); }
          }
       } catch (e) { console.error(e); }
    };
    loadCounsellorData();
  }, []);'''

new_block = '''  useEffect(() => {
    const loadCounsellorData = async () => {
       try {
          // Get logged in counsellor from localStorage
          const userStr = localStorage.getItem('user');
          if (!userStr) return;
          const userObj = JSON.parse(userStr);

          // Load counsellor profile
          const userRes = await userApi.getProfile(userObj.id);
          setCounsellorProfile(userRes.data);

          // Load all students
          const resUsers = await userApi.getAll();
          const mapped = resUsers.data.filter(u => u.role === 'Student').map(u => ({
             id: u.id, n: u.name, e: u.email, m: u.specialized || 'JEE Main (IIT Delhi)', s: 'Session pending', status: 'Scheduled', rank: 'AIR 4510', doc: u.isVerified ? 'Approved' : 'Pending'
          }));
          setStudentsList(mapped);
          setSessionFormData(prev => ({ ...prev, student: mapped[0]?.n || '' }));

          // Load sessions for this counsellor
          const resSessions = await sessionApi.getAll({ counsellorId: userObj.id });
          console.log('Sessions from API:', resSessions.data);
          const mappedS = resSessions.data.map(s => ({
             id: s.id, studentId: s.studentId, n: s.student?.name || "Student", m: s.topic, s: `${s.date} ${s.time}`, url: s.url, status: s.status
          }));
          setSessionsList(mappedS);

          // Update stats with live data
          setStats([
             { t: 'Assigned Students', v: String(mapped.length || 0), d: 'Total students registered', i: Users, c: 'bg-primary-50 text-primary-600' },
             { t: 'Sessions Scheduled', v: String(mappedS.length), d: `Upcoming: ${mappedS.length}`, i: Clock, c: 'bg-green-50 text-green-600' },
             { t: 'Query Support Requests', v: '0', d: 'Needs review response', i: MessageSquare, c: 'bg-amber-50 text-amber-600' }
          ]);
       } catch (e) { console.error('Dashboard load error:', e); }
    };
    loadCounsellorData();
  }, []);'''

if old_block in content:
    content = content.replace(old_block, new_block)
    print("SUCCESS: Replaced useEffect block")
else:
    print("FAIL: Old block not found, searching for alternative...")
    # Try to find where useEffect starts
    idx = content.find("useEffect(() => {")
    if idx != -1:
        print(f"Found useEffect at char {idx}")
        print(repr(content[idx:idx+200]))
    else:
        print("useEffect not found at all!")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
