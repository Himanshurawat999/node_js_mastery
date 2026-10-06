// 🎯 MINI-CHALLENGE: complete the CRUD for a "notes" resource.
// Save as notes.js and run: node notes.js
//
// Starting data:  let notes = [{ id: 1, body: "first note" }];
//
// Implement all four:
//   GET    /notes        -> 200 list of notes
//   GET    /notes/:id    -> 200 one note, or 404 if missing
//   PUT    /notes/:id    -> 200 updated note (set body from req.body.body)
//   DELETE /notes/:id    -> 204 on success, 404 if missing
//
// Remember: req.params.id is a string — convert with Number().
//
// ✅ Example:
//    GET /notes/1 -> {"id":1,"body":"first note"}

import express from 'express'
const app = express();
app.use(express.json());

let notes = [{ id: 1, body: "first note" }];

// your code here


app.listen(3000);