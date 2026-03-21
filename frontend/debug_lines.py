filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\StudentDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Print lines 232 to 260 for inspection
for i in range(232, 260):
    print(f"Line {i+1}: {repr(lines[i])}")
