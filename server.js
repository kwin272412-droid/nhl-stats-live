import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));

const NHL_API = "https://statsapi.web.nhl.com/api/v1";

// FORCER des User-Agent différents pour éviter Cloudflare
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0",
];

// Fonction fetch JSON avec protection anti-HTML
async function fetchJson(url) {
  const r = await fetch(url, {
    headers: {
      "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
      "Accept": "application/json",
    }
  });

  const text = await r.text();

  // NHL renvoie parfois du HTML => on bloque
  if (text.startsWith("<")) {
    console.error("❌ NHL a renvoyé du HTML !", text.slice(0, 200));
    throw new Error("NHL API blocked the request");
  }

  return JSON.parse(text);
}

/* -------------------------
   ROUTE : SCHEDULE
 -------------------------*/
app.get("/api/schedule", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const url = `${NHL_API}/schedule?date=${today}`;
    const data = await fetchJson(url);
    res.json(data);
  } catch (err) {
    console.error("Erreur /api/schedule :", err);
    res.status(500).json({ error: "API Schedule failed" });
  }
});

/* -------------------------
   ROUTE : BOXSCORE
 -------------------------*/
app.get("/api/boxscore/:gamePk", async (req, res) => {
  try {
    const { gamePk } = req.params;
    const url = `${NHL_API}/game/${gamePk}/boxscore`;
    const data = await fetchJson(url);
    res.json(data);
  } catch (err) {
    console.error("Erreur /api/boxscore :", err);
    res.status(500).json({ error: "API Boxscore failed" });
  }
});

/* -------------------------
   LANCEMENT SERVEUR
 -------------------------*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
















