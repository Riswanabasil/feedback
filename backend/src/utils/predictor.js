
// export async function predictEmotion(text) {
//   const t = (text || "").toLowerCase();
//   if (t.includes("hate") || t.includes("angry")) return "hate";
//   if (t.includes("love") || t.includes("glad") || t.includes("happy")) return "love";
//   if (t.includes("worry") || t.includes("anxious")) return "worry";
//   return "neutral";
// }
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import natural from "natural";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Put CSV at backend/data/EmotionDetection.csv
const CSV_PATH = path.resolve(__dirname, "../../data/EmotionDetection.csv");

// In-memory cache
let classifierCache = null;
let trainingPromise = null;
let status = { ready: false, rows: 0 };

function readCsv(limit = Infinity) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on("data", (row) => {
        if (rows.length < limit) rows.push(row);
      })
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

async function train(limit = Infinity) {
  const rows = await readCsv(limit);
  const clf = new natural.BayesClassifier();
  for (const r of rows) {
    const text = ((r.text || r.Text || "") + "").toLowerCase().trim();
    const label = ((r.Emotion || r.emotion || "") + "").toLowerCase().trim();
    if (!text || !label) continue;
    clf.addDocument(text, label);
  }
  clf.train();
  classifierCache = clf;
  status = { ready: true, rows: rows.length };
  return clf;
}

export function ensureModelReady(limit = Infinity) {
  if (classifierCache) return Promise.resolve(classifierCache);
  if (!trainingPromise) trainingPromise = train(limit);
  return trainingPromise;
}

export async function predictEmotion(text) {
  const clf = await ensureModelReady(Number(process.env.MODEL_TRAIN_LIMIT || Infinity));
  return clf.classify((text || "").toLowerCase());
}

export function getModelStatus() {
  return status;
}
