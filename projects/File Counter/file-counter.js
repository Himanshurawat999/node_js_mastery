import fs from "node:fs/promises";
import path from "node:path";

const filePath = process.argv[2];

if (!filePath) {
  console.error("error: please provide a file path");
  process.exit(1);
}

let content;
try {
  content = await fs.readFile(filePath, "utf-8");
} catch {
  console.error(`error: could not read file: ${filePath}`);
  process.exit(1);
}

const lines =
  content === ""
    ? 0
    : content.split("\n").length - (content.endsWith("\n") ? 1 : 0);
const trimmed = content.trim();
const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
const characters = content.length;

console.log(`File: ${path.basename(filePath)}`);
console.log(`Lines: ${lines}`);
console.log(`Words: ${words}`);
console.log(`Characters: ${characters}`);
