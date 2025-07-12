import express from "express";
import { getUserByEmail,updateUserByEmail, getUsers } from "./storage";

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


export default router;
