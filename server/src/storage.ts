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


export const hasAcceptedSwap = async (user1: string, user2: string) => {
  const db = getDB();
  const accepted = await db.collection("requests").findOne({
    status: "accepted",
    $or: [
      { senderEmail: user1, receiverEmail: user2 },
      { senderEmail: user2, receiverEmail: user1 }
    ]
  });
  return !!accepted;
};

export const addReview = async (
  reviewerEmail: string,
  reviewedEmail: string,
  rating: number,
  text: string
) => {
  const db = getDB();

  const reviewer = await db.collection("users").findOne({ email: reviewerEmail });
  if (!reviewer) throw new Error("Reviewer not found");

  const review = {
    reviewerEmail,
    reviewedEmail,
    reviewerName: reviewer.name || reviewerEmail,
    rating,
    text,
    timestamp: new Date(),
  };

  await db.collection("reviews").insertOne(review);
};

export const getReviewsByUser = async (email: string) => {
  const db = getDB();

  return await db.collection("reviews").find({ reviewedEmail: email }).sort({ timestamp: -1 }).toArray();
};