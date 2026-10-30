import express from "express";
const app = express();
app.use(express.json());
app.get("/health", () => {
  db.command({ ping: 1 });
  return { ok: true };
});
