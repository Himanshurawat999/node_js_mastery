import express from "express";
import { getDB } from "./db.js";

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.json());

app.get("/health", async (req, res) => {
  const db = getDB();
  await db.command({ ping: 1 });
  res.json({ ok: true });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error("Caught:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

export default app;
