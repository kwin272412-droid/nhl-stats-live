import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));

// Proxy fiable
const PROXY = "https://api.allorigins.win/raw?url=";
const NHL_API = "https://statsapi.web.nhl.com/api/v1";

async function fetchJson(url) {
  // ENCODE l'URL ici 👇
  const encodedUrl = PROXY + encodeURIComponent(url);

  const r = await fetch(encodedUrl);
  const text = await r.text();

  // Debug si la réponse n'est pas JSON
  if (!text.startsWith("{") && !text.startsWith("[")) {
    console.error("❌ Réponse non JSON:", text.slice(0, 200));
    throw new Error("Réponse API invalide");
  }

  return JSON.parse(text);
}

app.get("/api/schedule", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const url = `${NHL_API}/schedule?date=${today}`;
    const data = await fetchJson(url);
    res.json(data);
  } catch (err) {
    console.error("Erreur schedule:", err);
    res.status(500).json({ error: "API Schedule failed" });
  }
});

app.get("/api/boxscore/:gamePk", async (req, res) => {
  try {
    const { gamePk } = req.params;
    const url = `${NHL_API}/game/${gamePk}/boxscore`;
    const data = await fetchJson(url);
    res.json(data);
  } catch (err) {
    console.error("Erreur boxscore:", err);
    res.status(500).json({ error: "API Boxscore failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));













