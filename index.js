import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";
import {watch} from "node:fs";

// const dir = path.dirname(fileURLToPath(import.meta.url));
// const entries = await fs.readdir(dir, { withFileTypes: true });
// console.log("Entries: ", entries);

// for (const entry of entries) {
//   if (entry.isFile()) console.log("File: ", entry.name);
//   else if (entry.isDirectory()) console.log("Directory: ", entry.name);
// }

// const fd = await fs.open('C:/Projects/project files/omega/Doubts.txt', 'r');
// const content = await fd.readFile({ encoding: 'utf8' });
// console.log(content);
// await fd.close();

// const fr = await fs.open('C:/Projects/project files/omega/Doubts.txt', 'r');
// const buffer = Buffer.alloc(100);
// const { bytesRead } = await fr.read(buffer, 0, 100, 0);
// console.log(buffer.toString('utf8', 0, bytesRead));
// await fr.close();

const watches = watch("data.txt")
watches.on("change", async (eventType, filename) => {
  const context = await fs.readFile("data.txt", { encoding: "utf8" });
  console.log("File content: ", context);
  console.log("File changed");
  console.log("Event Type: ", eventType);
  console.log("Filename: ", filename);
});