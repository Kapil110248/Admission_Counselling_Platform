filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\CounsellorDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

replace = '''                setStats([
                   { t: 'Assigned Students', v: String(mapped.length || 0), d: 'Total students registered', i: Users, c: 'bg-primary-50 text-primary-600' },
                   { t: 'Sessions Scheduled', v: String(mappedS.length), d: `Upcoming: ${mappedS.length}`, i: Clock, c: 'bg-green-50 text-green-600' },
                   { t: 'Query Support Requests', v: '0', d: 'Needs review response', i: MessageSquare, c: 'bg-amber-50 text-amber-600' }
                ]);\n'''

lines[76] = replace
for i in range(77, 81):
    lines[i] = ""

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Done index fix for stats keys")
