import { connectToDB, getDB } from "./db";

const nukeDb = async () => {
  try {
    await connectToDB();
    const db = getDB();

    const collections = await db.listCollections().toArray();
    for (const coll of collections) {
      await db.collection(coll.name).deleteMany({});
      console.log(`Cleared collection: ${coll.name}`);
    }

    console.log("Database successfully nuked.");
  } catch (err) {
    console.error("Error nuking database:", err);
  } finally {
    process.exit();
  }
};

nukeDb();
