// 🎯 MINI-CHALLENGE: a tiny "API key" gate.
// Save as gate.js and run: node gate.js
//
// 1. Write a middleware checkKey(req, res, next) that looks at
//    req.query.key (the ?key=... part of the URL).
// 2. If the key equals "secret", call next() to allow the request.
// 3. Otherwise respond res.status(401).json({ error: "no access" })
//    and do NOT call next().
// 4. Register it with app.use(checkKey) BEFORE your routes.
//
// ✅ Expected:
//    GET /data?key=secret  -> 200 {"ok":true}
//    GET /data             -> 401 {"error":"no access"}

import express from "express";
const app = express();

// your code here

const checkkey = (req, res, next) => {
  if (req.query.key !== "secret") {
    res.status(401).json({ error: "no access" });
    return;
  }
  next();
};

app.use(checkkey);

app.get("/data", (req, res) => res.json({ ok: true }));
app.listen(3000);
