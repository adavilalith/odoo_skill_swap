import express from "express";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Express + TypeScript is working!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
