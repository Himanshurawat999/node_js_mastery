import http from "node:http"

const server = http.createServer((req, res) => {
  // 🎯 MINI-CHALLENGE: a tiny "todo" API
  // 1. Parse the URL with new URL(req.url, 'http://localhost').
  // 2. For GET /todos  -> respond 200 with JSON: { items: ["learn routing"] }
  // 3. For POST /todos -> respond 201 with JSON: { added: true }
  // 4. For any other method on /todos -> respond 405 (Method Not Allowed).
  // 5. For any other path -> respond 404 with JSON: { error: "Not Found" }.
  // (Remember Content-Type: 'application/json' and JSON.stringify.)
  //
  // ✅ Example output:
  //    GET  /todos  ->  {"items":["learn routing"]}
  //    POST /todos  ->  {"added":true}
  //    GET  /nope   ->  {"error":"Not Found"}

  const sendRes = (status, data) => {
    res.writeHead(status, {'Content-Type':'application/json'})
    res.end(JSON.stringify(data))
    return;
  }

  // your code here
  const url = new URL(req.url, 'http://localhost')
  if(url.pathname==='/todos' && req.method==='GET') {
    sendRes(200, {items: ["learn routing"]})
  } else if(url.pathname==='/todos' && req.method==='POST') {
    sendRes(201, {added: true})
  } else if(url.pathname==='/todos' || (!req.method==='GET' || !req.method==='POST')) {
    res.statusCode=405;
    res.end()
    return;
  } else {
    sendRes(404, {error: "NOT Found"})
  }
});

server.listen(3000, () => console.log("Listening on localhost:3000"));