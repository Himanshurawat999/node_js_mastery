import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const entries = await fs.readdir(dir, { withFileTypes: true });
console.log("Entries: ", entries);

for (const entry of entries) {
  if (entry.isFile()) console.log("File: ", entry.name);
  else if (entry.isDirectory()) console.log("Directory: ", entry.name);
}