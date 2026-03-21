filepath = r"c:\Users\Admin\Documents\Admission_Counselling_Platform\backend\src\routes\sessionRoute.js"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = "} catch (e) { res.status(400).json({ error: 'Session creation failed triggers configurations.' }); }"

replace = "} catch (e) { res.status(400).json({ error: e.message }); }"

if target in content:
    content = content.replace(target, replace)
    print("Replaced single quotes")
else:
    target2 = target.replace("'", '"')
    if target2 in content:
        content = content.replace(target2, replace)
        print("Replaced double quotes")
    else:
        print("Target not found at all!")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
