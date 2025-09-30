import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg"


const app = express();

dotenv.config();
app.use(express.json());

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


//nouvelle route pour la page add_collect: ajouter une nouvelle collecte
app.post("/add_collection", async (req, res) => {
console.log("[POST/collection] body reçu:", req.body);
const { volunteers_name, collections_date, collections_location, quantity_1,quantity_2, quantity_4, quantity_5, quantity_6} = req.body; //!req.body est stocké dans une variable d'objet
try {
//*récupérer le id du volunteer
	const volunteerResult = await pool.query(
	"SELECT id from volunteers WHERE name = $1",[volunteers_name]);
	console.log("volunteerResult", volunteerResult.rows);
	const volunteer_id = volunteerResult.rows[0].id;
//*insérer la collecte dans collections
  const insertCollection = await pool.query(
	"INSERT INTO collections\
	(volunteer_id, collection_date, location)\
	VALUES ($1,$2,$3) RETURNING id",
	[volunteer_id, collections_date, collections_location]
	);
  const collection_id = insertCollection.rows[0].id;
  //insérer des infos dans la table quantities
  const insertQuantity = await pool.query(
    `INSERT INTO quantities\
    (collection_id, category_id, quantity) VALUES
    (${collection_id},1, $1),
    (${collection_id},2, $2),
    (${collection_id},4, $3),
    (${collection_id},5, $4),
    (${collection_id},6, $5)`,
    [quantity_1,quantity_2,quantity_4,quantity_5,quantity_6]
  );
//*renvoyer un message alerte
	return res.status(201).json({
		ok: true,
		message: `collecte ajoutée par ${volunteers_name}`,
	});
} catch (error) {
console.error("erreur lors de la création de la collecte", error);
}
});


app.listen(3000, () => {  console.log("Serveur lancé sur http://localhost:3000");});
