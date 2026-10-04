/*
// HTTP is built from a few simple ideas. Here they are as plain data,
// so the vocabulary sticks before we make any real network calls.

// 1) METHODS describe the *intent* of a request.
const methods = ["GET", "POST", "PUT", "DELETE"];
console.log("Methods:", methods.join(", "));   // -> GET, POST, PUT, DELETE

// 2) STATUS CODES describe how a request *turned out*.
const statuses = { ok: 200, created: 201, notFound: 404, serverError: 500 };
console.log("200 means:", "OK");                // success
console.log("404 means:", "Not Found");         // the resource is missing
console.log("500 means:", "Server Error");      // something broke server-side

// 3) HEADERS are key/value metadata that travel with the request/response.
const headers = { "Content-Type": "application/json" };
console.log("Header:", `Content-Type: ${headers["Content-Type"]}`);

// The full cycle: client SENDS a request (method + path + headers),
// the server SENDS BACK a response (status + headers + body).
console.log(`Cycle: GET /users -> ${statuses.ok} OK`);
*/

/*
// In Node 18+ a global fetch() is built in — no import, no install.
// fetch returns a Promise, so we await it inside an async function.

async function getUser() {
  // 1) Send the request and wait for the response object.
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");

  // 2) res.ok is true for 200–299. Always check it before trusting the body.
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  // 3) res.json() reads the body stream and parses it — also a Promise.
  const data = await res.json();

  console.log("Status:", res.status);   // -> Status: 200
  console.log("Name:", data.name);      // -> Name: Ada Lovelace

  // For reference, the whole parsed body this example assumes:
  //   { "id": 1, "name": "Ada Lovelace",
  //     "email": "ada@example.com", "active": true }
  // Only the two lines above are printed — the object itself is not, which
  // is why it belongs in a comment rather than in the output panel.
  return data;
}

const res = await getUser();
console.log(res)
*/



/*
// 🎯 YOUR TURN — replace each ___ then run it (Node 18+).

async function checkStatus() {
  // 1) Send a request to this real, free test endpoint.
  //    fetch returns a Promise, so don't forget to ___ it!
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  // 2) Log the numeric status code the server sent back.
  console.log("Status:", res.status); // 👉 the property holding 200, 404, etc.

  // ✅ Expected output:
  //    Status: 200
}

checkStatus();
*/



/*
// A taste of the next lesson: the http module can also CREATE a server.
// createServer takes a callback that runs for every incoming request,
// giving you a request object (req) and a response object (res).
import http from 'node:http'

const server = http.createServer((req, res) => {
  // Set the status code and a header, then end the response with a body.
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello\n");
});

// Start listening on port 3000. We'll go much deeper next lesson.
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
*/