import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));

const NHL_API = "https://statsapi.web.nhl.com/api/v1";

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error("API returned " + r.status);
  }
  return r.json();
}

app.get("/api/schedule", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = await fetchJson(`${NHL_API}/schedule?date=${today}`);
    res.json(data);
  } catch (err) {
    console.error("Erreur schedule:", err);
    res.status(500).json({ error: "API Schedule failed" });
  }
});

app.get("/api/boxscore/:gamePk", async (req, res) => {
  try {
    const { gamePk } = req.params;
    const data = await fetchJson(`${NHL_API}/game/${gamePk}/boxscore`);
    res.json(data);
  } catch (err) {
    console.error("Erreur boxscore:", err);
    res.status(500).json({ error: "API Boxscore failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));














