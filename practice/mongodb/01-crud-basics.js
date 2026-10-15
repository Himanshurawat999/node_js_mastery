import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const db = client.db("sample_mflix");
  const movies = db.collection("movies");
  const moviesList = await movies.find({}).toArray();
  console.log(moviesList);
} finally {
  await client.close();
}
