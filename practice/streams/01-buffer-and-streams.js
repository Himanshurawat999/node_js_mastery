import fs from "node:fs";


// const buf = Buffer.from('hello')
// console.log(buf.toString())
// console.log(buf.length)




// The file this example reads. In your own project it would already exist;
// the block writes it so it can stand on its own. 143,966 characters is
// deliberate: the default chunk size is 65,536 bytes, so it arrives in
// exactly three pieces — two full ones and a remainder.
// fs.writeFileSync('big.txt', 'x'.repeat(143966));

// // createReadStream gives you the file PIECE BY PIECE instead of all at once.
// // Passing 'utf8' makes each chunk a string instead of a raw Buffer.
// const stream = fs.createReadStream('big.txt', 'utf8');

// let totalChars = 0;

// // 'data' fires once for every chunk Node reads off the disk.
// stream.on('data', (chunk) => {
//   totalChars += chunk.length;
//   console.log('Got a chunk of', chunk.length, 'characters');
// });

// // 'end' fires once, after the LAST chunk has arrived.
// stream.on('end', () => {
//   console.log('Done. Total characters:', totalChars);
// });

// // Always handle 'error' — a missing file would otherwise crash the process.
// stream.on('error', (err) => {
//   console.error('Stream failed:', err.message);
// });



// 🎯 YOUR TURN — replace each ___ then run it with: node turn.js

// 1) Make a Buffer from a string of your choice
// const buf = Buffer.from('stream');   // 👉 put text in 'single quotes', e.g. 'stream'

// // 2) Log how many BYTES it holds
// console.log(buf.length);           // 👉 the property that gives the byte count

// // 3) Log it back as readable text
// console.log(buf.toString());         // 👉 the method that decodes bytes to a string

// ✅ Expected output (for 'stream'):
//    6
//    stream




// Same stand-in file as the read example above, so this block runs alone too.
// fs.writeFileSync('big.txt', 'y'.repeat(143966));

// // A Readable stream: where the data comes FROM.
// const source = fs.createReadStream('big.txt');

// // A Writable stream: where the data goes TO.
// const dest = fs.createWriteStream('copy.txt');

// // pipe() connects them: every chunk read from source is written to dest,
// // and Node automatically handles backpressure (pausing when dest is busy).
// source.pipe(dest);

// // 'finish' fires on the WRITABLE side when all data has been flushed.
// dest.on('finish', () => {
//   console.log('File copied with constant, low memory use!');
// });

// source.on('error', (err) => console.error('Read error:', err.message));
// dest.on('error', (err) => console.error('Write error:', err.message));

