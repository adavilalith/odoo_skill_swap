import { connectToDB, getDB } from "./db";
import { users } from "./data/users";

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const populateUsers = async () => {
  const db = getDB();
  await db.collection("users").deleteMany({});
  const result = await db.collection("users").insertMany(users);
  console.log(`Populated ${result.insertedCount} users`);
};

const populateRequests = async () => {
  const db = getDB();

  // Get user emails
  const emails = users.map((u) => u.email);

  // Generate 20 random requests
  const requests = [];
  for (let i = 1; i <= 20; i++) {
    let fromEmail = getRandomItem(emails);
    let toEmail = getRandomItem(emails);

    // Ensure they’re not the same
    while (fromEmail === toEmail) {
      toEmail = getRandomItem(emails);
    }

    const fromUser = users.find((u) => u.email === fromEmail);
    const toUser = users.find((u) => u.email === toEmail);

    const skillOffered = getRandomItem(fromUser?.skillsOffered || ["N/A"]);
    const skillWanted = getRandomItem(toUser?.skillsOffered || ["N/A"]);

    requests.push({
      requestNo: i,
      fromEmail,
      toEmail,
      skillOffered,
      skillWanted,
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
