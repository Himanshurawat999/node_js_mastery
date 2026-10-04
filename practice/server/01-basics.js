import http from 'node:http'

/*
// Pull in Node's built-in http module — no install needed.

// createServer takes ONE handler function. Node calls it for
// EVERY request that arrives. req = the incoming request,
// res = the response you build and send back.
const server = http.createServer((req, res) => {
  // res.end() sends the body AND closes the response. Without
  // it the browser/curl just hangs forever waiting for more.
  res.end('Hello from Node!');
});

// Nothing happens until the server starts LISTENING on a port.
// The callback fires once it's ready. The server then stays
// running, waiting for requests, until you stop it.
const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
*/



/*
const server = http.createServer((req, res) => {
  // Option A — set the status code and headers in one call.
  // writeHead(statusCode, headersObject) must run BEFORE res.end.
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Plain text, status 200');
});

server.listen(3000, () => console.log('Listening on 3000'));
*/




/*
const server = http.createServer((req, res) => {
  // Option B — set things one at a time. Same result, more control.
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  // To send JSON you must turn a JS object into a STRING first.
  // JSON.stringify does exactly that.
  const data = { message: 'Hello, JSON!', ok: true };
  res.end(JSON.stringify(data));
});

server.listen(3000, () => console.log('Listening on 3000'));
*/




/*
const server = http.createServer((req, res) => {
  // req.method is the HTTP verb: 'GET', 'POST', 'PUT', ...
  // req.url is the path that was requested, e.g. '/users?id=7'
  console.log(`${req.method} ${req.url}`);

  if (req.method === 'POST') {
    // A request body arrives in CHUNKS over a stream, not all at
    // once. Collect the chunks as they come in...
    let body = '';
    req.on('data', (chunk) => { body += chunk; });

    // ...then the 'end' event fires when the whole body is here.
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ youSent: body }));
    });
  } else {
    res.end(`You asked for ${req.url}`);
  }
});

server.listen(3000, () => console.log('Listening on 3000'));
*/




// 🎯 YOUR TURN — finish the handler so it replies with JSON.
const server = http.createServer((req, res) => {
  // 1) Set the status code to 200 (OK)
  res.statusCode = 200;                          // 👉 the success code

  // 2) Tell the client the body is JSON
  res.setHeader('Content-Type', 'application/json');          // 👉 application/json

  // 3) Turn this object into a string and send it
  const payload = { message: 'ok' };
  res.end(JSON.stringify(payload));                                  // 👉 JSON.stringify(payload)
});

server.listen(3000, () => console.log('Listening on 3000'));

// ✅ Expected — curl http://localhost:3000
//    {"message":"ok"}