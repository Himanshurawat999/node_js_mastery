// EventEmitter is a built-in class. Pull it off the 'node:events' module.
// import EventEmitter from 'node:events';

// // Create an emitter — think of it as a tiny radio station.
// const radio = new EventEmitter();

// // .on(name, listener) SUBSCRIBES: run this function whenever 'news' fires.
// radio.on('news', (headline) => {
//   console.log(`Listener heard: ${headline}`);
// });

// // .emit(name, ...args) FIRES the event and passes data to every listener.
// radio.emit('news', 'Node 22 released');   // -> Listener heard: Node 22 released
// radio.emit('news', 'Events are easy');     // -> Listener heard: Events are easy

// // Listeners run SYNCHRONOUSLY, in the order they were registered.

// import EventEmitter from 'node:events';
// const bus = new EventEmitter();

// // You can attach MANY listeners to the same event — all of them run.
// bus.on('start', () => console.log('A: warming up'));
// bus.on('start', () => console.log('B: ready'));

// // .once() runs ONE time, then removes itself automatically.
// bus.once('start', () => console.log('C: this fires only once'));

// // A named function so we can remove it later.
// function onTick(n) { console.log(`tick ${n}`); }
// bus.on('tick', onTick);

// bus.emit('start');   // A, B, and C all run
// bus.emit('start');   // A and B run again — C is already gone

// bus.emit('tick', 1);            // -> tick 1
// bus.off('tick', onTick);        // .off() removes the listener (alias: removeListener)
// bus.on('tick', onTick);            // nothing — no listener left
// bus.emit('tick', 2);            // -> tick 2
// bus.off('tick', onTick);            // -> tick 2
// bus.emit('tick', 3);            // -> tick 3

import EventEmitter from 'node:events';

// Your own classes can BE emitters by extending EventEmitter.
// class Logger extends EventEmitter {
//   write(message) {
//     // Do the work, then announce it by emitting a custom event.
//     this.emit('log', { message, time: Date.now() });
//   }
// }

// const logger = new Logger();

// // Subscribe to the custom 'log' event this class emits.
// logger.on('log', (entry) => {
//   console.log(`[Log] ${entry.message}`);
// });

// logger.write('user signed in');   // -> [LOG] user signed in

// // 'error' is SPECIAL: if you emit it with no listener, the process CRASHES.
// logger.on('error', (err) => {
//   console.log(`Handled: ${err.message}`);
// });
// logger.emit('error', new Error('disk full'));  // -> Handled: disk full


