import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const app = express();
const port = 3000

app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});


app.get("/volunteers", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.id, v.name, v.city,
             COALESCE(SUM(q.quantity), 0) AS total_quantity
      FROM volunteers v
      LEFT JOIN collections c ON v.id = c.volunteer_id
      LEFT JOIN quantities q ON c.id = q.collection_id
      GROUP BY v.id, v.name, v.city
      ORDER BY v.name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des bénévoles" });
  }
});


app.get("/volunteers/search", async (req, res) => {
  const { city, name } = req.query;
  try {
    const result = await pool.query(
      `SELECT v.id, v.name, v.city,
              COALESCE(SUM(q.quantity), 0) AS total_quantity
       FROM volunteers v
       LEFT JOIN collections c ON v.id = c.volunteer_id
       LEFT JOIN quantities q ON c.id = q.collection_id
       WHERE ($1::text IS NULL OR v.city = $1)
         AND ($2::text IS NULL OR v.name ILIKE '%' || $2 || '%')
       GROUP BY v.id, v.name, v.city
       ORDER BY v.name ASC`,
      [city || null, name || null]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
});


app.get("/cities", async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT city FROM volunteers ORDER BY city ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des villes" });
  }
});


app.delete("/volunteers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM volunteers WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Bénévole introuvable" });
    }
    res.json({ message: "Bénévole supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression du bénévole" });
  }
});

app.listen(3000, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${port}`);
});
