import express from "express";
import { getUserByEmail,updateUserByEmail, getUsers, sendRequestByEmail,getRequestsByEmail, updateRequestStatus, hasAcceptedSwap, getReviewsByUser, addReview } from "./storage";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Express + TypeScript is working!");
});

router.post("/api/getUserByEmail", async (req, res) => {

  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    console.log("Fetching user by email:", email);
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    // console.log("User found:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/api/updateUserByEmail", async (req, res) => {
  const { email, updates } = req.body;
  console.log(req.body)
  if (!email || !updates) {
    return res.status(400).json({ error: "Missing email or updates" });
  }

  try {
    const result = await updateUserByEmail(email, updates);
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "User not found or no changes made" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/sendRequestByEmail", async (req, res) => {
  const { senderEmail, receiverEmail, providedSkill, requestedSkill, message } = req.body;

  if (!senderEmail || !receiverEmail || !providedSkill || !requestedSkill || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await sendRequestByEmail(senderEmail, receiverEmail, providedSkill, requestedSkill, message);
    res.json({ success: true, requestId: result.insertedId });
  } catch (err) {
    console.error("Error sending request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/getUsers", async (req, res) => {
  try {
    console.log("Received request for users with query:", req.query);
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const { users, total } = await getUsers(limit, offset);
    res.status(200).json({ users, total });
  } catch (err) {
    console.error("Error in /api/getUsers:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/api/getRequestsByEmail", async (req, res) => {
  const email = req.query.email as string;
  console.log("Fetching requests for email:", email);

  if (!email) {
    return res.status(400).json({ error: "Missing email parameter" });
  }

  try {
    const { sent, received } = await getRequestsByEmail(email);
    res.json({ sent, received });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/updateRequestStatus", async (req, res) => {
  const { requestId, status } = req.body;
  console.log("Updating request status:", requestId, status); 
  if (!requestId || !["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid request ID or status." });
  }

  try {
    const result = await updateRequestStatus(requestId, status);
    res.json({ success: true, updatedCount: result.modifiedCount });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ error: "Failed to update request status." });
  }
});
router.get("/api/hasAcceptedRequest", async (req, res) => {
  const { sender, receiver } = req.query;
  if (!sender || !receiver) return res.status(400).json({ error: "Both sender and receiver required" });

  try {
    const allowed = await hasAcceptedSwap(sender as string, receiver as string);
    res.json({ allowed });
  } catch (err) {
    console.error("Check accepted request failed", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/getReviewsByUser", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const reviews = await getReviewsByUser(email as string);
    res.json({ reviews });
  } catch (err) {
    console.error("Failed to fetch reviews", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/api/addReview", async (req, res) => {
  const { reviewerEmail, reviewedEmail, rating, text } = req.body;

  if (!reviewerEmail || !reviewedEmail || !rating || !text) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const allowed = await hasAcceptedSwap(reviewerEmail, reviewedEmail);
    if (!allowed) {
      return res.status(403).json({ error: "You are not allowed to review this user." });
    }

    await addReview(reviewerEmail, reviewedEmail, rating, text);
    res.json({ success: true });
  } catch (err) {
    console.error("Add review failed", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



export default router;
