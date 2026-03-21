import subprocess

print("Starting npm install...")
res = subprocess.run(["npm", "install"], capture_output=True, text=True, shell=True)

print("STDOUT:")
print(res.stdout)
print("STDERR:")
print(res.stderr)
print(f"Exit code: {res.returncode}")
