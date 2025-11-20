import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));

// Nouveau proxy compatible Render
const PROXY = "https://api.allorigins.win/raw?url=";
const NHL_API = "https://statsapi.web.nhl.com/api/v1";

async function fetchJson(url) {
  const r = await fetch(PROXY + encodeURIComponent(url));
  return await r.json();
}

// Schedule du jour
app.get("/api/schedule", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = await fetchJson(`${NHL_API}/schedule?date=${today}`);
    res.json(data);
  } catch (err) {
    console.error("Schedule error:", err);
    res.status(500).json({ error: "Failed to load schedule" });
  }
});

// Boxscore
app.get("/api/boxscore/:gamePk", async (req, res) => {
  try {
    const { gamePk } = req.params;
    const data = await fetchJson(`${NHL_API}/game/${gamePk}/boxscore`);
    res.json(data);
  } catch (err) {
    console.error("Boxscore error:", err);
    res.status(500).json({ error: "Failed to load boxscore" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));












