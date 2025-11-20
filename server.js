import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));

const NHL_PROXY = "https://corsproxy.io/?";

async function fetchJson(url) {
  const r = await fetch(url);
  const text = await r.text();

  // anti-crash : si HTML → erreur explicite
  if (text.startsWith("<")) {
    throw new Error("HTML response instead of JSON:\n" + text.slice(0, 200));
  }

  return JSON.parse(text);
}

app.get("/api/schedule", async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const url = `${NHL_PROXY}https://statsapi.web.nhl.com/api/v1/schedule?date=${today}`;
        const data = await fetchJson(url);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get("/api/boxscore/:gamePk", async (req, res) => {
    try {
        const { gamePk } = req.params;
        const url = `${NHL_PROXY}https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`;
        const data = await fetchJson(url);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));










