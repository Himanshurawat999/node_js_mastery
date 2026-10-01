/*
// 1. 
import { writeFile, readFile, appendFile } from 'node:fs/promises';

async function main() {
  // 🎯 MINI-CHALLENGE: a tiny journal
  // 1. Write the line "Day 1\n" into journal.txt (overwrites/creates it).
  // 2. Append the line "Day 2\n" to the same file.
  // 3. Read the whole file back as a 'utf8' string and print it.
  // (Use writeFile, then appendFile, then readFile — all with await.)
  //
  // ✅ Example output:
  //    Day 1
  //    Day 2

  // your code here
  await writeFile("journal.txt", "Day 1\n", 'utf-8');
  await appendFile("journal.txt", "Day 2\n", 'utf-8')
  const context = await readFile("journal.txt", 'utf-8')
  console.log(context)
}




main();
*/

/*
// 2
import path from "node:path"
import os from "node:os"

// 🎯 MINI-CHALLENGE: a "system report" line
// 1. Build a log file path inside the user's home folder
//    named "node-app.log" (use os.homedir() + path.join).
// 2. Print that full path.
// 3. Print the file NAME on its own (use path.basename).
// 4. Print how many CPU cores the machine has.
//
// ✅ Example output:
//    Log path: /home/sam/node-app.log
//    File name: node-app.log
//    Cores: 8

// your code here

const fullPath = path.join(os.homedir(), "node-app.log")
console.log("Log path: ",fullPath)
console.log("File name: ", path.basename(fullPath))
console.log("Cores: ", os.cpus().length)
*/




