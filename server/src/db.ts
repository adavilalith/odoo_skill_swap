import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);

let db: Db;

export const connectToDB = async () => {
    await client.connect();
    db = client.db("odoo_skill_swap");
//  const collections = await db.listCollections().toArray();
//  console.log("Collections:", collections.map(col => col.name));
    console.log("Connected to MongoDB Atlas");
};

export const getDB = (): Db => db;
