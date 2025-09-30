import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg"


const app = express();

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // recommandé pour Neon afin de sécuriser la connexion
});

app.use(cors()); // Autorise toutes les origines pour faciliter les tests

app.get("/volunteers", async (req, res) => {  
  try {
    const result = await pool.query('SELECT * from volunteers');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur ou base de données', details: error.message });
  }
}); 



app.listen(3000, () => {  console.log("Serveur lancé sur http://localhost:3000");});
