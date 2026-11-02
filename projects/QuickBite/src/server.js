import app from "./app.js";
import { closeDB, connectDB } from "./db.js";

const port = process.env.PORT;

try {
  await connectDB();
  console.log("MongoDB connected");
} catch (err) {
  console.error("Could not connect to MongoDB:", err.message);
  process.exit(1);
}

const server = app.listen(port, () => {
  console.log(`QuickBite listening on http://localhost:${port}`);
});

const shutdown = () => {
  console.log("Shutting down...");
  server.close(async () => {
    await closeDB();
    console.log("MongoDB connection closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
