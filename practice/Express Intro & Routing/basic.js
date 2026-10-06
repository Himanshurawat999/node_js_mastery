import express from 'express'
import userRoutes from "./birds.js"
const app = express();


/*
// Define a route: when a GET request hits "/", run this handler.
// req = the incoming request, res = the response you send back.
app.get('/', (req, res) => {
  res.send('Hello');          // send plain text back to the browser
});

// Start listening for connections on port 3000.
// The callback runs once the server is up and ready.
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
*/


/*
// One method per HTTP verb. Same path, different verb = different handler.
app.get('/users', (req, res) => res.send('List of users'));
app.post('/users', (req, res) => res.send('Create a user'));
app.put('/users/:id', (req, res) => res.send('Replace a user'));
app.delete('/users/:id', (req, res) => res.send('Delete a user'));

// Route parameters: anything after ":" is captured into req.params.
// A request to /users/42 sets req.params.id to the string "42".
app.get('/users/:id', (req, res) => {
  res.send(`User ${req.params.id}`);   // -> "User 42"
  console.log(req.params)
});

// Query strings come in through req.query.
// A request to /search?q=cats sets req.query.q to "cats".
app.get('/search', (req, res) => {
  res.send(`You searched for: ${req.query.q}`);
  console.log(req.query)
});

app.listen(3000);
*/


/*
// 🎯 YOUR TURN — add a route, then run the server.

// 1) Handle GET requests to "/ping"
app.get('/ping', (req, res) => {     // 👉 the method for GET requests
  // 2) Send back JSON: { pong: true }
  res.send({ pong: true });           // 👉 the method that sends JSON
});

app.listen(3000);

// ✅ Expected output when you visit http://localhost:3000/ping :
//    {"pong":true}
*/



/*
// res.send() picks a sensible Content-Type for you (text or HTML).
app.get('/hello', (req, res) => {
  res.send({greeting:'Hello there'});
});

// res.json() serialises an object to JSON and sets the JSON header.
app.get('/api/user', (req, res) => {
  res.json({ id: 1, name: 'Ada', active: true });
});

// res.status(code) sets the HTTP status. Chain .json() to send a body.
// 404 = "Not Found" — perfect for a missing resource.
app.get('/api/user/:id', (req, res) => {
  const id = req.params.id;
  if (id !== '1') {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: 1, name: 'Ada' });
});

app.listen(3000);
*/


/*
// 🎯 MINI-CHALLENGE: a tiny greeting API
// 1. GET /              -> send the text "Welcome"
// 2. GET /greet/:name   -> send JSON { message: "Hello, <name>" }
//    (read the name from req.params.name)
// 3. Anything else      -> you can leave it; Express 404s by default
// 4. app.listen(3000) so the server starts.
//
// ✅ Example output:
//    GET /            -> Welcome
//    GET /greet/Sam   -> {"message":"Hello, Sam"}

// your code here

app.get('/', (req,res) => {
    res.send("Welcome")
    console.log(app)
})

// Name Parameters
app.get('/greet/:name', (req,res) => {
    res.json({message:`Hello, ${req.params.name}`})
})

// optional segments
app.get('/student{/:class}', (req, res) => {
    res.json(req.params)
})

app.get('/:file{.:ext}', (req, res) => {
    console.log(req.params.file, req.params.ext)
    res.send('ok')
})

// wildcard
app.get('/{*wildcard}', (req, res) => {
    console.log("url: ",req.url)
    console.log("path: ", req.path)
    res.send('ok')
})
*/


// Route handlers
app.get('/user/:id', (req, res, next) => {
    if(req.params.id === '0') return next('route')
    res.send(`User ${req.params.id}`)
})

app.get('/user/:id', (req, res) => {
    res.send('Special handler for user ID 0')
})


// A combination of independent functions and arrays of functions can handle a route. 
const cb0 = function (req, res, next) {
  console.log('CB0');
  next();
};

const cb1 = function (req, res, next) {
  console.log('CB1');
  next();
};

app.get(
  '/example/d',
  [cb0, cb1],
  (req, res, next) => {
    console.log('the response will be sent by the next function ...');
    next();
  },
  (req, res) => {
    res.send('Hello from D!');
  }
);


// express.Router
app.use("/go", userRoutes)


app.listen(3000);
