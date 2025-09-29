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

app.use(cors({ origin: "http://127.0.0.1:5500"}));

app.get("/volunteers", async (req, res) => {  
  try {
    
  const result = await pool.query('SELECT * from volunteers')
  res.json(result.rows)
  } catch (error) {
    console.log(error)
    
  }
});

app.listen(3000, () => {  console.log("Serveur lancé sur http://localhost:3000");});
