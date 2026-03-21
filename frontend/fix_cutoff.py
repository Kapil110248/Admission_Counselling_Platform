import sys

filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\frontend\src\pages\AdminDashboard.jsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Locate the first instance of isCutoffModalOpen within the activeTab === 'cutoffs' trigger setups.
search_str = '                  {isCutoffModalOpen && (\n'
if search_str not in content:
    print("Search str not found datasets thresholds configurations.")
    sys.exit(1)

pos = content.find(search_str)
# Find the next trigger of </div>\n              )} to wrap accurately the fragment overlay.
end_pos = content.find('                </div>\n              )}', pos)

if end_pos > 0:
    # Insert </>\n right before the closing setup trigger thresholds accurately setup thresholds.
    content = content[:end_pos + 17] + '                </>\n' + content[end_pos + 17:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success fixing fragment trigger setup layouts configurations accurately setups.")
else:
    print("End position not found accurate setups configurations.")

f.close()
