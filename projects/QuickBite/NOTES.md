Good progress: the files are in `src/`, and `db.js` now has `new MongoClient`. `app.js` has the right first two lines, but the `/health` route won't work yet.

## What's right

- `import express` and `app.use(express.json())` are correct.
- The route is at `/health`, with the right path.

## What needs fixing

1. **`db` is never defined.** When a request hits `/health`, Node throws a `ReferenceError`. Get the database inside the handler with `getDB()`.

2. **The handler never sends a response.** Express ignores what a handler returns, so `return { ok: true }` does nothing. The request hangs until it times out. Use the `res` argument to send the JSON.

3. **`db.command(...)` isn't awaited.** It returns a promise, so the handler has to be `async` and wait for the ping before it responds. Express 5 catches errors thrown from async handlers and passes them to your error handler, so you don't need try/catch.

4. **There's no `export`.** `server.js` needs to import `app`, so add `export default app` at the bottom.

5. **Three items from the plan are missing:**
   - a request logger that you write yourself, placed before the routes
   - a 404 handler after the routes, returning JSON
   - an error handler with four parameters, `(err, req, res, next)`, placed last, returning `{ error }` with `err.status` or 500

One thing in `db.js`: `getDB` is still `async` and spelled with a capital B. The plan calls it `getDb` and says it's synchronous, because `client.db(...)` doesn't need to wait. You can fix that when you next open the file.

`server.js` is still the test-script version. Fix it after `app.js`.

Rewrite the handler and add the three middleware pieces, then paste the new `app.js` here and I'll check it.
