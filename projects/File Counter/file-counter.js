import fs from "node:fs/promises";
try {
  const filePath = process.argv[2];
  if (!filePath) throw new Error("please provide a file path");
  console.log(filePath)
  const context = await fs.readFile(filePath, 'utf-8');
//   console.log(context);
//   console.log(context.includes("\n"));
  console.log(context.split(" "))
} catch (err) {
  console.error(err.message);
}
