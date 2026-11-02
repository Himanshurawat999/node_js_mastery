# QuickBite

A food delivery backend built with Node.js, Express 5 and MongoDB.

> Draft: the plan asks for this section in your own words. Rewrite it before you tick Phase 0.

## Why MongoDB for QuickBite

**Database, collection and document.** A MongoDB database holds collections. A collection plays the role of an SQL table. A document plays the role of a row, except it's a JSON-like object that can contain nested objects and arrays, and documents in one collection don't all need the same fields.

**Why documents fit menus and orders.** A dish's details and an order's items are read together, every time. A document keeps them in one place, so the app fetches a whole order in one read without joining tables.

**When I would not choose MongoDB.** If the data is mostly tables with many relationships, and reports need many joins across them, a relational database fits better. The same applies when every record must follow a strict schema and be checked across tables.

**What Atlas gives us.** Managed hosting, automatic backups, a replica set by default (which is what makes transactions work), TLS, monitoring, and a free M0 tier to learn on. We can move to a bigger cluster later without changing the code.

## Setup

1. `npm install`
2. Create `.env` with `MONGODB_URI`, `DB_NAME`, `PORT` and `JWT_SECRET`.
3. `npm run dev`
4. Open `http://localhost:<PORT>/health`. It should return `{ "ok": true }`.
