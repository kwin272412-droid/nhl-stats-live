import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));

// Proxy CORS pour contourner le blocage Render
const NHL_API = "https://corsproxy.io/?https://statsapi.web.nhl.com/api/v1";

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("HTTP error: " + r.status);
  return await r.json();
}

app.get("/api/schedule", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = await fetchJson(`${NHL_API}/schedule?date=${today}`);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API failed" });
  }
});

app.get("/api/boxscore/:gamePk", async (req, res) => {
  try {
    const data = await fetchJson(`${NHL_API}/game/${req.params.gamePk}/boxscore`);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));








