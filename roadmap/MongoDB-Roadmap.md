# MongoDB Roadmap: Basics to Advanced

A step-by-step path from "what is a document?" to running MongoDB in production with Node.js and Express. Every link below was checked on 14 Oct 2026.

## How to use this roadmap

Work through the levels in order, and build at least one project per level before moving on. At 1–2 hours a day, Levels 0–4 take roughly 8–12 weeks. Level 5 is ongoing.

Each level has:

- **Topics**: what to learn, in a sensible order.
- **Official docs**: the exact MongoDB page to read. Read only that page, not the whole manual.
- **Also read**: a simpler explanation on another site, for when the official page feels too dense.
- **Projects**: things to build so the concepts stick.

You are ready if you know JavaScript objects, arrays and `async/await`, plus Express routing, middleware and REST APIs. Your Notes CRUD API and Task Tracker already cover that.

**How to survive the official docs.** They cover far more than a backend developer needs. You will mostly live in three places:

1. [MongoDB Manual](https://www.mongodb.com/docs/manual/): the database itself (queries, indexes, aggregation, modeling).
2. [Node.js Driver docs](https://www.mongodb.com/docs/drivers/node/current/): talking to MongoDB from Node.
3. [Mongoose docs](https://mongoosejs.com/docs/): the most popular library for using MongoDB in Express apps.

Ignore pages about Ops Manager, Kubernetes, Enterprise Advanced and other languages' drivers until Level 5.

**Practice habit:** try every query in `mongosh` or [Mongo Playground](https://mongoplayground.net/) first, then move it into your Node code.

## At a glance

| Level | You learn | Rough time | Main project |
| --- | --- | --- | --- |
| 0. Foundations | What MongoDB is, Atlas, mongosh, Compass | 2–3 days | Explore the sample movies database |
| 1. Beginner | CRUD and query operators | 1 week | Library database in mongosh |
| 2. Node.js + Express | Native driver, then Mongoose | 2 weeks | Notes API and Task Tracker on MongoDB |
| 3. Intermediate | Data modeling, indexes, aggregation basics | 2–3 weeks | Blog API with search and stats |
| 4. Advanced | Advanced aggregation, transactions, change streams, search | 2–3 weeks | E-commerce backend |
| 5. Production | Replication, sharding, security, backups, monitoring | Ongoing | Hardened, replicated capstone |

---

## Level 0: Foundations and setup

**Goal:** understand how MongoDB stores data, and get a database you can connect to.

| Topic | Official docs | Also read |
| --- | --- | --- |
| SQL vs NoSQL, and why documents | [What Is NoSQL?](https://www.mongodb.com/resources/basics/databases/nosql-explained) | [SQL vs NoSQL (GeeksforGeeks)](https://www.geeksforgeeks.org/sql/difference-between-sql-and-nosql/) |
| Databases → collections → documents | [Databases and Collections](https://www.mongodb.com/docs/manual/core/databases-and-collections/) · [Documents](https://www.mongodb.com/docs/manual/core/document/) | [MongoDB: Working and Features (GeeksforGeeks)](https://www.geeksforgeeks.org/mongodb/what-is-mongodb-working-and-features/) |
| BSON data types and `ObjectId` | [BSON Types](https://www.mongodb.com/docs/manual/reference/bson-types/) · [ObjectId](https://www.mongodb.com/docs/manual/reference/method/objectid/) | |
| SQL words mapped to MongoDB words | [SQL to MongoDB Mapping Chart](https://www.mongodb.com/docs/manual/reference/sql-comparison/) | |
| Free cloud database (recommended) | [Get Started with Atlas](https://www.mongodb.com/docs/get-started/) | [W3Schools: Get Started](https://www.w3schools.com/mongodb/mongodb_get_started.php) |
| Or install locally on Windows | [Install Community Edition on Windows](https://www.mongodb.com/docs/manual/administration/install-community-windows/) | |
| The shell: `mongosh` | [MongoDB Shell](https://www.mongodb.com/docs/mongodb-shell/) · [mongosh cheat sheet](https://www.mongodb.com/docs/mongodb-shell/reference/cheatsheet/) | |
| The GUI: Compass | [MongoDB Compass](https://www.mongodb.com/docs/compass/) | |
| Practice data | [Sample Data](https://www.mongodb.com/docs/manual/sample-data/) | |

**Projects**

- Create a free Atlas cluster and load the sample data. Browse `sample_mflix.movies` in Compass, then run 10 `find()` queries in mongosh.
- Open `projects/Task Tracker/db.json` and sketch how it would look as a MongoDB collection. Which fields stay, and does each task get an `_id`?

**You're done when** you can explain database / collection / document, connect with mongosh, and see your data in Compass.

---

## Level 1: Beginner (CRUD and queries)

**Goal:** create, read, update and delete data confidently from the shell.

| Topic | Official docs | Also read |
| --- | --- | --- |
| CRUD overview | [MongoDB CRUD Operations](https://www.mongodb.com/docs/manual/crud/) | [W3Schools: Create Database](https://www.w3schools.com/mongodb/mongodb_mongosh_create_database.php) |
| Insert: `insertOne`, `insertMany` | [Insert Documents](https://www.mongodb.com/docs/manual/tutorial/insert-documents/) | [W3Schools: Insert](https://www.w3schools.com/mongodb/mongodb_mongosh_insert.php) |
| Find with filters | [Query Documents](https://www.mongodb.com/docs/manual/tutorial/query-documents/) | [W3Schools: Find](https://www.w3schools.com/mongodb/mongodb_mongosh_find.php) |
| Query operators: `$eq $gt $lt $in $and $or $exists $regex` | [Query Predicates reference](https://www.mongodb.com/docs/manual/reference/mql/query-predicates/) · [$regex](https://www.mongodb.com/docs/manual/reference/operator/query/regex/) | [W3Schools: Query Operators](https://www.w3schools.com/mongodb/mongodb_query_operators.php) |
| Nested documents and arrays | [Query Embedded Documents](https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/) · [Query an Array](https://www.mongodb.com/docs/manual/tutorial/query-arrays/) · [Query an Array of Embedded Documents](https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/) | |
| Projection (pick which fields come back) | [Project Fields to Return](https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/) | |
| Null vs missing fields | [Query for Null or Missing Fields](https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/) | |
| `sort`, `limit`, `skip`, `countDocuments`, `distinct` | [sort()](https://www.mongodb.com/docs/manual/reference/method/cursor.sort/) · [limit()](https://www.mongodb.com/docs/manual/reference/method/cursor.limit/) · [skip()](https://www.mongodb.com/docs/manual/reference/method/cursor.skip/) · [countDocuments()](https://www.mongodb.com/docs/manual/reference/method/db.collection.countdocuments/) · [distinct()](https://www.mongodb.com/docs/manual/reference/method/db.collection.distinct/) | |
| Update: `$set $inc $push $pull $unset`, upsert | [Update Documents](https://www.mongodb.com/docs/manual/tutorial/update-documents/) · [Update Operators](https://www.mongodb.com/docs/manual/reference/mql/update/) | [W3Schools: Update](https://www.w3schools.com/mongodb/mongodb_mongosh_update.php) · [W3Schools: Update Operators](https://www.w3schools.com/mongodb/mongodb_update_operators.php) |
| Delete | [Delete Documents](https://www.mongodb.com/docs/manual/tutorial/delete-documents/) | [W3Schools: Delete](https://www.w3schools.com/mongodb/mongodb_mongosh_delete.php) |
| Many writes at once | [Bulk Write Operations](https://www.mongodb.com/docs/manual/core/bulk-write-operations/) | |
| Single-document writes are atomic | [Atomicity and Transactions](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/) | |

Full beginner tutorial, if you prefer one long read: [MongoDB Tutorial (GeeksforGeeks)](https://www.geeksforgeeks.org/mongodb/mongodb-tutorial/).

**Projects (mongosh only, no Node yet)**

- **Movie query challenges** on `sample_mflix`: write 20 queries. Examples: movies after 2010 rated above 8, sorted by rating, showing only title and year. Movies where `cast` includes a given actor. The 5 longest movies in a genre.
- **Library database**: `books` and `members` collections. Use `$push`/`$pull` to borrow and return books, and `$inc` to track available copies.
- **Expense log**: insert 50 expenses, then query by date range and category, fix mistakes with updates, and delete test data.

**You're done when** you can write any find/update/delete from memory and know when to use `updateOne` vs `updateMany`.

---

## Level 2: MongoDB with Node.js and Express

**Goal:** connect your Express APIs to a real database. Learn the official driver for 2–3 days first so you understand what Mongoose does for you. Then use Mongoose for your Express projects.

### 2a. Official Node.js driver

| Topic | Official docs | Also read |
| --- | --- | --- |
| Connection strings | [Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/) | |
| Keep secrets out of code (`.env`) | Node's built-in `--env-file` flag: [Node.js CLI docs](https://nodejs.org/api/cli.html) | [dotenv on npm](https://www.npmjs.com/package/dotenv) |
| First connection and query | [Get Started with the Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/get-started/) | [W3Schools: Node.js + MongoDB](https://www.w3schools.com/mongodb/mongodb_nodejs_connect_database.php) |
| Connecting properly (one client per app) | [Connect to MongoDB](https://www.mongodb.com/docs/drivers/node/current/connect/) · [Connection Pool Overview](https://www.mongodb.com/docs/manual/administration/connection-pool-overview/) | |
| CRUD from Node | [CRUD Operations (Node driver)](https://www.mongodb.com/docs/drivers/node/current/crud/) | |

### 2b. Mongoose (schemas and models on top of the driver)

| Topic | Official docs | Also read |
| --- | --- | --- |
| Getting started | [Mongoose Quick Start](https://mongoosejs.com/docs/index.html) | [Mongoose Get Started (MongoDB docs)](https://www.mongodb.com/docs/drivers/node/current/integrations/mongoose/mongoose-get-started/) · [Introduction to Mongoose (freeCodeCamp)](https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/) |
| Connections | [Connections](https://mongoosejs.com/docs/connections.html) | |
| Schemas and types | [Schemas](https://mongoosejs.com/docs/guide.html) · [SchemaTypes](https://mongoosejs.com/docs/schematypes.html) | |
| Models and queries | [Models](https://mongoosejs.com/docs/models.html) · [Queries](https://mongoosejs.com/docs/queries.html) | |
| Validation | [Validation](https://mongoosejs.com/docs/validation.html) | |
| `createdAt` / `updatedAt` | [Timestamps](https://mongoosejs.com/docs/timestamps.html) | |
| Hooks, e.g. hash a password before save | [Middleware](https://mongoosejs.com/docs/middleware.html) | |
| Relationships between models | [Populate](https://mongoosejs.com/docs/populate.html) | |
| Computed fields and faster reads | [Virtuals](https://mongoosejs.com/docs/tutorials/virtuals.html) · [lean()](https://mongoosejs.com/docs/tutorials/lean.html) | |
| How Mongoose converts query values | [Query Casting](https://mongoosejs.com/docs/tutorials/query_casting.html) | |
| Mongoose inside a full Express app | | [MDN: Express Tutorial Part 3, Using a Database (with Mongoose)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/mongoose) |

Videos: [Mongoose Crash Course (Web Dev Simplified)](https://www.youtube.com/watch?v=DZBGEVgL2eE) · [Chai aur JavaScript Backend, in Hindi (Chai aur Code)](https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW).

**Projects**

- **Upgrade your Notes API** (`challenges/rest api/CRUD for Notes.js`): replace the in-memory array with MongoDB using the native driver. Then rewrite it with Mongoose and compare the two.
- **Move Task Tracker off `db.json`**: store tasks in MongoDB. Add `status` and `dueDate`, plus filters and sorting through query params (`?status=done&sort=dueDate`).
- **URL shortener**: unique short codes, a click counter with `$inc`, and a redirect route.
- **Auth basics**: a `User` model whose pre-save hook hashes the password with bcrypt. Add register/login, and make each note belong to a user (use `populate`).

**You're done when** your API returns 400 for an invalid id, 404 for a missing document, and never opens a new connection per request.

---

## Level 3: Intermediate (modeling, indexes, aggregation)

**Goal:** design collections well, make queries fast, and answer "report" questions with aggregation.

### 3a. Data modeling

| Topic | Official docs | Also read |
| --- | --- | --- |
| How to design a schema | [Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/) · [Schema Design Process](https://www.mongodb.com/docs/manual/data-modeling/schema-design-process/) | [6 Rules of Thumb for Schema Design (MongoDB blog)](https://www.mongodb.com/company/blog/mongodb/6-rules-of-thumb-for-mongodb-schema-design) |
| Embed or reference? | [Best Practices: Link Related Data](https://www.mongodb.com/docs/manual/data-modeling/best-practices/#link-related-data) · [One-to-Many with Embedded Documents](https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/) · [One-to-Many with References](https://www.mongodb.com/docs/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/) | |
| Design patterns: subset, bucket, computed, outlier, attribute, schema versioning, polymorphic | [Design Patterns](https://www.mongodb.com/docs/manual/data-modeling/design-patterns/) | [Building With Patterns: A Summary (MongoDB blog)](https://www.mongodb.com/company/blog/building-with-patterns-a-summary) |
| Mistakes to avoid (unbounded arrays, bloated documents) | [Schema Design Anti-Patterns](https://www.mongodb.com/docs/manual/data-modeling/design-antipatterns/) | |
| Rules enforced by the database itself | [Schema Validation](https://www.mongodb.com/docs/manual/core/schema-validation/) · [Specify JSON Schema](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/) | [W3Schools: Schema Validation](https://www.w3schools.com/mongodb/mongodb_schema_validation.php) |

### 3b. Indexes and query performance

| Topic | Official docs | Also read |
| --- | --- | --- |
| What indexes are | [Indexes](https://www.mongodb.com/docs/manual/indexes/) · [Create an Index](https://www.mongodb.com/docs/manual/core/indexes/create-index/) | [W3Schools: Indexing and Search](https://www.w3schools.com/mongodb/mongodb_indexing_search.php) |
| Index types | [Index Types](https://www.mongodb.com/docs/manual/core/indexes/index-types/) · [Compound](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/) · [Multikey (arrays)](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-multikey/) | |
| Ordering fields in a compound index | [Equality, Sort, Range (ESR) Guideline](https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/) | |
| Unique, TTL (auto-expire) and partial indexes | [Unique](https://www.mongodb.com/docs/manual/core/index-unique/) · [TTL](https://www.mongodb.com/docs/manual/core/index-ttl/) · [Partial](https://www.mongodb.com/docs/manual/core/index-partial/) | |
| Is my query using an index? | [explain()](https://www.mongodb.com/docs/manual/reference/method/db.collection.explain/) · [Explain Results](https://www.mongodb.com/docs/manual/reference/explain-results/) · [Analyze Query Performance](https://www.mongodb.com/docs/manual/tutorial/analyze-query-plan/) | |
| Indexes in Mongoose | [Schemas: Indexes](https://mongoosejs.com/docs/guide.html#indexes) | |

### 3c. Aggregation basics

| Topic | Official docs | Also read |
| --- | --- | --- |
| The pipeline idea | [Aggregation Operations](https://www.mongodb.com/docs/manual/aggregation/) · [Aggregation Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) | [W3Schools: Aggregation Intro](https://www.w3schools.com/mongodb/mongodb_aggregations_intro.php) |
| Core stages | [$match](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/) · [$group](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/) · [$project](https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/) · [$sort](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/) · [$addFields](https://www.mongodb.com/docs/manual/reference/operator/aggregation/addfields/) · [$unwind](https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/) | [W3Schools: $group](https://www.w3schools.com/mongodb/mongodb_aggregations_group.php) |
| Joining collections | [$lookup](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/) | [W3Schools: $lookup](https://www.w3schools.com/mongodb/mongodb_aggregations_lookup.php) |
| All stages (reference) | [Aggregation Stages](https://www.mongodb.com/docs/manual/reference/mql/aggregation-stages/) | |
| Aggregation from Node | [Aggregation (Node driver)](https://www.mongodb.com/docs/drivers/node/current/aggregation/) | |

Best free resource for this level: [Practical MongoDB Aggregations](https://www.practical-mongodb-aggregations.com/), a free online book by a MongoDB engineer.

**Projects**

- **Blog API**: users, posts and comments. Decide what to embed and what to reference; for example, embed the latest 5 comments (subset pattern) and store the rest separately. Add a text index for search, pagination, and a `/stats` endpoint for posts per author and top tags, built with aggregation.
- **Expense tracker with reports**: monthly totals and averages per category using `$group`. Add a compound index and compare `explain()` output before and after.
- **OTP / password-reset tokens**: a collection with a TTL index so documents delete themselves after 10 minutes.

**You're done when** you can justify every embed/reference choice, read an `explain()` output (COLLSCAN vs IXSCAN), and write a 4–5 stage pipeline.

---

## Level 4: Advanced

**Goal:** handle multi-document consistency, real-time data, search and special workloads.

| Topic | Official docs | Also read |
| --- | --- | --- |
| Advanced aggregation: results + counts in one query, buckets, running totals and rankings | [$facet](https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet/) · [$bucket](https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucket/) · [$setWindowFields](https://www.mongodb.com/docs/manual/reference/operator/aggregation/setwindowfields/) | [Practical MongoDB Aggregations](https://www.practical-mongodb-aggregations.com/) |
| Saved queries and pre-computed reports | [Views](https://www.mongodb.com/docs/manual/core/views/) · [On-Demand Materialized Views](https://www.mongodb.com/docs/manual/core/materialized-views/) · [$merge](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/) · [$out](https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/) | |
| Multi-document transactions (need a replica set; Atlas free tier is one) | [Transactions](https://www.mongodb.com/docs/manual/core/transactions/) · [Transactions in Applications](https://www.mongodb.com/docs/manual/core/transactions-in-applications/) · [Node driver: Transactions](https://www.mongodb.com/docs/drivers/node/current/crud/transactions/) | [Mongoose: Transactions](https://mongoosejs.com/docs/transactions.html) |
| How safe and fresh reads/writes are | [Read Concern](https://www.mongodb.com/docs/manual/reference/read-concern/) · [Write Concern](https://www.mongodb.com/docs/manual/reference/write-concern/) · [Retryable Writes](https://www.mongodb.com/docs/manual/core/retryable-writes/) | |
| Real-time updates | [Change Streams](https://www.mongodb.com/docs/manual/changestreams/) · [watch()](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/) · [Node driver: Change Streams](https://www.mongodb.com/docs/drivers/node/current/monitoring-and-logging/change-streams/) | |
| Search: built-in text indexes, then full-text search on Atlas | [Text Search (self-managed)](https://www.mongodb.com/docs/manual/core/text-search/on-prem/) · [MongoDB Search (Atlas)](https://www.mongodb.com/docs/search/) | |
| Special collections | [Time Series](https://www.mongodb.com/docs/manual/core/timeseries-collections/) · [Time Series Quick Start](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-quick-start/) · [Capped Collections](https://www.mongodb.com/docs/manual/core/capped-collections/) · [GridFS (large files)](https://www.mongodb.com/docs/manual/core/gridfs/) | |
| Location queries | [Geospatial Queries](https://www.mongodb.com/docs/manual/geospatial-queries/) · [2dsphere Indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/geospatial/2dsphere/) | |
| Finding slow queries | [Query Optimization](https://www.mongodb.com/docs/manual/core/query-optimization/) · [Database Profiler](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/) · [Atlas Performance Advisor](https://www.mongodb.com/docs/atlas/performance-advisor/) | |

**Projects**

- **E-commerce backend**: products (attribute pattern for varying specs), cart and orders. Place an order inside a transaction: reduce stock, create the order and clear the cart together. Build product search with `$facet` that returns results, category counts and price buckets in one call.
- **Real-time chat or notifications**: a change stream on `messages` pushes new messages to clients with Socket.IO or Server-Sent Events.
- **Fitness / IoT tracker**: store readings in a time series collection and compute 7-day moving averages with `$setWindowFields`.
- **"Near me" API**: a 2dsphere index and `$near` to find, say, cafés within 2 km of a point.

**You're done when** you know when a transaction is needed (and when a single-document update is enough), and can push live changes from the database to a client.

---

## Level 5: Production and expert

**Goal:** run MongoDB reliably and securely for real users.

| Topic | Official docs | Also read |
| --- | --- | --- |
| Replication (copies of data, automatic failover) | [Replication](https://www.mongodb.com/docs/manual/replication/) · [Deploy a Replica Set](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/) · [Elections](https://www.mongodb.com/docs/manual/core/replica-set-elections/) · [Read Preference](https://www.mongodb.com/docs/manual/core/read-preference/) | |
| Sharding (splitting data across servers) | [Sharding](https://www.mongodb.com/docs/manual/sharding/) · [Shard Keys](https://www.mongodb.com/docs/manual/core/sharding-shard-key/) | |
| Security basics | [Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/) · [Authentication](https://www.mongodb.com/docs/manual/core/authentication/) · [Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/) | |
| Encrypting sensitive fields | [Client-Side Field Level Encryption](https://www.mongodb.com/docs/manual/core/csfle/) · [Queryable Encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/) | |
| NoSQL injection | Mongoose `sanitizeFilter` option: [Mongoose API](https://mongoosejs.com/docs/api/mongoose.html) | [OWASP NoSQL Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html) |
| Backups and restore | [Backup Methods](https://www.mongodb.com/docs/manual/core/backups/) · [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) · [mongorestore](https://www.mongodb.com/docs/database-tools/mongorestore/) · [Atlas Backups](https://www.mongodb.com/docs/atlas/backup-restore-cluster/) | |
| Monitoring and production settings | [Monitoring](https://www.mongodb.com/docs/manual/administration/monitoring/) · [Production Notes](https://www.mongodb.com/docs/manual/administration/production-notes/) | |
| Running MongoDB in Docker | | [Official mongo image (Docker Hub)](https://hub.docker.com/_/mongo) |
| AI features: semantic search with embeddings | [Vector Search](https://www.mongodb.com/docs/vector-search/) | |

Note for your repo: it uses Express 5, and the popular `express-mongo-sanitize` package doesn't work with Express 5. Use Mongoose's `sanitizeFilter` setting and validate request input yourself instead.

**Capstone projects**

- **Failover drill**: run a 3-node replica set locally with Docker Compose. Stop the primary while your Express app is writing, and watch it recover with retryable writes.
- **Harden your e-commerce API**: separate database users with least-privilege roles, sanitized filters, config from environment variables, a nightly `mongodump` script, and indexes checked with the profiler.
- **Semantic notes search**: store embeddings of your notes and use Vector Search to find notes similar to a given one.
- **Multi-tenant SaaS API** (e.g. project management): a `tenantId` on every document, compound indexes that start with `tenantId`, and a written plan for which shard key you'd pick and why.

---

## Courses, videos and cheat sheets for the whole path

**Courses and guides**

- [MongoDB University](https://learn.mongodb.com/): free official courses. Look for the "MongoDB Node.js Developer Path".
- [roadmap.sh: MongoDB Roadmap](https://roadmap.sh/mongodb): an interactive topic map that's good for checking what you've missed.
- [W3Schools MongoDB Tutorial](https://www.w3schools.com/mongodb/): short and simple, best for Levels 0–2.
- [GeeksforGeeks MongoDB Tutorial](https://www.geeksforgeeks.org/mongodb/mongodb-tutorial/): a broad written tutorial with many examples.
- [Practical MongoDB Aggregations](https://www.practical-mongodb-aggregations.com/): a free book for Levels 3–4.

**Videos**

- [Complete MongoDB Tutorial, playlist (Net Ninja)](https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA)
- [MongoDB Crash Course (Web Dev Simplified)](https://www.youtube.com/watch?v=ofme2o29ngU)
- [MongoDB Crash Course 2022 (Traversy Media)](https://www.youtube.com/watch?v=2QQGWYe7IDU)
- [Learn MongoDB in 1 Hour (Bro Code)](https://www.youtube.com/watch?v=c2M-rlkkT5o)
- [Mongoose Crash Course (Web Dev Simplified)](https://www.youtube.com/watch?v=DZBGEVgL2eE)
- [Chai aur JavaScript Backend, Hindi playlist (Chai aur Code)](https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW)

**Tools and cheat sheets**

- [mongosh cheat sheet](https://www.mongodb.com/docs/mongodb-shell/reference/cheatsheet/)
- [SQL to MongoDB Mapping Chart](https://www.mongodb.com/docs/manual/reference/sql-comparison/)
- [Mongo Playground](https://mongoplayground.net/): run queries in the browser and share them.

---

## Common beginner mistakes

- Creating a new `MongoClient` or `mongoose.connect()` inside every request. Connect once when the app starts.
- Passing `req.params.id` straight into a query. Check that it's a valid `ObjectId` first and return 400 if not.
- Committing your connection string. Put it in `.env` and add `.env` to `.gitignore`.
- Arrays that grow forever, like every comment ever written inside one post. Use references or the subset pattern instead.
- Filtering or sorting on fields without an index. Check with `explain()`.
- Using `skip()` for deep pagination on large collections. Switch to range-based pagination (`_id > lastSeenId`).
- Forgetting `await` on queries, which leaves you holding a pending Promise or Query instead of data.

---

## Progress checklist

**Level 0: Foundations**

- [ ] Atlas cluster created and sample data loaded
- [ ] Connected with mongosh and Compass
- [ ] Can explain document, collection, BSON and `_id`

**Level 1: Beginner**

- [ ] Insert, find, update and delete from mongosh
- [ ] Comparison, logical, array and element query operators
- [ ] Projection, sort, limit, skip and count
- [ ] Movie query challenges done
- [ ] Library database project done

**Level 2: Node.js + Express**

- [ ] Native driver CRUD in an Express route
- [ ] Mongoose schemas, validation, middleware and populate
- [ ] Notes API moved to MongoDB
- [ ] Task Tracker moved off `db.json`
- [ ] Auth project done

**Level 3: Intermediate**

- [ ] Embed vs reference decisions written down for one project
- [ ] Compound index designed with ESR and checked with `explain()`
- [ ] TTL and unique indexes used
- [ ] Aggregation pipeline with `$match`, `$group`, `$lookup` and `$unwind`
- [ ] Blog API with search and stats done

**Level 4: Advanced**

- [ ] `$facet` and `$setWindowFields` used
- [ ] A transaction in a real endpoint
- [ ] Change stream pushing live updates
- [ ] Time series or geospatial project done
- [ ] E-commerce backend done

**Level 5: Production**

- [ ] Local replica set with a failover test
- [ ] Least-privilege database users
- [ ] Backup and restore tested
- [ ] One capstone project shipped
