import { closeDB, connectDB } from "./db.js"

try {
    await connectDB()
} catch (err) {
    console.error(err.message)
} finally {
    await closeDB();
}