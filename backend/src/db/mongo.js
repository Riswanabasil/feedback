import mongoose from "mongoose";

export async function connectMongo(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: "ai_react_test" });
  console.log("✅ Mongo connected");
}
