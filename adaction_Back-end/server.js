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
    console.log("Résultat SQL volunteers:", result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur SQL volunteers:", error);
    res.status(500).json({ error: error.message });
  }
});

// Total des déchets collectés
app.get("/stats/total", async (req, res) => {
  console.log("Route /stats/total appelée");
  try {
    const result = await pool.query(`
      SELECT SUM(q.quantity) AS total
      FROM quantities q
      JOIN collections c ON q.collection_id = c.id
    `);
    console.log("Résultat SQL total:", result.rows[0]);
    res.json(result.rows[0] || { total: 0 });
  } catch (error) {
    console.error("Erreur SQL total:", error);
    res.status(500).json({ error: error.message });
  }
});
//Total des dechets par categories
app.get("/stats/categories", async (req, res) => {
  try {
    const result = await pool.query(`SELECT categories.name , SUM(quantities.quantity) AS total 
FROM quantities JOIN categories on quantities.category_id = categories.id 
GROUP BY categories.name;`);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur SQL categories:", error);
    res.status(500).json({ error: error.message });
  }
});
// ajouter les filtres 
app.get("/stats/filters", async (req, res) => {
  try { 
    const {year,month,location} = req.query;
    let query = `
SELECT SUM (quantities.quantity) AS total 
FROM quantities JOIN collections on quantities.collection_id = collections.id 
WHERE 1=1`;
    const params = [];
    if (year) {
      params.push(year);
      query += ` AND EXTRACT(YEAR FROM collections.date) = $${params.length}`;
    }
    if (month) {
      params.push(month);
      query += ` AND EXTRACT(MONTH FROM collections.date) = $${params.length}`;
    } if (location) {
      params.push(location);
      query += ` AND collections.location = $${params.length}`;
    }
    const result = await pool.query(query, params);
    res.json(result.rows[0] );
  } catch (error) {
    console.error("Erreur SQL filters:", error);
    res.status(500).json({ error: error.message });
  } });

// Démarrer le serveur
      
app.listen(3000, () => { console.log("Serveur lancé sur http://localhost:3000"); });