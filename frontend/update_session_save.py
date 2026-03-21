filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\CounsellorDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

replace = '''                          onClick={async () => {
                             if (!sessionFormData.date || !sessionFormData.time || !sessionFormData.url) {
                                setCustomAlert({ isOpen: true, t: 'Warning', m: 'Please fill all fields correctly.', tp: 'warning' });
                                return;
                             }
                             try {
                                const matchedStudent = studentsList.find(s => s.n === sessionFormData.student);
                                if (!matchedStudent) {
                                    alert("Oops: Please select a valid student from option menu: " + sessionFormData.student);
                                    return;
                                }
                                
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
                             } catch (e) { alert("Create failed: " + e.message); console.error(e); }
                             
                             setIsScheduleModalOpen(false);
                          }} \n'''

lines[482] = replace
for i in range(483, 490):
    lines[i] = ""

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Done create fix")
