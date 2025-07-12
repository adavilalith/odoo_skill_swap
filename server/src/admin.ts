// admin.ts
import readline from "readline";
import { connectToDB, getDB } from "./db";
import dotenv from "dotenv";
dotenv.config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

const run = async () => {
  await connectToDB();
  const db = getDB();

  console.log("\n=== Skill Swap Admin CLI ===");
  console.log("1. Ban User");
  console.log("2. Unban User");
  console.log("3. Remove Skill from User");
  console.log("4. View Swap Stats");
  console.log("5. Exit\n");

  const choice = await ask("Enter choice: ");

  switch (choice) {
    case "1": {
      const email = await ask("Enter email to ban: ");
      await db.collection("users").updateOne({ email }, { $set: { banned: true } });
      console.log("✅ User banned.");
      break;
    }

    case "2": {
      const email = await ask("Enter email to unban: ");
      await db.collection("users").updateOne({ email }, { $set: { banned: false } });
      console.log("✅ User unbanned.");
      break;
    }

    case "3": {
      const email = await ask("User email: ");
      const skill = await ask("Skill to remove: ");
     await db.collection("users").updateOne(
        { email },
        {
            $pull: {
            skillsOffered: { $eq: skill },
            skillsWanted: { $eq: skill },
            },
        } as any
        );
      console.log("✅ Skill removed.");
      break;
    }

    case "4": {
      const pending = await db.collection("requests").countDocuments({ status: "pending" });
      const accepted = await db.collection("requests").countDocuments({ status: "accepted" });
      const rejected = await db.collection("requests").countDocuments({ status: "rejected" });

      console.log(`\n📊 Swap Stats:`);
      console.log(`Pending: ${pending}`);
      console.log(`Accepted: ${accepted}`);
      console.log(`Rejected: ${rejected}\n`);
      break;
    }

    default:
      console.log("👋 Exiting...");
      break;
  }

  rl.close();
};

run();
