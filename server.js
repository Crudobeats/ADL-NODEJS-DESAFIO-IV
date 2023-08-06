const express = require("express");
require('dotenv').config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); 

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  allowExitOnIdle: true,
});

app.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM posts");
    client.release(); 

    res.json(result.rows); 
  } catch (err) {
    console.error("Error al obtener los posts:", err);
    res.status(500).send("Error del servidor");
  }
});

app.post("/posts", async (req, res) => {
  const { titulo, img, descripcion, likes } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, img, descripcion, likes]
    );
    client.release();

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear un nuevo post:", err);
    res.status(500).send("Error del servidor");
  }
});

app.put("/posts", async (req, res) => {
  const { id } = req.params;
  const { titulo, img, descripcion, likes } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE posts SET titulo = $1, img = $2, descripcion = $3, likes = $4 WHERE id = $5 RETURNING *",
      [titulo, img, descripcion, likes, id]
    );
    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al modificar el registro:", err);
    res.status(500).send("Error del servidor");
  }
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );
    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al eliminar el registro:", err);
    res.status(500).send("Error del servidor");
  }
});

app.listen(3000, () => {
  console.log("Servidor Encendido en http://localhost:3000");
});
