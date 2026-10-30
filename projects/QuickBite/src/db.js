import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
export const connectDB = async () => await client.connect();
export const getDB = async () => client.db(process.env.DB_NAME);
export const closeDB = async () => await client.close();
