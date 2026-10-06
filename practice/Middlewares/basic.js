import express from 'express';
const app = express();

/*
const myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

app.use(myLogger);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
*/


/*
const logger = (req, res, next) => {
  req.startTime = Date.now();      // attach data to req for later middleware
  console.log("1. Logger: " + req.method + " " + req.url);
  next();
};

const auth = (req, res, next) => {
  req.user = { name: "Sam" };      // share data down the chain
  console.log("2. Auth: attached user " + req.user.name);
  next();
};

app.use(logger)
app.use(auth)

// 3) The route handler can read everything the middleware added.
app.get("/", (req, res) => {
  const ms = Date.now() - req.startTime;
  res.send("Hi " + req.user.name + " (handled in " + ms + "ms)");
});

app.listen(3000);
*/



/*
app.use(express.json());           // built-in body parser for JSON

app.post("/echo", (req, res) => {
  // Thanks to express.json(), req.body is a real object here.
  res.json({ youSent: req.body });
});

// ERROR-HANDLING middleware has FOUR arguments: (err, req, res, next).
// Express recognizes it by the four-argument signature and calls it
// whenever a handler throws or passes an error to next(err).
app.get("/boom", (req, res) => {
  throw new Error("Something broke");
});

app.use((err, req, res, next) => {
  console.error("Caught:", err.message);
  res.status(500).json({ error: err.message });
});

app.listen(3000);

// POST /echo with body {"hi":1}  ->  {"youSent":{"hi":1}}
// GET  /boom                     ->  500 {"error":"Something broke"}
*/




/*
// TODO 1: write a middleware that logs the request method and url,
//         then calls next(). Remember the (req, res, next) signature.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();   // 👉 pass control to the next handler
});

// TODO 2: add a middleware that puts the current time on req.now,
//         then continues the chain.
app.use((req, res, next) => {
  req.now = Date.now();        // 👉 a Date or timestamp
  next();
});

app.get("/", (req, res) => {
  res.send("Request handled at " + req.now);
});

app.listen(3000, () => console.log("Listening on 3000"));

// ✅ Expected log when you visit GET / :
//    GET /
*/