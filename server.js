import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));

const NHL_API = "https://statsapi.web.nhl.com/api/v1";

async function fetchJson(url) {
  const r = await fetch(url);
  return await r.json();
}

// Matches of the day
app.get("/api/schedule", async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const data = await fetchJson(`${NHL_API}/schedule?date=${today}`);
  res.json(data);
});

// Boxscore per match
app.get("/api/boxscore/:gamePk", async (req, res) => {
  const { gamePk } = req.params;
  const data = await fetchJson(`${NHL_API}/game/${gamePk}/boxscore`);
  res.json(data);
});

app.listen(3000, () => console.log("NHL Stats Live running on port 3000"));
