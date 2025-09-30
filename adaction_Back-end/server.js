import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg"


const app = express();
app.use(express.json())
app.use(cors({ origin: "http://127.0.0.1:5500" }));

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // recommandé pour Neon afin de sécuriser la connexion
});



app.get("/volunteers", async (req, res) => {
  try {

    const result = await pool.query('SELECT * from volunteers')
    res.json(result.rows)
  } catch (error) {
    console.log(error)
  }
});

app.get("/volunteers/search", async (req, res) => {
  const { city, name } = req.query;

  try {
    const result = await pool.query(
      `SELECT v.id, v.name, v.city, COALESCE(SUM(q.quantity),0) AS total_quantity
       FROM volunteers v
       LEFT JOIN collections c ON v.id = c.volunteer_id
       LEFT JOIN quantities q ON c.id = q.collection_id
       WHERE ($1::text IS NULL OR v.city = $1)
         AND ($2::text IS NULL OR v.name ILIKE '%' || $2 || '%')
       GROUP BY v.id, v.name, v.city`,
      [city || null, name || null]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
});


app.get("/quantities", async(req, res) => {
  try {
    const quantity = await pool.query ('SELECT volunteers.name, volunteers.city,\
      SUM(quantities.quantity) AS total_quantity\
      FROM quantities\
      INNER JOIN collections ON quantities.collection_id = collections.id\
      INNER JOIN volunteers ON collections.volunteer_id = volunteers.id\
      GROUP BY volunteers.id, volunteers.name')

    res.json(quantity.rows)
  } catch (error) {
    console.log(error)
  }
})

app.get("/cities", async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT city FROM volunteers ORDER BY city ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des villes" });
  }
});


app.listen(3000, () => { console.log("Serveur lancé sur http://localhost:3000"); });
