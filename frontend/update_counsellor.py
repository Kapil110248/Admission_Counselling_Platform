import sys

filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\CounsellorDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target1 = '''                              <input type="text" defaultValue="Neha Gupta" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />'''
replace1 = '''                              <input type="text" value={counsellorProfile.name || ""} onChange={e => setCounsellorProfile({ ...counsellorProfile, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />'''

target2 = '''                              <input type="text" defaultValue="IIT counselling / NEET Guidance" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />'''
replace2 = '''                              <input type="text" value={counsellorProfile.specialized || ""} onChange={e => setCounsellorProfile({ ...counsellorProfile, specialized: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />'''

target3 = '''                              <input type="email" defaultValue="neha@educounsel.com" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />'''
replace3 = '''                              <input type="email" value={counsellorProfile.email || ""} onChange={e => setCounsellorProfile({ ...counsellorProfile, email: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />'''

target4 = '''                              <input type="text" defaultValue="+91 9876543211" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />'''
replace4 = '''                              <input type="text" value={counsellorProfile.phone || ""} onChange={e => setCounsellorProfile({ ...counsellorProfile, phone: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition font-medium" />'''

target5 = '''                          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-soft cursor-pointer duration-200">Update Profile</button>'''
replace5 = '''                          <button onClick={async () => {
                              try {
                                 await userApi.update(counsellorProfile.id, counsellorProfile);
                                 alert("Profile updated successfully!");
                              } catch (e) { console.error(e); }
                          }} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-soft cursor-pointer duration-200">Update Profile</button>'''

content = content.replace(target1, replace1)
content = content.replace(target2, replace2)
content = content.replace(target3, replace3)
content = content.replace(target4, replace4)
content = content.replace(target5, replace5)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
