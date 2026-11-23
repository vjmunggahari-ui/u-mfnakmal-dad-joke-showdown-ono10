import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Dad Joke Showdown entry: one dad joke, told out loud at the dinner table.
// Winner of a 3-way relay ranking (Groq gpt-oss-120b: C>A>B, Z.AI glm-4.5-flash: A>C>B):
// the vacuum-as-favorite-child turn beats the light-bulb "current job" pun (older trope)
// and the dog "gone to the dogs" idiom (most familiar of the three).
const JOKE =
  "I told the kids the new vacuum is my favorite child. It picks up the slack around here.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const entryPath = join(outDir, "entry.txt");
writeFileSync(entryPath, JOKE, "utf8");

// Self-check: read the entry back and confirm the gate, strictly.
// - UTF-8 byte length must be 1-200, and the text must not be only whitespace.
// - The read-back content must equal the joke exactly (no truncation, no re-encoding).
// - The character count (not just bytes) must also be 1-200, so a multi-byte
//   entry cannot slip past the byte check on a character basis.
const back = readFileSync(entryPath, "utf8");
const bytes = Buffer.byteLength(back, "utf8");
const chars = [...back].length;
if (bytes < 1 || bytes > 200) {
  throw new Error(`entry.txt failed the gate: ${bytes} bytes`);
}
if (chars < 1 || chars > 200) {
  throw new Error(`entry.txt failed the gate: ${chars} characters`);
}
if (back.trim().length === 0) {
  throw new Error("entry.txt failed the gate: only whitespace");
}
if (back !== JOKE) {
  throw new Error("entry.txt failed the read-back: content differs from the joke");
}
console.log(`wrote ${entryPath} (${bytes} bytes, ${chars} chars, read-back verified)`);
