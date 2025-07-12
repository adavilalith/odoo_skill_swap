import { ObjectId } from "mongodb";
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


export async function sendRequestByEmail(
  senderEmail: string,
  receiverEmail: string,
  providedSkill: string,
  requestedSkill: string,
  message: string
) {
  const db = await getDB();
  const requests = db.collection("requests");

  const requestDoc = {
    senderEmail,
    receiverEmail,
    providedSkill,
    requestedSkill,
    message,
    timestamp: new Date(),
    status: "pending", // default status
  };

  return await requests.insertOne(requestDoc);
}


export const getRequestsByEmail = async (email: string) => {
  const db = await getDB();
  const requests = await db.collection("requests").find({
    $or: [{ senderEmail: email }, { receiverEmail: email }]
  }).toArray();

  const enriched = await Promise.all(
    requests.map(async (req: any) => {
      const senderProfile = await getUserByEmail(req.senderEmail);
      const receiverProfile = await getUserByEmail(req.receiverEmail);
      return {
        ...req,
        senderProfile,
        receiverProfile,
      };
    })
  );

  const received = enriched.filter((r) => r.receiverEmail === email);
  const sent = enriched.filter((r) => r.senderEmail === email);

  return { received, sent };
};

export const updateRequestStatus = async (requestId: string, status: "Accepted" | "Rejected") => {
  const db = await getDB();
  const collection = db.collection("requests");

  const result = await collection.updateOne(
    { _id: new ObjectId(requestId) },
    { $set: { status, updatedAt: new Date() } }
  );

  return result;
};

