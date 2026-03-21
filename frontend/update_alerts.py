filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\CounsellorDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "alert('Please fill Date, Time and Meeting URL correctly.');" in line:
        lines[i] = "                               setCustomAlert({ isOpen: true, t: 'Warning', m: 'Please fill all fields correctly.', tp: 'warning' });\n"
    if "alert(`Session scheduled successfully for ${sessionFormData.student}" in line:
        lines[i] = "                            setCustomAlert({ isOpen: true, t: 'Success', m: `Session scheduled for ${sessionFormData.student} on ${sessionFormData.date} at ${sessionFormData.time}!`, tp: 'success' });\n"

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Done")
