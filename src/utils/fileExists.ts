import fs from "fs";

export default function fileExist(filePath: string): boolean {
  return fs.existsSync(filePath);
}
