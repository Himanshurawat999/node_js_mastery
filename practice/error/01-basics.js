/*
// throw creates and "raises" an error. Execution jumps straight
// to the nearest catch block, skipping the rest of the try.
function parseAge(input) {
  const age = Number(input);
  if (Number.isNaN(age)) {
    // new Error(message) builds an Error object carrying details.
    throw new Error('Age must be a number');
  }
  return age;
}

try {
  // If parseAge throws, control jumps to catch immediately.
  const age = parseAge('not-a-number');
  console.log('Age is', age);          // never runs here
} catch (err) {
  // err is the Error object you threw.
  console.log('Caught:', err.message); // -> Caught: Age must be a number
  // err.stack shows where it happened (file + line numbers).
//   console.log(err.stack);
} finally {
  // finally ALWAYS runs — success or failure — great for cleanup.
  console.log('Done validating');      // -> Done validating
}
*/



/*
import { readFile } from 'node:fs/promises';
import { readFile as readFileCb } from 'node:fs';

// The three shapes below are AWAITED one at a time on purpose. Started
// together they finish in whatever order the operating system hands the
// results back — run that version four times and you get four different
// orderings, which is true of your code too and worth knowing.

// 1) try/catch DOES work around await — await re-throws the
//    rejected promise, and catch picks it up.
async function loadConfig() {
  try {
    const text = await readFile('missing.json', 'utf8');
    return JSON.parse(text);
  } catch (err) {
    console.log('Async caught:', err.code); // -> Async caught: ENOENT
    return {};
  }
}
await loadConfig();

// 2) .catch() handles a rejected promise without async/await.
await readFile('missing.json', 'utf8')
  .then((text) => console.log(text.length))
  .catch((err) => console.log('then/catch:', err.code)); // -> then/catch: ENOENT

// 3) Error-first callbacks: the FIRST argument is the error.
//    Check it before using the result. A callback has no promise to await,
//    so wrap it in one when you need to wait for it.
await new Promise((done) => {
  readFileCb('missing.json', 'utf8', (err, data) => {
    if (err) console.log('callback err:', err.code); // -> callback err: ENOENT
    else console.log(data);
    done();
  });
});

// 4) A throw INSIDE an async callback is NOT caught by an outer try/catch —
//    the callback runs later, after try has already exited, so there is no
//    try block on the stack any more. Wrapping it changes nothing:
//
//      try { setTimeout(() => { throw new Error('boom'); }, 0); }
//      catch (err) { console.log('never runs:', err.message); }
//
//    Normally that throw ends the process. The last-resort net is
//    uncaughtException, which is the only reason this block can finish and
//    show you a result. In a real service you log there and then EXIT: the
//    process is in an unknown state, and carrying on is how one bad request
//    turns into corrupted data.
process.on('uncaughtException', (err) => {
  console.log('uncaughtException saw:', err.message);
});
setTimeout(() => { throw new Error('boom'); }, 0);
*/


/*
// 🎯 YOUR TURN — wrap the risky call so a failure can't crash
// the program. Replace each ___ then run it.

function divide(a, b) {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}

try {                              // 👉 the keyword that starts a protected block
  const result = divide(10, 0);    // this throws because b is 0
  console.log('Result:', result);  // skipped when it throws
} catch (err) {                      // 👉 the keyword that handles the error, with (err)
  // 👉 log the human-readable message from the Error object
  console.log('Error:', err.message);      // 👉 the property holding the text
}

// ✅ Expected output:
//    Error: Cannot divide by zero
*/



/*
// A custom error class extends the built-in Error so you can
// recognise specific failures with instanceof and attach data.
class ValidationError extends Error {
  constructor(message, field) {
    super(message);          // sets err.message
    this.name = 'ValidationError';
    this.field = field;      // extra context for the caller
  }
}

function createUser(user) {
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
  return user;
}

try {
  createUser({});
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(`${err.name} on ${err.field}: ${err.message}`);
    // -> ValidationError on email: Email is required
  } else {
    throw err; // re-throw anything we didn't expect
  }
}

// LAST-RESORT safety nets. These catch errors that escaped every
// other handler. Log, then exit — the process is in an unknown state.
process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});
*/