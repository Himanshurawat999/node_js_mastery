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
