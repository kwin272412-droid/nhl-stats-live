import express from "express";
const app = express();

// Sert uniquement les fichiers du dossier public
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
















