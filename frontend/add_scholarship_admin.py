filepath = r"C:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\AdminDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# ─── 1. Add scholarshipApi to imports ───────────────────────────────────────
content = content.replace(
    "import { userApi, examApi, collegeApi, authApi } from '../api';",
    "import { userApi, examApi, collegeApi, authApi, scholarshipApi } from '../api';"
)

# ─── 2. Add scholarship state variables after cutoffFormData state ───────────
old_cutoff_state = "  const [adminProfile, setAdminProfile] = useState({ name: '', email: '', phone: '', role: '' });"
new_state = """  // Scholarship State Logic
  const [scholarshipsList, setScholarshipsList] = useState([]);
  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [currentScholarshipEdit, setCurrentScholarshipEdit] = useState(null);
  const [scholarshipFormData, setScholarshipFormData] = useState({ name: '', description: '', amount: '', eligibility: '', officialUrl: '' });

  const [adminProfile, setAdminProfile] = useState({ name: '', email: '', phone: '', role: '' });"""
content = content.replace(old_cutoff_state, new_state)

# ─── 3. Add fetchScholarships function after fetchCutoffs ───────────────────
old_fetch = "  const fetchAdminProfile = async () => {"
new_fetch = """  const fetchScholarships = async () => { try { const res = await scholarshipApi.getAll(); setScholarshipsList(res.data); } catch (e) { console.error(e); } };

  const fetchAdminProfile = async () => {"""
content = content.replace(old_fetch, new_fetch)

# ─── 4. Add scholarship to useEffect tab loader ─────────────────────────────
content = content.replace(
    "    if (activeTab === 'cutoffs') fetchCutoffs();\n    if (activeTab === 'settings') fetchAdminProfile();",
    "    if (activeTab === 'cutoffs') fetchCutoffs();\n    if (activeTab === 'scholarships') fetchScholarships();\n    if (activeTab === 'settings') fetchAdminProfile();"
)

# ─── 5. Add scholarship to overview preload ─────────────────────────────────
content = content.replace(
    "    if (activeTab === 'overview') { fetchStats(); fetchUsers(); fetchExams(); fetchColleges(); fetchCutoffs(); }",
    "    if (activeTab === 'overview') { fetchStats(); fetchUsers(); fetchExams(); fetchColleges(); fetchCutoffs(); fetchScholarships(); }"
)

# ─── 6. Add scholarship sidebar item ────────────────────────────────────────
content = content.replace(
    "    { id: 'cutoffs', icon: Award, label: 'Cutoff Data' },\n    { id: 'settings', icon: Settings, label: 'Settings' },",
    "    { id: 'cutoffs', icon: Award, label: 'Cutoff Data' },\n    { id: 'scholarships', icon: GraduationCap, label: 'Scholarships' },\n    { id: 'settings', icon: Settings, label: 'Settings' },"
)

print("Phase 1 done - state, fetch, sidebar")

# ─── 7. Find where default case starts (the final return near end) ──────────
# We need to add scholarship case before the default case in the switch
# Find "default:" in the case blocks
scholarship_case = """
                case 'scholarships':
                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-2xl font-bold text-slate-900">Scholarships Management</h1>
                          <p className="text-slate-500 text-sm mt-0.5">Add, edit or remove scholarship opportunities shown to students.</p>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentScholarshipEdit(null);
                            setScholarshipFormData({ name: '', description: '', amount: '', eligibility: '', officialUrl: '' });
                            setIsScholarshipModalOpen(true);
                          }}
                          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-soft text-xs duration-150 flex items-center gap-2"
                        >
                          + Add Scholarship
                        </button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        {scholarshipsList.length === 0 ? (
                          <div className="col-span-3 card-premium bg-white flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 mb-4">
                              <GraduationCap className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-slate-800">No Scholarships Yet</h3>
                            <p className="text-xs text-slate-400 mt-1">Click "+ Add Scholarship" to add the first one.</p>
                          </div>
                        ) : scholarshipsList.map((s) => (
                          <div key={s.id} className="card-premium bg-white flex flex-col justify-between h-full">
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl">
                                  <GraduationCap className="h-5 w-5" />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setCurrentScholarshipEdit(s);
                                      setScholarshipFormData({ name: s.name, description: s.description, amount: s.amount, eligibility: s.eligibility || '', officialUrl: s.officialUrl || '' });
                                      setIsScholarshipModalOpen(true);
                                    }}
                                    className="p-1.5 bg-slate-50 hover:bg-primary-50 rounded-lg text-slate-500 hover:text-primary-600 duration-150"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDialog({
                                      isOpen: true,
                                      t: 'Delete Scholarship',
                                      m: `Are you sure you want to delete "${s.name}"? This will remove it from the student dashboard.`,
                                      onConfirm: async () => {
                                        try {
                                          await scholarshipApi.delete(s.id);
                                          await fetchScholarships();
                                          setCustomAlert({ isOpen: true, t: 'Deleted', m: 'Scholarship removed successfully.', tp: 'success' });
                                        } catch (e) {
                                          setCustomAlert({ isOpen: true, t: 'Error', m: 'Failed to delete scholarship.', tp: 'error' });
                                        }
                                      }
                                    })}
                                    className="p-1.5 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-500 duration-150"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <h3 className="font-bold text-slate-800 text-sm leading-snug">{s.name}</h3>
                              <p className="text-primary-600 font-bold text-xs mt-1">{s.amount}</p>
                              <p className="text-slate-500 text-xs mt-2 leading-relaxed">{s.description}</p>
                              {s.eligibility && (
                                <p className="text-slate-400 text-[10px] mt-2 leading-relaxed border-t border-slate-50 pt-2">
                                  <span className="font-bold text-slate-500">Eligible: </span>{s.eligibility}
                                </p>
                              )}
                            </div>
                            {s.officialUrl && (
                              <a href={s.officialUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-600 font-semibold flex items-center gap-1 mt-4 hover:underline">
                                View Link <ArrowRight className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
"""

# Find the settings case to insert before it
insert_before = "                case 'settings':"
if insert_before in content:
    content = content.replace(insert_before, scholarship_case + "\n                case 'settings':")
    print("Scholarship case inserted")
else:
    print("ERROR: Could not find settings case")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Phase 2 done - case tab inserted")
