import express from "express";
const app = express();

/*
// A REST API exposes RESOURCES (like "books") at URLs, and uses HTTP
// METHODS to say what to do: GET=read, POST=create, PUT=update, DELETE=remove.
app.use(express.json()); // so we can read JSON request bodies later

// Our "database" is just an in-memory array for this lesson.
let books = [
  { id: 1, title: "Dune" },
  { id: 2, title: "1984" },
];

app.get("/books{/:id}", (req, res) => {
  if (req.params.id) {
    const book = books.find((b) => b.id === Number(req.params.id));
    book ? res.json(book) : res.status(404).json({ error: "Not found" });
  } else {
    res.json(books);
  }
});

app.post("/books", (req, res) => {
  // Validate input first — never trust the client.
  if (!req.body.title) {
    return res.status(400).json({ error: "title is required" });
  }

  const book = { id: books.length+1, title: req.body.title };
  books.push(book);
  console.log(books)

  // 201 Created is the correct status for a successful POST.
  // It's polite to return the newly created resource.
  res.status(201).json(book);
});

app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Not found" });
  book.title = req.body.title;
  res.json(book);            // 200 with the updated resource
});


app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = books.some((b) => b.id === id);
  if (!exists) return res.status(404).json({ error: "Not found" });
  books = books.filter((b) => b.id !== id);
  res.status(204).end();     // 204 No Content: success, nothing to return
});

app.listen(3000);
*/


/*
app.use(express.json());

let todos = [{ id: 1, text: "Learn REST" }];
let nextId = 2;

// TODO 1: GET /todos should return the whole list as JSON.
app.get("/todos", (req, res) => {
  res.json(todos);          // 👉 the todos array
});

// TODO 2: POST /todos should create a todo from req.body.text,
//         push it, and respond with status 201 and the new todo.
app.post("/todos", (req, res) => {
  const todo = { id: nextId++, text: req.body.text };
  todos.push(todo);
  res.status(201).json(todo);   // 👉 the "Created" status code
});

app.listen(3000, () => console.log("API on 3000"));

// ✅ After POST /todos {"text":"Ship it"}:
//    GET /todos -> [{"id":1,...},{"id":2,"text":"Ship it"}]
*/