
import { EventEmitter } from "node:events";

// 🎯 MINI-CHALLENGE: a tiny order tracker
// 1. Create an EventEmitter called 'shop'.
// 2. Register a listener for the 'order' event that logs
//    "New order: <item>" using the data you pass in.
// 3. Use .once() for a 'open' event that logs "Shop is open!".
// 4. Emit 'open' twice, then emit 'order' with 'Coffee'.
//
// ✅ Example output:
//    Shop is open!
//    New order: Coffee

// // your code here
// const shop = new EventEmitter();
// shop.on("order", (item) => console.log(`New order: ${item}`));
// shop.once('open', () => console.log("Shop is open!"));
// shop.emit('open')
// shop.emit("order", "coffee");
