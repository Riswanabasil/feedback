// backend/src/ml/index.js
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import natural from "natural";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_PATH = path.join(__dirname, "classifier.json");
let classifier;

// Cap training rows for speed (set in .env). 0 = no cap.
const MAX_ROWS = parseInt(process.env.MAX_ROWS || "0", 10);

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function loadOrTrain(csvPath) {
  console.log("[ML] MODEL_PATH:", MODEL_PATH);

  // Load saved model if present
  if (fs.existsSync(MODEL_PATH)) {
    const raw = fs.readFileSync(MODEL_PATH, "utf8");
    classifier = natural.BayesClassifier.restore(
      JSON.parse(raw),
      natural.BayesClassifier
    );
    console.log("[ML] Loaded classifier from file.");
    return;
  }

  if (!csvPath) throw new Error("CSV path needed for first training");
  const abs = path.resolve(csvPath);
  console.log("[ML] Training from CSV:", abs, MAX_ROWS ? `(cap ${MAX_ROWS})` : "");

  classifier = new natural.BayesClassifier();

  let count = 0;
  let finished = false;

  await new Promise((resolve, reject) => {
    const rs = fs.createReadStream(abs);
    const parser = csv({
      mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, ""),
    });

    const finish = () => {
      if (finished) return;
      finished = true;
      console.log(`[ML] Final row count: ${count}. Training…`);
      classifier.train();
      fs.writeFileSync(MODEL_PATH, JSON.stringify(classifier));
      console.log("[ML] Saved model to:", MODEL_PATH);
      resolve();
    };

    rs.pipe(parser)
      .on("data", (row) => {
        const text = normalize(
          row.text || row.Text || row.comment || row.review || row.message || ""
        );
        const label = String(
          row.Emotion || row.emotion || row.label || row.sentiment || ""
        )
          .toLowerCase()
          .trim();

        if (text && label) {
          classifier.addDocument(text, label);
          count++;
          if (count % 50000 === 0) console.log(`[ML] Read ${count} rows…`);
          if (MAX_ROWS && count >= MAX_ROWS) {
            console.log(`[ML] Cap reached at ${count}. Stopping read…`);
            rs.destroy(); // triggers 'close'
          }
        }
      })
      .on("end", finish)
      .on("error", (err) => {
        console.error("[ML] CSV read error:", err);
        if (!finished) reject(err);
      });

    rs.on("close", finish);
    rs.on("error", (err) => {
      console.error("[ML] Stream error:", err);
      if (!finished) reject(err);
    });
  });
}

export function predictSentiment(text) {
  if (!classifier) throw new Error("Classifier not ready");
  return classifier.classify(normalize(text));
}
