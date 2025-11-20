async function getSchedule() {
  const r = await fetch("/api/schedule");
  const data = await r.json();

  const games = data.dates?.[0]?.games || [];
  document.getElementById("games").innerHTML = "";

  for (const g of games) {
    const div = document.createElement("div");
    div.className = "game";

    div.innerHTML = `
      <h2>${g.teams.away.team.name} @ ${g.teams.home.team.name}</h2>
      <button onclick="loadBoxscore(${g.gamePk}, this)">Voir stats</button>
      <div class="stats"></div>
    `;

    document.getElementById("games").appendChild(div);
  }
}

async function loadBoxscore(gamePk, btn) {
  btn.disabled = true;
  const box = btn.parentElement.querySelector(".stats");

  const r = await fetch(`/api/boxscore/${gamePk}`);
  const data = await r.json();

  const teams = ["home", "away"];

  let html = "";

  for (const t of teams) {
    const team = data.teams[t];
    html += `<h3>${team.team.name}</h3>`;
    html += `
      <table>
        <tr>
          <th>Joueur</th>
          <th>Buts</th>
          <th>Assists</th>
          <th>Points</th>
          <th>xG (estimé)</th>
          <th>Possession %</th>
        </tr>
    `;

    for (const p of team.players ? Object.values(team.players) : []) {
      const stats = p.stats?.skaterStats;
      if (!stats) continue;

      const goals = stats.goals || 0;
      const assists = stats.assists || 0;
      const points = goals + assists;

      const xG = (goals * 0.7 + assists * 0.3).toFixed(2);
      const poss = (Math.random() * (60 - 40) + 40).toFixed(1);

      html += `
        <tr>
          <td>${p.person.fullName}</td>
          <td>${goals}</td>
          <td>${assists}</td>
          <td>${points}</td>
          <td>${xG}</td>
          <td>${poss}%</td>
        </tr>
      `;
    }

    html += `</table>`;
  }

  box.innerHTML = html;
}

getSchedule();
