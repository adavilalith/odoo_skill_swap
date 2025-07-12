import express from "express";
import { getUserByEmail, createUser } from "./storage";

const router = express.Router();

router.get("/", async (req, res) => {
  const email = "marc.demo@example.com";

  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("User found:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/api/getUserInfo", async (req, res) => {

  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("User found:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});


export default router;
