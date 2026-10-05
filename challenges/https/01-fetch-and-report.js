// 🎯 MINI-CHALLENGE: fetch and report
// 1. Write an async function called getTitle().
// 2. await fetch() this URL:
//      https://jsonplaceholder.typicode.com/posts/1
// 3. Check res.ok — if it's false, log "Request failed" and stop.
// 4. Parse the body with await res.json().
// 5. Log the post's title (the data.title field).
//
// ✅ Example output:
//    Status: 200
//    Title: sunt aut facere repellat provident occaecati...

async function getTitle() {
  // your code here
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
    const data = await res.json();
    console.log('Status: ', res.status)
    console.log('Title: ',data.title)
  } catch (err) {
    console.error(err.message)
  }
}

getTitle();
