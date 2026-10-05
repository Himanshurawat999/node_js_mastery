import path from "node:path";
import fs from "node:fs";

const inputPath = process.argv[2];
const folder = inputPath ? path.resolve(inputPath) : process.cwd();

try {
  const folderName = path.basename(folder);
  const lists = fs.readdirSync(folder, { withFileTypes: true });
  const types = { folder: folderName, path: folder, file: 0, folders: 0 };
  for (const list of lists) {
    if (list.isFile()) types.file++;
    else types.folders++;
  }
  for (const key in types) {
    console.log(`${key}: ${types[key]}`);
  }
} catch {
  console.error(`error: could not read folder: ${inputPath ?? folder}`);
  process.exitCode = 1;
}
