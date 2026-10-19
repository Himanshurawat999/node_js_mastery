import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const db = client.db("sample_mflix");
  const res = await db.command({ validate: "movies" });

  console.log("valid:", res.valid); // true = no problems found
  console.log("records:", res.nrecords); // how many documents were scanned
  console.log("invalid docs:", res.nInvalidDocuments);
  console.log("indexes:", res.nIndexes, res.keysPerIndex);
  console.log("errors:", res.errors); // [] when healthy
  console.log("warnings:", res.warnings);

  // Collection Bulk Opration
  // const result = await movies.bulkWrite(
  //   [
  //     { insertOne: { document: { title: "My Movie", year: 2026 } } },
  //     {
  //       updateOne: {
  //         filter: { title: "My Mov" },
  //         update: { $set: { rated: "PG" } },
  //         upsert: false,
  //       },
  //     },
  //     { updateMany: { filter: { year: 1903 }, update: { $inc: { year: 1 } } } },
  //     {
  //       replaceOne: {
  //         filter: { title: "Old Movie" },
  //         replacement: { title: "New Movie", year: 2025 },
  //       },
  //     },
  //     { deleteOne: { filter: { title: "Delete Me" } } },
  //     { deleteMany: { filter: { year: { $lt: 1900 } } } },
  //   ],
  //   { ordered: true },
  // );

  // Client Bulk Opration
  // const result = await client.bulkWrite(
  //   [
  //     {
  //       namespace: `${db.databaseName}.movies`,
  //       name: "insertOne",
  //       document: { title: "Cross Collection Movie", year: 2026 },
  //     },
  //     {
  //       namespace: `${db.databaseName}.users`,
  //       name: "updateOne",
  //       filter: { email: "stephen_dillane@gameofthron.es" },
  //       update: { $set: { active: true } },
  //       upsert: true,
  //     },
  //     {
  //       namespace: `${db.databaseName}.comments`,
  //       name: "updateMany",
  //       filter: { movie_id: null },
  //       update: { $set: { orphan: true } },
  //     },
  //     {
  //       namespace: `${db.databaseName}.theaters`,
  //       name: "replaceOne",
  //       filter: { theaterId: 100 },
  //       replacement: { theaterId: 1000, closed: true },
  //     },
  //     {
  //       namespace: "practice.notes",
  //       name: "insertOne",
  //       document: {
  //         text: "Written from client.bulkWrite",
  //         createdAt: new Date(),
  //       },
  //     },

  //     {
  //       namespace: "practice.books",
  //       name: "deleteMany",
  //       filter: { title: "Delete Me" },
  //     },
  //   ],
  //   { ordered: true, verboseResults: true },
  // );

  // console.log(result.insertedCount, result.modifiedCount, result.deletedCount);
  // verboseResults: true adds per-operation details (Maps keyed by operation index):
  // console.log(result.insertResults, result.updateResults, result.deleteResults);
} catch (err) {
  console.log("It's a Error");
  console.log(err.writeErrors);
  console.log(err.result);
} finally {
  await client.close();
}
