filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\CounsellorDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

lines[335] = "                          {sessionsList.map((u, i) => (\n"
lines[339] = "                                <h3 className=\"font-bold text-lg text-slate-800 mt-1\">{u.n}</h3>\n"
lines[340] = "                                <p className=\"text-xs text-slate-500 mt-1\">{u.m}</p>\n"
lines[347] = "                                <button onClick={() => u.url && window.open(u.url, '_blank')} className=\"bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-xl text-xs\">Join Room</button>\n"

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Done indices replace")
