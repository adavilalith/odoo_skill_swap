// src/backend/populate.ts
import { connectToDB, getDB } from "./db";
import { users } from "./data/users";
import bcrypt from "bcrypt";

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const populateUsers = async () => {
  const db = getDB();
  const collection = db.collection("users");

  await collection.deleteMany({});

  const hashedPassword = await bcrypt.hash("123456", 10); // hash for all users

  const enhancedUsers = users.map((user) => ({
    ...user,
    password: hashedPassword,
    location: "",
    photo: user.photo || "",
    skillsOffered: user.skillsOffered || [],
    skillsWanted: user.skillsWanted || [],
    availability: "weekends",
    isPublic: true,
    rating: 0,
  }));

  const result = await collection.insertMany(enhancedUsers);
  console.log(`Populated ${result.insertedCount} users`);
};

const populateRequests = async () => {
  const db = getDB();
  const emails = users.map((u) => u.email);
  const requests = [];

  for (let i = 1; i <= 50; i++) {
    let fromEmail = getRandomItem(emails);
    let toEmail = getRandomItem(emails);

    while (fromEmail === toEmail) {
      toEmail = getRandomItem(emails);
    }

    const fromUser = users.find((u) => u.email === fromEmail);
    const toUser = users.find((u) => u.email === toEmail);

    const skillOffered = getRandomItem(fromUser?.skillsOffered || ["N/A"]);
    const skillWanted = getRandomItem(toUser?.skillsOffered || ["N/A"]);

    requests.push({
      senderEmail: fromEmail,
      receiverEmail: toEmail,
      providedSkill: skillOffered,
      requestedSkill: skillWanted,
      message: "Let's skill swap!",
      status: getRandomItem(["pending", "accepted", "rejected"]),
      timestamp: new Date(),
    });
  }

  await db.collection("requests").deleteMany({});
  const result = await db.collection("requests").insertMany(requests);
  console.log(`Populated ${result.insertedCount} requests`);
};

const main = async () => {
  try {
    await connectToDB();
    await populateUsers();
    await populateRequests();
    console.log("Database seeding complete.");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    process.exit();
  }
};

main();
