import http from "node:http";

/*
// Routing means: "look at the request, decide what to send back."
// Before frameworks like Express, you do it by hand with plain ifs.

const server = http.createServer((req, res) => {
  // req.url is the path the browser asked for (e.g. "/about").
  // req.method is the HTTP verb (e.g. "GET", "POST").

  // Route 1: the home page — GET /
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome home"); // -> Welcome home
    return; // stop: we already responded
  }

  // Route 2: the about page — GET /about
  if (req.method === "GET" && req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("About this site"); // -> About this site
    return;
  }

  // Fallback: nothing matched, so this is a 404 Not Found.
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found"); // -> Not Found
});

server.listen(3000, () => console.log("Listening on http://localhost:3000"));
*/




/*
const server = http.createServer((req, res) => {
  // req.url includes BOTH the path AND the query string, e.g.
  //   "/greet?name=Sam"
  // Comparing that whole string is fragile. Parse it instead.
  // The second argument is a base — required because req.url is relative.
  const url = new URL(req.url, 'http://localhost');
  console.log("req.url: ",req.url)
  console.log("url.pathname: ", url.pathname)
  console.log("url: ", url.searchParams.getAll('name'))

  // url.pathname is just the path with NO query string: "/greet"
  if (url.pathname === '/greet') {
    // url.searchParams reads ?key=value pairs safely.
    // If "name" is missing, default to "stranger".
    const name = url.searchParams.get('name') || 'stranger';
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello, ${name}!`);          // -> Hello, Sam!
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(3000, () => console.log("Listening on 3000"));
*/




/*
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  // Helper: always send JSON with the right status code.
  const sendJson = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // The SAME path can behave differently per method.
  if (path === '/users') {
    if (req.method === 'GET') {
      return sendJson(200, { users: ['Ana', 'Bo'] });
    }
    if (req.method === 'POST') {
      return sendJson(201, { created: true });   // 201 = Created
    }
    // Path exists, but this verb isn't allowed here.
    res.writeHead(405, { 'Allow': 'GET, POST' }); // 405 = Method Not Allowed
    return res.end('Method Not Allowed');
  }

  // No path matched at all -> 404 Not Found.
  return sendJson(404, { error: 'Not Found' });
});

server.listen(3000);
*/



/*
const server = http.createServer((req, res) => {
  // 🎯 YOUR TURN — replace each ___ then run it.

  // 1) Handle GET /hello by sending the text "Hi there!"
  if (req.method === 'GET' && req.url === '/hello') {  // 👉 'GET' and '/hello'
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hi there!');                                 // 👉 'Hi there!'
    return;                                         // 👉 stop after responding
  }

  // 2) Everything else is a 404 — fill in the status code.
  res.writeHead(404, { 'Content-Type': 'text/plain' }); // 👉 404
  res.end('Not Found');
});

server.listen(3000);

// ✅ Expected output:
//    $ curl localhost:3000/hello   ->  Hi there!
//    $ curl localhost:3000/other   ->  Not Found
*/