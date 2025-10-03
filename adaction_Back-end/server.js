import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL manquant dans .env");
}
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

// Connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test de connexion
pool.connect()
  .then(client => {
    console.log("✅ Connecté à la base Neon");
    client.release();
  })
  .catch(err => console.error("❌ Impossible de se connecter :", err));

// Route test
app.get("/test", (req, res) => res.send("Serveur OK !"));

// Liste des bénévoles
app.get("/volunteers", async (req, res) => {
  console.log("Route /volunteers appelée");
  try {
    const result = await pool.query("SELECT * FROM volunteers");
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur SQL volunteers:", error);
    res.status(500).json({ error: error.message });
  }
});

// Liste des villes présentes dans les collections
app.get("/cities", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT location
            FROM collections
            WHERE location IS NOT NULL
            ORDER BY location
        `);
        // renvoie un tableau de strings
        const cities = result.rows.map(r => r.location);
        res.json(cities);
    } catch (error) {
        console.error("Erreur SQL cities:", error);
        res.status(500).json({ error: error.message });
    }
});

// Liste des villes
app.get("/stats/overview", async (req, res) => {
  try {
    const { location, date } = req.query;
    const params = [];
    let where = "WHERE 1=1";

    if (date) {
      params.push(date);
      where += ` AND DATE(c."collection_date") = $${params.length}`;
    }

    if (location) {
      params.push(location);
      where += ` AND c.location = $${params.length}`;
    }
    // Total global ou filtré
    const totalQuery = `
      SELECT SUM(q.quantity) AS total
      FROM quantities q
      JOIN collections c ON q.collection_id = c.id
      ${where}
    `;
    const totalResult = await pool.query(totalQuery, params);
    // Total par catégorie
    const categoriesQuery = `
      SELECT cat.name, SUM(q.quantity) AS total
      FROM quantities q
      JOIN categories cat ON q.category_id = cat.id
      JOIN collections c ON q.collection_id = c.id
      ${where}
      GROUP BY cat.name
    `;
    const categoriesResult = await pool.query(categoriesQuery, params);
    res.json({
      total: totalResult.rows[0]?.total ? Number(totalResult.rows[0].total) : 0,
      categories: categoriesResult.rows.map(r => ({
        name: r.name,
        total: r.total ? Number(r.total) : 0
      }))
    });

  } catch (error) {
    console.error("Erreur SQL overview:", error);
    res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log("🚀 Serveur lancé sur http://localhost:3000");
});
