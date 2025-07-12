import { getDB } from "./db";

export const getUserByEmail = async (email: string) => {
  const db = getDB();
  return await db.collection("users").findOne({ email });
};

// You can add more like:
export const createUser = async (user: any) => {
  const db = getDB();
  return await db.collection("users").insertOne(user);
};
