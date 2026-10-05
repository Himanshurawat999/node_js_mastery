// Routing means: "look at the request, decide what to send back."
// Before frameworks like Express, you do it by hand with plain ifs.
import http from "node:http";

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
