const fs = require('fs');
const code = fs.readFileSync(process.argv[2], 'utf-8');
const lines = code.split('\n');
lines.forEach((l, i) => {
  if (l.includes('assignedCounsellors')) console.log(`${i+1}: ${l}`);
});
