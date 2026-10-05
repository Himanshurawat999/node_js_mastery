import http from "node:http";

// 🎯 MINI-CHALLENGE: a tiny two-route server (no router yet).
// 1. Create a server with http.createServer.
// 2. If req.url is '/' respond with the text "Home".
// 3. If req.url is '/about' respond with the text "About us".
// 4. For anything else, send status 404 and the text "Not found".
// 5. Listen on port 3000 and log a message when it starts.
//
// ✅ Example output:
//    curl localhost:3000/        -> Home
//    curl localhost:3000/about   -> About us
//    curl localhost:3000/nope    -> Not found   (status 404)

// your code here
const server = http.createServer((req, res) => {
  console.log(req.url);
  res.statusCode = 200;
  res.setHeader("content-type", "text/plain");
  if (req.url === "/") {
    res.write("home");
  }
  else if (req.url === "/about") {
    res.write("about us");
  }
  else {
    res.statusCode = 404;
    res.write("not found");
  }
  res.end();
});

server.listen(3000, () => console.log("Listening on 3000"));
