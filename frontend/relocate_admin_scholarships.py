filepath = r"C:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\AdminDashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# The section we inserted erroneously earlier:
erroneous_section = '''              {activeTab === 'scholarships' && (
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
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">Click "+ Add Scholarship" to add the first one. It will appear on the Student Dashboard instantly.</p>
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
                                      setCustomAlert({ isOpen: true, t: 'Deleted!', m: 'Scholarship removed successfully.', tp: 'success' });
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

                  {/* Scholarship Add/Edit Modal */}
                  <AnimatePresence>
                    {isScholarshipModalOpen && (
                      <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.85, y: 20 }}
                          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4 border border-slate-100"
                        >
                          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                            <h3 className="font-bold text-slate-800 text-base">
                              {currentScholarshipEdit ? 'Edit Scholarship' : 'Add New Scholarship'}
                            </h3>
                            <button onClick={() => setIsScholarshipModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg duration-150">
                              <X className="h-4 w-4 text-slate-500" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Scholarship Name *</label>
                              <input
                                type="text"
                                value={scholarshipFormData.name}
                                onChange={e => setScholarshipFormData({ ...scholarshipFormData, name: e.target.value })}
                                placeholder="e.g. Merit Excellence Scholarship"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Amount / Benefit *</label>
                              <input
                                type="text"
                                value={scholarshipFormData.amount}
                                onChange={e => setScholarshipFormData({ ...scholarshipFormData, amount: e.target.value })}
                                placeholder="e.g. Up to 100% Waiver / ₹50,000"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Description *</label>
                              <textarea
                                value={scholarshipFormData.description}
                                onChange={e => setScholarshipFormData({ ...scholarshipFormData, description: e.target.value })}
                                placeholder="Brief description of this scholarship"
                                rows={2}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium resize-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Eligibility Criteria</label>
                              <input
                                type="text"
                                value={scholarshipFormData.eligibility}
                                onChange={e => setScholarshipFormData({ ...scholarshipFormData, eligibility: e.target.value })}
                                placeholder="e.g. Top 10% rank holders in JEE/NEET"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Official Apply URL</label>
                              <input
                                type="url"
                                value={scholarshipFormData.officialUrl}
                                onChange={e => setScholarshipFormData({ ...scholarshipFormData, officialUrl: e.target.value })}
                                placeholder="https://example.com/apply"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                            <button
                              onClick={() => setIsScholarshipModalOpen(false)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold duration-150"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={async () => {
                                if (!scholarshipFormData.name || !scholarshipFormData.amount || !scholarshipFormData.description) {
                                  setCustomAlert({ isOpen: true, t: 'Missing Fields', m: 'Please fill Name, Amount, and Description.', tp: 'error' });
                                  return;
                                }
                                try {
                                  const payload = {
                                    name: scholarshipFormData.name,
                                    description: scholarshipFormData.description,
                                    amount: scholarshipFormData.amount,
                                    eligibility: scholarshipFormData.eligibility,
                                    officialUrl: scholarshipFormData.officialUrl
                                  };
                                  if (currentScholarshipEdit) {
                                    await scholarshipApi.update(currentScholarshipEdit.id, payload);
                                    setCustomAlert({ isOpen: true, t: 'Updated!', m: 'Scholarship updated successfully. Students will see the new data.', tp: 'success' });
                                  } else {
                                    await scholarshipApi.create(payload);
                                    setCustomAlert({ isOpen: true, t: 'Added!', m: 'New scholarship added. Students can now see and apply for it!', tp: 'success' });
                                  }
                                  await fetchScholarships();
                                  setIsScholarshipModalOpen(false);
                                } catch (e) {
                                  setCustomAlert({ isOpen: true, t: 'Error', m: e.response?.data?.error || 'Failed to save scholarship.', tp: 'error' });
                                }
                              }}
                              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-soft duration-150"
                            >
                              {currentScholarshipEdit ? 'Update Scholarship' : 'Add Scholarship'}
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}'''

# Normalize line endings to avoid issues
content_norm = content.replace('\r\n', '\n')
erroneous_norm = erroneous_section.replace('\r\n', '\n').strip()

if erroneous_norm in content_norm:
    content_norm = content_norm.replace(erroneous_norm, "")
    print("Cleaned up back broken insert")
else:
    print("ERR: section fully isolated match fail - attempting loosely find match by lines")
    lines = content.split('\n')
    # find lines[91] which starts "{activeTab === 'scholarships' && ("
    start_idx = -1
    for i in range(85, 120):
        if i < len(lines) and "{activeTab === 'scholarships' && (" in lines[i]:
            start_idx = i
            break
    
    if start_idx != -1:
        # find the end AnimatePresence/div closing
        end_idx = start_idx + 150 # safe buffer
        for j in range(start_idx + 100, len(lines)):
            if j < len(lines) and "</AnimatePresence>" in lines[j] and "</div>" in lines[j+1] and ")}" in lines[j+2]:
                end_idx = j + 2
                break
        if end_idx != start_idx + 150:
            print(f"Indices found: {start_idx} to {end_idx}")
            lines = lines[:start_idx] + lines[end_idx+1:]
            content_norm = '\n'.join(lines)
            print("Loose match succeeded in cleaning")

# Re-insert before line 1173 (which now may have moved upwards)
lines_norm = content_norm.split('\n')
insert_target_norm = -1
for i, line in enumerate(lines_norm):
    if "activeTab === 'settings'" in line:
        insert_target_norm = i
        break

if insert_target_norm != -1:
    lines_norm.insert(insert_target_norm, erroneous_section)
    final_output = '\n'.join(lines_norm)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(final_output)
    print(f"Correctly inserted at line {insert_target_norm}")
else:
    print("Fail to locate settings block again")

