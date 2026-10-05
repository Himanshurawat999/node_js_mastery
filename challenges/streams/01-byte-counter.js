
// 4
import fs from "node:fs";

// 🎯 MINI-CHALLENGE: stream a file and count its bytes
// 1. Open 'notes.txt' with fs.createReadStream (no encoding = raw Buffers).
// 2. On each 'data' chunk, add chunk.length to a running total.
// 3. On 'end', print the total number of bytes.
// 4. On 'error', print the error message so a missing file won't crash you.
//
// ✅ Example output:
//    notes.txt is 2048 bytes

// your code here
fs.writeFileSync("notex.txt", "hello, ".repeat(99999));
const notes = fs.createReadStream("notex.txt", {
  highWaterMark: (1024 * 1024 * 1) / 2,
});
let totalstream=0;
notes.on("data", (chunk) => {
  totalstream += chunk.length;
  console.log("chunks: ", chunk.length);
});
notes.on("end", () => console.log("total chunks: ", totalstream));
notes.on("error", (err) => console.error("Write error:", err.message));
