import { getDB } from "./db";

export const getUserByEmail = async (email: string) => {
  const db = getDB();
  return await db.collection("users").findOne({ email });
};

export const getUsers = async (limit: number, offset: number) => {
  const db = getDB();
  const users = await db
    .collection("users")
    .find({ isPublic: true })
    .skip(offset)
    .limit(limit)
    .toArray();

  const total = await db.collection("users").countDocuments({ isPublic: true });

  return { users, total };
};


export const updateUserByEmail = async (email: string, updates: any) => {
  const db = await getDB();
  return db.collection("users").updateOne({ email }, { $set: updates });
};


export const createUser = async (user: any) => {
  const db = getDB();
  return await db.collection("users").insertOne(user);
};


