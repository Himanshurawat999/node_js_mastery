import fs from "node:fs/promises";
import { PDFParse } from "pdf-parse";

const data = await fs.readFile(
  "C:/Projects/project files/omega/Field/uploads/actiongypsum_3512_20260811_10294992_4880668060.pdf",
);
const parser = new PDFParse({data});
console.log("Parser: ", parser);
const result = await parser.getText();
console.log('result: ',result);
