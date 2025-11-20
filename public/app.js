async function getSchedule() {
    const today = new Date().toISOString().slice(0, 10);
    const url = `https://statsapi.web.nhl.com/api/v1/schedule?date=${today}`;

    const r = await fetch(url);
    const data = await r.json();
    console.log(data);
}

getSchedule();


