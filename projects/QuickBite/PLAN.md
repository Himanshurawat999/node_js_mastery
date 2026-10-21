# QuickBite: Project Plan

QuickBite is a food delivery backend built with Node.js, Express 5 and MongoDB. It covers every [roadmap.sh/mongodb](https://roadmap.sh/mongodb) topic that can be practiced in app code. It also covers the Level 4 topics from [your roadmap](../../roadmap/MongoDB-Roadmap.md): change streams, time series, GridFS, capped collections and advanced aggregation.

The roadmap's developer tools, security and scaling topics are in [Future scope](#future-scope). You'll do them after the main project.

## What QuickBite does

| Role | What they can do |
| --- | --- |
| Customer | Find nearby restaurants, search dishes, order and pay from a wallet, track the delivery live, write reviews |
| Restaurant owner | Manage the restaurant and menu (including CSV import and photos), accept orders, see a dashboard |
| Rider | Claim ready orders and send GPS location while delivering |
| Admin | See reports and a live audit log |

## Decisions made up front

| Decision | Choice | Why |
| --- | --- | --- |
| Library | Official `mongodb` driver, no Mongoose | roadmap.sh teaches MongoDB itself. With the driver you write every query, index and pipeline yourself, so nothing is hidden. |
| Database | Your Atlas free cluster (M0), database `quickbite` | It's a 3-node replica set, so transactions and change streams work. Atlas Search exists only on Atlas. |
| Auth | JWT (`jsonwebtoken`) and `bcryptjs` | `bcryptjs` is pure JavaScript, so it installs on Windows without build tools |
| Money | `Decimal128` in the database, integer paise in JavaScript | `0.1 + 0.2` is `0.30000000000000004` in JavaScript |
| Time | Store UTC `Date`s and report in `Asia/Kolkata` | MongoDB always stores UTC. Convert only when showing or grouping by day. |

## At a glance

| Phase | You build | Main topics | Rough time at 1–2 h/day |
| --- | --- | --- | --- |
| [0](#phase-0-setup-and-foundations) | App skeleton and DB connection | MongoDB basics, Express structure | 1–2 days |
| [1](#phase-1-data-model-and-validation) | Collections and validation rules | Data types, embed vs reference, `$jsonSchema`, `validate` | 3–4 days |
| [2](#phase-2-users-restaurants-and-menus-crud) | Auth, restaurants, menus, cart | CRUD methods, counting, middleware | 1 week |
| [3](#phase-3-import-export-and-photos) | CSV import and export, dish photos | `bulkWrite`, cursors, `$type`, GridFS, Node streams | 4–5 days |
| [4](#phase-4-browse-and-filter) | Browse and filter endpoints | All query operators, projection, pagination | 3–4 days |
| [5](#phase-5-indexes-nearby-and-search) | Fast queries, "near me", OTP login, search | All index types, `explain()`, Atlas Search | 1 week |
| [6](#phase-6-orders-and-transactions) | Ordering and wallet | Transactions, read/write concerns, retryable writes | 1 week |
| [7](#phase-7-reviews-and-dashboards) | Reviews and dashboards | Aggregation pipeline | 1 week |
| [8](#phase-8-live-tracking) | Live order and rider tracking | Change streams, time series, capped collections | 1 week |
| [9](#phase-9-backup-and-wrap-up) | Backups and final polish | `mongodump`, `mongorestore` | 2–3 days |

Total: about 8–10 weeks. Go slower if you need to. Understanding matters more than speed.

---

## Your learning loop (use it for every step)

1. **Read** the linked doc page, and only that page.
2. **Try it in mongosh** against the `quickbite` database. Save the queries that worked in `mongosh/phase-N.js`. These become your notes.
3. **Move it to Node** as a function in `src/services/`.
4. **Expose it** through a route in `src/routes/`.
5. **Test it** with `requests.http` (VS Code REST Client extension) or curl. Test the error cases too, not only the happy path.
6. **Look at the data in Compass.** Check that fields have the types you expected.
7. **Commit**, one feature per commit.
8. **Tick the box** in the [coverage checklist](#roadmap-coverage-checklist).

Rules for yourself:

- Type the code yourself. Don't paste code you can't explain line by line.
- If you're stuck for more than 30 minutes, ask. Bring the error message and what you tried.
- After each phase, write 3–5 lines in `NOTES.md`: what you learned and what confused you.

## Folder structure

```
projects/QuickBite/
├── PLAN.md              this file
├── NOTES.md             your learning notes
├── package.json
├── .env                 MONGODB_URI, DB_NAME, JWT_SECRET (never commit)
├── requests.http        manual API tests
├── mongosh/             queries you tried in mongosh first
├── scripts/             setup, seed, import, backup scripts
├── data/                sample CSV files
└── src/
    ├── server.js        connect DB → start server → graceful shutdown
    ├── app.js           Express app: middleware, routers, error handler
    ├── db.js            the one MongoClient + collection helpers
    ├── routes/          one express.Router per feature
    ├── services/        all MongoDB code lives here
    ├── middleware/      auth, roles, validation, errors
    └── utils/           money, ids, error classes
```

**Rule:** routes never talk to MongoDB directly. They call services. This keeps HTTP code and database code apart, so each is easier to read and change.

## Collections

| Collection | Holds | Kind | Key modeling choice |
| --- | --- | --- | --- |
| `users` | Customers, owners, riders, admins | Normal | Address embedded as GeoJSON; wallet balance embedded |
| `restaurants` | Restaurant profiles | Normal | Owner referenced; latest 5 reviews embedded (subset pattern); `ratingAvg` stored (computed pattern) |
| `dishes` | Menu items | Normal | Separate collection with a reference to the restaurant, because menus grow and stock changes often |
| `carts` | One cart per customer | Normal + TTL | Created by upsert; abandoned carts expire |
| `orders` | Orders | Normal | Items embedded as a snapshot (name and price at order time); customer, restaurant and rider referenced |
| `reviews` | All reviews | Normal | One document per review; the restaurant keeps only the latest 5 |
| `coupons` | Discount codes | Normal | Partial unique index on active codes |
| `otps` | Login codes | TTL | Each one deletes itself after 5 minutes |
| `riderPings` | Rider GPS points | Time series | Append-only, auto-deleted after 7 days |
| `orderEvents` | Audit log | Capped | Fixed size; the oldest entries drop off |
| `dishPhotos.files`, `dishPhotos.chunks` | Images | GridFS bucket | Files are split into chunks |
| `restaurantDailyStats` | Pre-computed dashboard numbers | Materialized view | Rebuilt with `$merge` |

## Atlas free tier (M0) limits that affect this project

- 512 MB storage and 100 operations per second. Keep seed data to tens of thousands of documents, and insert in batches.
- At most **3 Atlas Search indexes**.
- No server-side JavaScript: `$where`, `$function`, `$accumulator` and map-reduce don't run.
- `allowDiskUse` is ignored. Big sorts must use an index or fit in memory.
- No database profiler or Performance Advisor, so use `explain()` instead.
- No sharding, auditing or customer-managed encryption keys. Those are in [Future scope](#future-scope).
- If a command fails with "*… is not allowed or the syntax is incorrect*", M0 blocks it. Run that one step on a local MongoDB in Docker (`docker run -d -p 27017:27017 mongo:8.0`).

Full list: [Atlas Free Cluster Limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/).

---

## Phase 0: Setup and foundations

**Goal:** an Express app that connects to MongoDB once at startup and shuts down cleanly.

**Roadmap topics:** MongoDB basics, What is MongoDB, When to use MongoDB, SQL vs NoSQL, MongoDB Atlas, MongoDB terminology.

**Steps**

1. Create the project the way your root README describes: `npm init -y`, then `npm pkg set type=module`, then `npm i express mongodb`.
2. Create `.env` with `MONGODB_URI`, `DB_NAME=quickbite`, `PORT` and `JWT_SECRET`. Add a script: `"dev": "node --watch --env-file=.env src/server.js"`.
3. In `src/db.js`, create **one** `MongoClient` and export `connectDB()`, `getDb()` and `closeDB()`.
4. In `src/server.js`, run `await connectDB()` **before** `app.listen()`. On `SIGINT` (Ctrl+C), close the HTTP server and then the MongoDB client.
5. In `src/app.js`:
   - add `express.json()` and a tiny request-logger middleware you write yourself
   - add `GET /health`, which runs `db.command({ ping: 1 })` and returns `{ ok: true }`
   - add a 404 handler for unknown routes
   - add one error handler `(err, req, res, next)` that returns JSON `{ error }` with `err.status` or 500
6. Learn this Express 5 behavior: when an `async` route handler throws, Express 5 sends the error to your error handler automatically. You don't need try/catch in every route or an `asyncHandler` wrapper.
7. Write a "Why MongoDB for QuickBite" section in a QuickBite `README.md`. Cover:
   - what a database, collection and document are, compared with SQL's database, table and row
   - why documents fit menus and orders
   - when you would *not* choose MongoDB
   - what Atlas gives you

**Done when**

- [ ] `npm run dev` starts the server, and `/health` returns `{ ok: true }`
- [ ] Ctrl+C logs that the MongoDB connection was closed
- [ ] An unknown route returns a JSON 404, not an HTML page
- [ ] The README section answers the four questions above in your own words

**Watch out:** don't create a new `MongoClient` per request. Don't commit `.env`. Don't forget `await`.

**Read:** [Connect to MongoDB (Node driver)](https://www.mongodb.com/docs/drivers/node/current/connect/) · [Express error handling](https://expressjs.com/en/guide/error-handling.html) · [SQL to MongoDB Mapping Chart](https://www.mongodb.com/docs/manual/reference/sql-comparison/)

---

## Phase 1: Data model and validation

**Goal:** decide the shape of each collection, and make MongoDB itself reject bad documents.

**Roadmap topics:** data model and data types (BSON vs JSON, String, Double, Int32, Int64, Decimal128, Boolean, Date, Null, ObjectId, Object, Array, Binary data), embedded objects and arrays, `validate`.

**Steps**

1. **Design on paper first.** In `NOTES.md`, write one example document each for `users`, `restaurants`, `dishes`, `orders` and `reviews`. For every relationship, answer three questions:
   - Are the two things read together?
   - How many can there be: a few, or an unbounded number?
   - Does one change without the other?

   Then decide embed or reference, and compare your answers with the [Collections](#collections) table.
2. **Choose a BSON type for every field.** Use at least these:

   | Field | Type | Why |
   | --- | --- | --- |
   | `price`, `total`, `wallet.balance` | Decimal128 | Exact money |
   | `qty`, `stock` | Int32 | Small whole numbers |
   | `lifetimeOrders` | Int64 (Long) | A counter that can grow very large |
   | `ratingAvg`, coordinates | Double | Decimals where exactness doesn't matter |
   | `createdAt` | Date | Never store dates as strings |
   | `deliveredAt`, `riderId` | null until set | Teaches null vs missing (Phase 4) |
   | `isOpen`, `isVeg` | Boolean | |
   | `idempotencyKey` | Binary (UUID) | Used in Phase 6 |
   | `address` / `items`, `tags` | Object / Array | Embedded data |

3. **Learn how JavaScript values become BSON.** A JavaScript whole number becomes Int32 if it fits, and Double otherwise. For other types, use the classes from `mongodb`: `Decimal128.fromString('249.00')`, `Long.fromNumber(0)` and `new UUID()`. Insert a test document, then check the types in Compass and with `$type` queries in mongosh.
4. **BSON vs JSON.** `res.json()` turns a Decimal128 into `{"$numberDecimal":"249.00"}`. Write a small helper that converts Decimal128 values to strings before sending a response. Int64 comes back as a normal JavaScript number by default.
5. **Location format.** Store each location as GeoJSON: `{ type: 'Point', coordinates: [lng, lat] }`. **Longitude comes first.** Swapping the two is the most common geospatial bug.
6. **Write `scripts/setup-collections.js`.** For each collection, call `createCollection` with a `validator: { $jsonSchema: … }`:
   - required fields
   - a `bsonType` for each field (`'decimal'`, `'int'`, `'long'`, `'objectId'`, `'date'`, `'bool'`, `'array'`, `'object'` or `'binData'`)
   - an `enum` for `role` and `status`

   Make the script safe to run twice: if the collection already exists, update its validator with `collMod`.
7. **Break it on purpose.** Insert a dish with the price as a string. Read the error: code `121`, and `errInfo.details` says which rule failed.
8. **Run `validate`** on each collection, as you did on `sample_mflix`. Write down the difference: `validate` checks the stored data and indexes, while `$jsonSchema` checks each document as it's written.
9. **Write `scripts/seed.js`.** Use `insertMany` to add one user per role, 5 restaurants and 50 dishes.

**Done when**

- [ ] Every collection has a validator, and a wrong-type insert fails with code 121
- [ ] `NOTES.md` explains each embed-or-reference choice in 1–2 lines
- [ ] Compass shows Decimal128, Int32, Int64 and Date where you expect them

**Watch out:** plain JavaScript numbers for money; `[lat, lng]` instead of `[lng, lat]`; dates stored as strings.

**Read:** [BSON Types](https://www.mongodb.com/docs/manual/reference/bson-types/) · [Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/) · [Design Patterns](https://www.mongodb.com/docs/manual/data-modeling/design-patterns/) · [Specify JSON Schema](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/) · [validate command](https://www.mongodb.com/docs/manual/reference/command/validate/)

---

## Phase 2: Users, restaurants and menus (CRUD)

**Goal:** a full CRUD API with login and role checks.

**Roadmap topics:** insert, find, update and delete (and related methods), counting documents.

**Build**

| Method | Path | Who | MongoDB method |
| --- | --- | --- | --- |
| POST | `/auth/register` | Anyone | `insertOne` |
| POST | `/auth/login` | Anyone | `findOne` |
| GET | `/me` | Logged in | `findOne` with projection |
| PATCH | `/me` | Logged in | `updateOne` + `$set` |
| POST | `/restaurants` | Owner | `insertOne` |
| GET | `/restaurants/:id` | Anyone | `findOne` |
| PATCH | `/restaurants/:id` | That restaurant's owner | `findOneAndUpdate` |
| DELETE | `/restaurants/:id` | Owner or admin | `deleteOne`, then `deleteMany` on its dishes |
| POST | `/restaurants/:id/dishes` | Owner | `insertOne` / `insertMany` |
| GET | `/restaurants/:id/dishes` | Anyone | `find` + `sort` + `countDocuments` |
| PATCH | `/dishes/:id` | Owner | `$set`, `$inc` (stock), `$push`/`$pull` (tags), `$unset` |
| PUT | `/dishes/:id` | Owner | `replaceOne` |
| PUT | `/cart/items` | Customer | `updateOne` with `upsert` |
| GET | `/admin/counts` | Admin | `estimatedDocumentCount`, `countDocuments` |

**Steps**

1. **Write the middleware first:**
   - `requireAuth`: verifies the JWT and sets `req.user`
   - `requireRole('owner')`
   - `checkId('id')`: returns 400 unless the id is 24 hex characters (`/^[0-9a-fA-F]{24}$/`). Only then call `new ObjectId(id)`.
   - `validateBody(rules)`: checks required fields and types. Write it yourself; you can switch to a library later.
2. **Register.** Hash the password with `bcryptjs`. Add one unique index on `users.email` to your setup script. Indexes are covered properly in Phase 5; this one line just stops duplicate emails. Catch error code `11000` and return 409.
3. **Login.** `findOne` by email, compare the hash, and sign a JWT containing `{ sub: userId, role }`.
4. **Never return `passwordHash`.** Exclude it with a projection: `{ passwordHash: 0 }`.
5. **Updates.** Build `$set` only from fields you allow. Reject objects where you expect strings. This blocks NoSQL injection such as `{"email": {"$ne": null}}`.
6. **Ownership.** Put the owner in the filter: `updateOne({ _id, ownerId: req.user.id }, …)`. If `matchedCount` is 0, the restaurant doesn't exist or isn't theirs.
7. **Know the result objects.** Know what `insertedId`, `matchedCount`, `modifiedCount`, `deletedCount` and `upsertedId` each mean. Log them while you learn.
8. **`findOneAndUpdate`.** Use `returnDocument: 'after'` so the response shows the updated document.
9. **Cart (upsert practice).**
   - First try to increase the quantity of an item that's already in the cart: `updateOne({ userId, 'items.dishId': id }, { $inc: { 'items.$.qty': qty } })`.
   - If `matchedCount` is 0, add the item: `updateOne({ userId }, { $push: { items: … }, $setOnInsert: { createdAt } }, { upsert: true })`.

   This teaches the positional `$` operator, `$setOnInsert` and upserts.

**Done when**

- [ ] Every endpoint above works and is in `requests.http`
- [ ] An invalid id returns 400, a missing document 404, someone else's restaurant 403 or 404, and a duplicate email 409
- [ ] `passwordHash` never appears in any response

**Read:** [CRUD Operations (Node driver)](https://www.mongodb.com/docs/drivers/node/current/crud/) · [Update Operators](https://www.mongodb.com/docs/manual/reference/mql/update/) · [countDocuments()](https://www.mongodb.com/docs/manual/reference/method/db.collection.countdocuments/) · [Express routing](https://expressjs.com/en/guide/routing.html) · [OWASP NoSQL Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html)

---

## Phase 3: Import, export and photos

**Goal:** move lots of data in and out without loading all of it into memory.

**Roadmap topics:** `bulkWrite` (and related methods), cursors, `$type`. Extra topic: GridFS. Node topic: streams.

**Build**

| Method | Path | What it does |
| --- | --- | --- |
| POST | `/restaurants/:id/menu/import` | Upload a CSV (`Content-Type: text/csv`); dishes are upserted in batches |
| GET | `/restaurants/:id/menu/export` | Download the menu as CSV, streamed from a cursor |
| POST | `/dishes/:id/photo` | Upload an image into GridFS |
| GET | `/dishes/:id/photo` | Stream the image back |

**Steps**

1. **Revise streams** from your `practice/streams` folder. Use `pipeline` from `node:stream/promises`, because it handles errors and cleanup for you.
2. **Import.** Install `csv-parse`. The request (`req`) is already a readable stream, so you don't need `multer`.
   - Pipe `req` into `parse({ columns: true })`.
   - Collect rows into batches of 500.
   - Send each batch with `bulkWrite(ops, { ordered: false })`.
3. **Make the import idempotent.** Use `updateOne` + `upsert` keyed on `{ restaurantId, name }`, and add a unique index on those two fields. Importing the same file twice must not create duplicates.
4. **Convert each row:** `Decimal128.fromString(row.price)` and `parseInt(row.stock)`. Skip bad rows and remember their row numbers.
5. **Read the bulk result.** Note `insertedCount`, `upsertedCount`, `matchedCount` and `modifiedCount`. When it fails, `MongoBulkWriteError.writeErrors` tells you which operation index failed. `ordered: false` keeps going after a bad row; `ordered: true` stops at the first one.
6. **Export.**
   - Get a cursor with `find({ restaurantId }).sort({ name: 1 }).batchSize(500)`.
   - Set `Content-Type: text/csv` and `Content-Disposition: attachment`.
   - Stream the rows with `pipeline(Readable.from(rowGenerator(cursor)), res)`.

   Learn what a cursor is, what `batchSize` changes, and why `toArray()` on 100,000 documents is a bad idea.
7. **Photos with GridFS.**
   - Create the bucket: `new GridFSBucket(db, { bucketName: 'dishPhotos' })`.
   - Pipe `req` into `openUploadStream(name, { metadata: { dishId, contentType } })`. Allow only `image/jpeg` and `image/png`.
   - Count bytes as they stream, and abort above 2 MB.
   - Save the file id on the dish as `photoId`. When a photo is replaced, delete the old file with `bucket.delete(oldId)`.
   - For download, set `Content-Type` and pipe `openDownloadStream(photoId)` into `res`.
8. **GridFS in real apps.** Production apps usually keep images in object storage like S3. GridFS suits files over 16 MB. You're using it here to learn how it works.
9. **Messy-data drill (`$type`).**
   - Insert 20 dishes with the price as a *string*, using `bypassDocumentValidation: true`. This pretends to be old data from before you added validation.
   - Find them with `{ price: { $type: 'string' } }`.
   - Fix them with an update pipeline: `updateMany(filter, [{ $set: { price: { $toDecimal: '$price' } } }])`.
   - Run the find again and confirm it returns 0.

**Done when**

- [ ] Importing a 1,000-row CSV twice leaves exactly 1,000 dishes
- [ ] Bad rows are reported with their row numbers
- [ ] The exported CSV opens in Excel
- [ ] A photo uploads, downloads and is replaced cleanly
- [ ] The messy-data drill ends with 0 string prices

**Read:** [Bulk Write Operations](https://www.mongodb.com/docs/manual/core/bulk-write-operations/) · [Node.js Streams](https://nodejs.org/api/stream.html) · [csv-parse](https://csv.js.org/parse/) · [GridFS](https://www.mongodb.com/docs/manual/core/gridfs/) · [$type](https://www.mongodb.com/docs/manual/reference/operator/query/type/)

---

## Phase 4: Browse and filter

**Goal:** flexible `GET /restaurants` and `GET /dishes` endpoints that build a MongoDB filter from query parameters.

**Roadmap topics:** every query operator, projection, sort, skip and limit.

**Build:** use every operator below at least once.

| Feature | Example query param | Operator |
| --- | --- | --- |
| One cuisine | `?cuisine=north-indian` | `$eq` (written implicitly; matches inside arrays too) |
| Any of several cuisines | `?cuisines=chinese,thai` | `$in` |
| Exclude cuisines | `?notCuisines=chinese` | `$nin` |
| Not closed | (default) | `$ne` |
| Minimum rating | `?minRating=4` | `$gte` |
| Price range | `?minPrice=100&maxPrice=300` | `$gt` / `$gte` / `$lt` / `$lte` on Decimal128 |
| Veg **and** Jain | `?tags=veg,jain` | `$all` |
| New restaurants with no reviews yet | `?new=true` | `$size: 0` |
| Extra cheese for ₹30 or less | `?addOn=extra cheese&addOnMax=30` | `$elemMatch` on `addOns` |
| Free delivery **or** rating ≥ 4.5 | `?deal=true` | `$or` |
| Two `$or` groups together | combined filters | `$and` (required when the same key would repeat) |
| Name doesn't contain a word | `?exclude=egg` | `$not` + regex |
| Neither closed nor suspended | (admin view) | `$nor` |
| Has a photo | `?withPhoto=true` | `$exists` |
| Name search | `?q=paneer` | `$regex` with `i` |

**Steps**

1. Write `buildDishFilter(query)` as a plain function that takes `req.query` and returns a filter object. Test it with `console.log` before wiring it to a route.
2. **Escape regex input.** User text like `(.*` must not become part of the pattern. Escape special characters before using `$regex`.
3. **Null vs missing.**
   - On orders, `{ deliveredAt: null }` matches both "null" and "field missing".
   - `{ deliveredAt: { $exists: false } }` matches only "missing".
   - `{ deliveredAt: { $type: 'null' } }` matches only "null".

   Try all three.
4. **Projection.**
   - The list view returns only what a card needs (inclusion).
   - The detail view hides internal fields (exclusion).
   - Cards show `latestReviews: { $slice: 3 }`.
   - You can't mix inclusion and exclusion in one projection, except for `_id`.
5. **Sorting.** Whitelist sort options: `?sort=rating`, `-rating` or `price`. Map each one to a sort object yourself. Never pass user input straight into `sort()`.
6. **Pagination.**
   - Start with `skip` and `limit`, and cap `limit` at 50. Get the total with `countDocuments` and the same filter.
   - Then add cursor-style paging (`?after=<lastId>` → `_id: { $gt: after }`), and write down why `skip` gets slow on deep pages.

**Done when**

- [ ] Every operator in the table is used, and is ticked in the checklist
- [ ] Regex input is escaped, `limit` is capped and sort is whitelisted
- [ ] You can explain null vs missing with your three queries

**Read:** [Query Predicates](https://www.mongodb.com/docs/manual/reference/mql/query-predicates/) · [Query an Array](https://www.mongodb.com/docs/manual/tutorial/query-arrays/) · [Query an Array of Embedded Documents](https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/) · [Project Fields](https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/) · [Null or Missing Fields](https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)

---

## Phase 5: Indexes, nearby and search

**Goal:** make Phase 4 fast, and add "near me", OTP login and typo-tolerant search.

**Roadmap topics:** creating indexes, single-field, compound, text, expiring (TTL), geospatial, Atlas Search indexes, query optimization. Also unique and partial indexes.

**Steps**

1. **Get enough data.** Write `scripts/seed-bulk.js` to add about 500 restaurants and 20,000 dishes, in batches of 1,000. Indexes make no visible difference on 50 documents.
2. **Measure before you change anything.**
   - Run 3 Phase 4 queries with `.explain('executionStats')`.
   - Note the stage (`COLLSCAN`), `totalDocsExamined`, `nReturned` and `executionTimeMillis` in `NOTES.md`.
3. **Single-field index.** Add `dishes: { restaurantId: 1 }`, run explain again, and compare.
4. **Compound index with ESR.**
   - Take the query "restaurants with cuisine X (equality), sorted by rating (sort), with delivery fee ≤ Y (range)".
   - Build `{ cuisines: 1, ratingAvg: -1, deliveryFee: 1 }`. It's multikey because `cuisines` is an array.
   - Then reorder the fields and compare the explain output.
5. **Covered query.** Project only indexed fields and exclude `_id`. `totalDocsExamined` should drop to 0.
6. **Unique and partial indexes.**
   - Unique on `users.email` (done in Phase 2), on `dishes { restaurantId, name }` (done in Phase 3), and on `orders.idempotencyKey` (needed in Phase 6).
   - A partial unique index on `coupons.code`, only `where active: true`, so an old code can be reused once it's inactive.
   - Gotcha: a query uses a partial index only if the query also includes `active: true`.
7. **TTL: OTP login.**
   - Add `POST /auth/otp/request` and `POST /auth/otp/verify`.
   - Generate the code with `crypto.randomInt`, store only its hash, and log it to the console instead of sending an SMS.
   - Add an index `{ createdAt: 1 }` with `expireAfterSeconds: 300`.
   - Gotcha: the TTL cleanup runs every 60 seconds, so a code can live slightly past 5 minutes. Also check the age in your query.
   - Add a TTL on `carts.updatedAt` as well, to remove abandoned carts after 7 days.
8. **Geospatial: "near me".**
   - Add a `2dsphere` index on `restaurants.location`.
   - `GET /restaurants/nearby?lng=&lat=&km=5` uses `$near` with `$geometry` and `$maxDistance` (in meters). Results come back sorted by distance.
   - Show the distance with the `$geoNear` aggregation stage (`distanceField`).
   - Count with `$geoWithin` + `$centerSphere` (radius in radians = km / 6378.1), because `countDocuments` doesn't accept `$near`.
   - Optional (Node `https` practice): turn a typed address into coordinates with the OpenStreetMap Nominatim API. Send a `User-Agent` header and make at most 1 request per second.
9. **Text index.**
   - Add `dishes: { name: 'text', tags: 'text', description: 'text' }` with weights (name 10, tags 5, description 1).
   - `GET /search?q=` uses `$text`, sorted by `{ score: { $meta: 'textScore' } }`.
   - A collection can have only one text index.
   - Try a typo like "panner": the text index finds nothing.
10. **Atlas Search.**
    - Create a search index on `dishes` from the Atlas UI or with `createSearchIndex()`. Map `name` as both `string` and `autocomplete`.
    - `GET /search/v2?q=` runs `aggregate([{ $search: { compound: { should: [text with fuzzy, autocomplete] } } }, { $limit: 20 }])`.
    - Now "panner" finds "paneer".
    - M0 allows only 3 search indexes, so plan them: dishes, restaurants and one spare.
11. **Clean up.** List indexes with `listIndexes()` and drop any you don't use. Every index slows down writes and uses storage.

**Done when**

- [ ] `NOTES.md` has before-and-after explain output for 3 queries (COLLSCAN → IXSCAN)
- [ ] You can explain why your compound index has its field order (ESR)
- [ ] The nearby, OTP, text search and Atlas Search endpoints work

**Read:** [Indexes](https://www.mongodb.com/docs/manual/indexes/) · [Compound Indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/) · [ESR Guideline](https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/) · [Explain Results](https://www.mongodb.com/docs/manual/reference/explain-results/) · [TTL Indexes](https://www.mongodb.com/docs/manual/core/index-ttl/) · [Partial Indexes](https://www.mongodb.com/docs/manual/core/index-partial/) · [Geospatial Queries](https://www.mongodb.com/docs/manual/geospatial-queries/) · [Text Search](https://www.mongodb.com/docs/manual/core/text-search/on-prem/) · [MongoDB Search (Atlas)](https://www.mongodb.com/docs/search/) · [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/)

---

## Phase 6: Orders and transactions

**Goal:** place orders safely and all-or-nothing, even when two people click at the same moment.

**Roadmap topics:** transactions, read/write concerns, retryable reads/writes, Binary data (UUID).

**Build**

| Method | Path | Who |
| --- | --- | --- |
| POST | `/wallet/topup` | Customer |
| POST | `/orders` | Customer |
| GET | `/orders` | Customer (their own orders) |
| PATCH | `/orders/:id/status` | Owner: accepted → preparing → ready |
| POST | `/orders/:id/claim` | Rider: claims a ready order |
| PATCH | `/orders/:id/deliver` | Rider |
| POST | `/orders/:id/cancel` | Customer (before "preparing") |

**Steps**

1. **Understand why you need a transaction.** Placing one order touches dish stock, the wallet, the coupon and the new order: 4 or more documents in 4 collections. If any step fails, none of them may change.
2. **Money helper.** In `utils/money.js`, write `toPaise(decimal128)`, which returns an integer, and `fromPaise(int)`, which returns a Decimal128. Do all totals in integer paise.
3. **Idempotency key.**
   - The client sends an `Idempotency-Key` header containing a UUID. Store it on the order as Binary (`new UUID(key)`), with a unique index.
   - On a duplicate-key error, return the order that already exists instead of creating a second one.
4. **The transaction.** Use `client.withSession(session => session.withTransaction(async () => { … }, { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } }))`. Inside the callback:
   1. For each item: `dishes.updateOne({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } }, { session })`. If `matchedCount` is 0, throw an out-of-stock error, which aborts everything.
   2. Coupon, if one is used: `$inc` its `usedCount` with a guard `usedCount: { $lt: maxUses }`.
   3. Wallet: `users.updateOne({ _id, 'wallet.balance': { $gte: total } }, { $inc: { 'wallet.balance': minusTotal } }, { session })`.
   4. `orders.insertOne({ …, status: 'placed', riderId: null, deliveredAt: null }, { session })`.
   5. `restaurants.updateOne({ _id }, { $inc: { lifetimeOrders: Long.fromNumber(1) } }, { session })`.
5. **Rules inside a transaction:**
   - Pass `{ session }` to **every** operation. If you forget it once, that write happens outside the transaction.
   - `withTransaction` can run your callback again on temporary errors, so don't send emails or log events inside it.
   - You can't write to time series or capped collections inside a transaction. Write `orderEvents` *after* the commit.
6. **Race test.** Set a dish's stock to 1. Write a script that sends 2 orders at the same time with `Promise.all`. Exactly one must succeed.
7. **When you *don't* need a transaction.** A single-document update is always atomic.
   - Status changes: `findOneAndUpdate({ _id, status: 'accepted' }, { $set: { status: 'preparing' }, $push: { statusHistory: … } })`. The `status` in the filter is a guard, so an order can't skip a step or go backwards. Keep the allowed transitions in a map.
   - Rider claim: `findOneAndUpdate({ _id, status: 'ready', riderId: null }, { $set: { riderId, status: 'picked_up' } })`. Two riders can't both claim the same order.
8. **Cancel.** Use a transaction to put stock back (`$inc` with +qty), refund the wallet and set the status to `cancelled`.
9. **Read and write concerns.** In `NOTES.md`, explain:
   - `w: 1` vs `w: 'majority'`, and what `j: true` adds
   - `readConcern` levels `local`, `majority` and `snapshot`
   - which QuickBite reads and writes use which, and why
10. **Retryable reads and writes.** They're on by default (`retryWrites=true` is in your Atlas URI). In `NOTES.md`, answer:
    - What does the driver retry for you?
    - Which errors still reach your code?
    - Why do you still need an idempotency key? (The user's browser can retry too.)

**Done when**

- [ ] The race test passes
- [ ] A failed order leaves stock and wallet unchanged (check in Compass)
- [ ] Sending the same idempotency key twice creates one order
- [ ] An order's status can't skip or go backwards, and two riders can't claim one order

**Read:** [Transactions](https://www.mongodb.com/docs/manual/core/transactions/) · [Transactions in Applications](https://www.mongodb.com/docs/manual/core/transactions-in-applications/) · [Node driver: Transactions](https://www.mongodb.com/docs/drivers/node/current/crud/transactions/) · [Read Concern](https://www.mongodb.com/docs/manual/reference/read-concern/) · [Write Concern](https://www.mongodb.com/docs/manual/reference/write-concern/) · [Retryable Writes](https://www.mongodb.com/docs/manual/core/retryable-writes/) · [Atomicity](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)

---

## Phase 7: Reviews and dashboards

**Goal:** answer business questions with aggregation pipelines.

**Roadmap topics:** aggregation, pipelines, stages and operators: `$match`, `$group`, `$sort`, `$project`, `$skip`, `$limit`, `$unwind`, `$lookup`, `$sum`. Extra topics: `$addFields`, `$facet`, `$bucket`, `$setWindowFields`, `$merge`.

**Steps**

1. **Seed orders.** Write `scripts/seed-orders.js` to insert 20,000–50,000 orders spread over 90 days. Insert them directly; seed data doesn't need transactions.
2. **Reviews.**
   - Add `POST /orders/:id/review`: only for delivered orders, and only one per order (unique index on `orderId`).
   - Use one transaction to:
     - insert the review
     - update the restaurant with `$push: { latestReviews: { $each: [review], $sort: { createdAt: -1 }, $slice: 5 } }` (subset pattern)
     - add 1 to `ratingCount` and add the rating to `ratingSum`
     - recalculate `ratingAvg` (computed pattern)
3. **Review list.** `GET /restaurants/:id/reviews?page=` uses `$match` → `$sort` → `$skip` → `$limit` → `$lookup` (reviewer name) → `$project`.
4. **Owner dashboard:** `GET /owner/restaurants/:id/dashboard?from=&to=`. Build each pipeline one stage at a time in Compass's aggregation builder, and check the output after every stage.

   | Question | Pipeline |
   | --- | --- |
   | Revenue per day | `$match` (restaurant, delivered, date range) → `$group` by `$dateTrunc` (day, `Asia/Kolkata`) with `$sum` → `$sort` |
   | Top 5 dishes | `$match` → `$unwind: '$items'` → `$group` by dish with `$sum` of qty and revenue → `$sort` → `$limit: 5` → `$lookup` dishes → `$project` |
   | Busiest hours | `$group` by `$hour` (with timezone) |
   | Order size spread | `$bucket` with boundaries `[0, 200, 400, 800, 1500]` |
   | Running total and dish rank | `$setWindowFields` (`$sum` over `['unbounded', 'current']`, `$rank`) |
   | Everything in one call | `$facet` with each pipeline above as a branch |

5. **Admin report.** `GET /admin/reports/top-restaurants?city=` uses `$match` → `$group` → `$sort` → `$limit` → `$lookup` restaurants → `$project`.
6. **Materialized view.**
   - `scripts/build-daily-stats.js` runs a pipeline that ends in `$merge` into `restaurantDailyStats`, with `on: ['restaurantId', 'day']` and `whenMatched: 'replace'`. `$merge` needs a unique index on those two fields.
   - The dashboard reads past days from this collection and runs the live pipeline only for today. Compare the speed.
   - Write down how `$merge` differs from `$out`.
7. **Performance.**
   - Put `$match` (and `$sort`) first, so the pipeline can use indexes.
   - `$project` away fields you don't need, early.
   - Run `explain()` on your biggest pipeline.
   - On M0, `allowDiskUse` is ignored, so keep `$group` output small.

**Done when**

- [ ] The dashboard returns everything from one `$facet` call
- [ ] Dashboard numbers match a manual check on a small date range
- [ ] Running `build-daily-stats.js` twice gives the same result

**Read:** [Aggregation Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) · [Practical MongoDB Aggregations (free book)](https://www.practical-mongodb-aggregations.com/) · [$lookup](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/) · [$facet](https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet/) · [$bucket](https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucket/) · [$setWindowFields](https://www.mongodb.com/docs/manual/reference/operator/aggregation/setwindowfields/) · [Materialized Views](https://www.mongodb.com/docs/manual/core/materialized-views/)

---

## Phase 8: Live tracking

**Goal:** customers see order status and the rider's position update live.

**Roadmap topics:** cursors (tailable), Timestamp data type. Extra topics: change streams, time series collections, capped collections. Node topics: EventEmitter, Server-Sent Events (SSE).

**Steps**

1. **SSE basics.** `GET /orders/:id/live`:
   - Set the headers `Content-Type: text/event-stream` and `Cache-Control: no-cache`.
   - Send each update with `res.write('data: …\n\n')`.
   - Send a heartbeat every 25 seconds so the connection stays open.
   - Clean up in `req.on('close')`.
2. **One change stream for the whole app.**
   - Start it in `server.js` after connecting: `orders.watch(pipeline, { fullDocument: 'updateLookup' })`, where the pipeline matches only status updates.
   - For each change event, emit it on an `EventEmitter`. Each SSE handler subscribes to its own order and unsubscribes on close.
   - Why one stream: 1,000 people watching shouldn't mean 1,000 change streams. Each stream uses a connection, and M0 allows 500.
3. **Read a change event.** Look at `_id` (the resume token), `operationType`, `documentKey`, `updateDescription` and `clusterTime`. `clusterTime` is a BSON **Timestamp**, a roadmap data type.
4. **Resume after a crash.**
   - Save the latest resume token (for example, in a `meta` collection).
   - On restart, open the stream with `startAfter: token` so no events are missed.
   - Restart the stream when it emits `error`.
5. **Time series: rider GPS.**
   - Create `riderPings` with `{ timeseries: { timeField: 'ts', metaField: 'meta', granularity: 'seconds' }, expireAfterSeconds: 604800 }`, where `meta` is `{ riderId, orderId }`.
   - `POST /rider/location` takes `{ lng, lat }` and works only for the rider assigned to the order.
   - Write `scripts/simulate-rider.js` to post a moving point every 3 seconds.
   - **Change streams don't work on time series collections.** So the location handler emits on your EventEmitter directly after inserting.
   - Queries to write: the rider's latest position; the full route of one order; average speed per minute (`$group` by `$dateTrunc` minute, or `$setWindowFields` with a time range).
   - Rules: treat pings as append-only, never write them inside a transaction, and remember that unique indexes aren't allowed here.
6. **Capped collection: audit log.**
   - Create `orderEvents` with `{ capped: true, size: 1048576 }` (1 MB).
   - After each order commit and each status change, insert an event. Do it after the commit, not inside the transaction.
   - `GET /admin/events/live` uses a tailable cursor (`{ tailable: true, awaitData: true }`) and streams new events over SSE.
   - Watch what happens when the collection is full: the oldest events disappear and insertion order is kept.
   - If M0 refuses to create a capped collection, do this step on local Docker MongoDB.
7. **Shutdown.** Close the change stream and the tailable cursor in your graceful shutdown code.

**Done when**

- [ ] Changing an order's status in Compass updates the customer's SSE stream instantly
- [ ] The simulated rider moves on the stream
- [ ] Restarting the server resumes the change stream without missing events
- [ ] The admin live feed works

**Read:** [Change Streams](https://www.mongodb.com/docs/manual/changestreams/) · [Node driver: Change Streams](https://www.mongodb.com/docs/drivers/node/current/monitoring-and-logging/change-streams/) · [Time Series](https://www.mongodb.com/docs/manual/core/timeseries-collections/) · [Time Series Limitations](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/) · [Capped Collections](https://www.mongodb.com/docs/manual/core/capped-collections/) · [Tailable Cursors](https://www.mongodb.com/docs/manual/core/tailable-cursors/) · [Using Server-Sent Events (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)

---

## Phase 9: Backup and wrap-up

**Goal:** prove you can get your data back, and finish the project properly.

**Roadmap topics:** `mongodump`, `mongorestore`. Extra topics: `mongoexport`, `mongoimport`.

**Steps**

1. Install the [MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/installation/). They're a separate download on Windows. Check with `mongodump --version`.
2. **Back up.** Run `mongodump --uri "<your URI>" --db quickbite --gzip --archive=backups/quickbite-<date>.gz`. Add `backups/` to `.gitignore`. On M0, `--oplog` isn't allowed and you can't dump the `admin` database.
3. **Restore drill.**
   - Restore into a *new* database: `mongorestore --uri … --gzip --archive=… --nsFrom 'quickbite.*' --nsTo 'quickbite_restore.*'`.
   - Write a script that compares `countDocuments` for every collection, including `riderPings` and `dishPhotos.*`.
   - Check that validators and indexes came back too.
4. **Backup script.** Write `scripts/backup.js`:
   - run `mongodump` with `child_process.spawn`
   - name the file with today's date
   - use `fs` to delete all but the last 7 backups
5. **Export and import.** Use `mongoexport` to save delivered orders as CSV, as if for an accountant. Use `mongoimport` to load a dishes CSV, and compare it with your own import code from Phase 3.
6. **Wrap-up.**
   - Finish the QuickBite README: setup, environment variables, scripts and an endpoint list.
   - Complete `requests.http`.
   - Review `NOTES.md`.
   - Tick the whole checklist.
   - Optional: write a few integration tests with `node:test`.

**Done when**

- [ ] The restore drill counts match
- [ ] A backup is one command
- [ ] Someone else could clone the repo and run QuickBite from the README

**Read:** [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) · [mongorestore](https://www.mongodb.com/docs/database-tools/mongorestore/) · [mongoexport](https://www.mongodb.com/docs/database-tools/mongoexport/) · [Backup Methods](https://www.mongodb.com/docs/manual/core/backups/)

---

## Future scope

Start these after Phase 9. Each one builds on the finished QuickBite.

### Developer tools

- **Language drivers.** You already use the Node driver. Rewrite 3 of your queries with Python's PyMongo to see that the concepts are the same in every driver.
- **Compass, mongosh and the VS Code extension.** You'll use Compass and mongosh throughout the project. Also try VS Code's MongoDB Playgrounds.
- **Elasticsearch.**
  - Run Elasticsearch in Docker.
  - Write a worker that copies dish changes into it using a change stream.
  - Compare it with your Atlas Search from Phase 5.
- **Kafka.** Use the [MongoDB Kafka Connector](https://www.mongodb.com/docs/kafka-connector/current/) to publish order changes to a topic. Then build a small "notification service" that consumes them.
- **Spark.** Use the [MongoDB Spark Connector](https://www.mongodb.com/docs/spark-connector/current/) to read orders and calculate demand per area per hour. This one is mostly reading and trying things out.

### Security

- **Role-based access control:**
  - create Atlas database users `quickbite_app` (readWrite on `quickbite` only) and `quickbite_reports` (read only)
  - create a custom role that can only insert into `riderPings`
  - switch the app to the least-privileged user
- **TLS/SSL.** Atlas always uses TLS. Run a local `mongod` with TLS certificates to see how it's configured.
- **X.509 certificate authentication.** Create an Atlas user that logs in with a certificate (works on M0), and connect the app with it.
- **Client-side field-level encryption:**
  - encrypt `users.phone` and `users.address`
  - learn about the key vault, data keys and a local KMS
  - explicit encryption works on any server; automatic encryption needs Atlas or Enterprise plus the `crypt_shared` library
- **Queryable Encryption.** Find a user by their encrypted phone number, then compare this with field-level encryption.
- **Encryption at rest.** Atlas already encrypts storage. Managing your own keys needs M10 or higher, so read about it only.
- **Auditing.** Needs M10+ or Enterprise, so read only. Your `orderEvents` capped collection is the app-level version of an audit log.
- **Kerberos and LDAP.** Enterprise login systems. Learn the concepts only.
- **Hardening review.** Go through the [Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/), recheck NoSQL injection, and add rate limiting to login and OTP.

### Scaling

- **Replica sets:**
  - run a local 3-node replica set with Docker Compose
  - stop the primary while `simulate-rider.js` is writing, and watch the election and retryable writes recover
  - send dashboard reads to secondaries with read preference
- **Sharded clusters:**
  - not available on M0
  - write down your shard-key choice for `orders` (for example `{ restaurantId: 1, createdAt: 1 }` vs hashed `_id`) and for `riderPings`, with reasons
  - optionally, run a local sharded cluster in Docker
- **Performance optimization.** Use the database profiler and slow query log on local MongoDB (they're not available on M0). Also learn about Atlas Performance Advisor (M10+) and right-sizing the connection pool.
- **Tuning configuration:**
  - WiredTiger cache size
  - `maxPoolSize` / `minPoolSize`
  - `serverSelectionTimeoutMS`
  - `maxTimeMS` per query
  - the cost of stronger write concerns

### Leftover data types

- **Undefined, Symbol and JavaScript** are deprecated, so don't use them in new apps. **MinKey and MaxKey** are internal values.
- Write one mongosh script that inserts each type, then sorts a field that mixes types to see the [BSON comparison order](https://www.mongodb.com/docs/manual/reference/bson-type-comparison-order/).
- In a sharded cluster, find MinKey and MaxKey in the chunk ranges.

---

## Roadmap coverage checklist

Tick each topic when you've used it in QuickBite. This is how you track your progress.

**Basics**: Phase 0

- [ ] SQL vs NoSQL · [ ] What is MongoDB · [ ] When to use MongoDB · [ ] MongoDB Atlas · [ ] MongoDB terminology

**Data model and data types**: Phase 1, unless another phase is noted

- [ ] BSON vs JSON · [ ] String · [ ] Double · [ ] Int32 · [ ] Int64 (Long) · [ ] Decimal128 · [ ] Boolean · [ ] Date · [ ] Null (Phase 4) · [ ] ObjectId · [ ] Object · [ ] Array · [ ] Binary data (Phase 6) · [ ] Regular expression (Phase 4) · [ ] Timestamp (Phase 8)
- Future scope: [ ] Undefined · [ ] Symbol · [ ] JavaScript · [ ] MinKey · [ ] MaxKey

**Collections and methods**

- [ ] insert (P2) · [ ] find (P2) · [ ] update (P2) · [ ] delete (P2) · [ ] counting documents (P2) · [ ] bulkWrite (P3) · [ ] validate (P1)

**Useful concepts**

- [ ] Cursors (P3, P8) · [ ] Read/write concerns (P6) · [ ] Retryable reads/writes (P6)

**Query operators**: Phase 4

- Comparison: [ ] `$eq` · [ ] `$gt` · [ ] `$gte` · [ ] `$lt` · [ ] `$lte` · [ ] `$ne` · [ ] `$in` · [ ] `$nin`
- Logical: [ ] `$and` · [ ] `$or` · [ ] `$not` · [ ] `$nor`
- Element: [ ] `$exists` · [ ] `$type` (P3)
- Array: [ ] `$all` · [ ] `$elemMatch` · [ ] `$size`
- Projection: [ ] `$project` · [ ] include · [ ] exclude · [ ] `$slice`
- [ ] `$regex`

**Indexing**: Phase 5

- [ ] Creating indexes · [ ] Single field · [ ] Compound · [ ] Text · [ ] Expiring (TTL) · [ ] Geospatial · [ ] Atlas Search indexes · [ ] Query optimization

**Aggregation**: Phase 7

- [ ] `$match` · [ ] `$group` · [ ] `$sort` · [ ] `$project` · [ ] `$skip` · [ ] `$limit` · [ ] `$unwind` · [ ] `$lookup` · [ ] `$sum`

**Transactions**: Phase 6

- [ ] Multi-document transaction in a real endpoint

**Backup and recovery**: Phase 9

- [ ] mongodump · [ ] mongorestore

**Extras from your roadmap's Level 4**

- [ ] GridFS (P3) · [ ] `$geoNear` (P5) · [ ] `$facet` · [ ] `$bucket` · [ ] `$setWindowFields` · [ ] `$merge` (P7) · [ ] Change streams · [ ] Time series · [ ] Capped collections (P8)

**Future scope**

- Developer tools: [ ] Language drivers · [ ] Elasticsearch · [ ] Kafka · [ ] Spark
- Security: [ ] RBAC · [ ] TLS/SSL · [ ] X.509 · [ ] Kerberos · [ ] LDAP · [ ] Encryption at rest · [ ] Client-side field-level encryption · [ ] Queryable Encryption · [ ] Auditing
- Scaling: [ ] Replica sets · [ ] Sharded clusters · [ ] Performance optimization · [ ] Tuning configuration

---

## Common mistakes in this project

- Creating a `MongoClient` per request instead of once at startup.
- Forgetting `{ session }` on one operation inside a transaction.
- Swapping latitude and longitude in GeoJSON (longitude comes first).
- Doing money maths with JavaScript floats.
- Opening one change stream per SSE client instead of sharing one through an EventEmitter.
- Calling `toArray()` on a huge cursor instead of streaming it.
- Putting user input straight into `$regex`, `sort()` or a filter object.
- Adding indexes without checking `explain()` before and after.
