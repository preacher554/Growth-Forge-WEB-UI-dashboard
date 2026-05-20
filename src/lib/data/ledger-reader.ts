import * as fs from "node:fs";
import * as path from "node:path";

const LEDGER_DIR = path.join(process.cwd(), "data", "ledgers");

export function readJsonl<T>(fileName: string): T[] {
  const filePath = path.join(LEDGER_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}
