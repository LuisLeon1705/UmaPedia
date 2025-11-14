const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const getAllUmaMusumes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM uma_musumes ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getUmaMusumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM uma_musumes WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Uma Musume not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const createUmaMusume = async (req, res) => {
  try {
    const {
      name,
      description,
      rarity,
      speed,
      stamina,
      power,
      guts,
      intelligence,
    } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const newUmaMusume = await pool.query(
      "INSERT INTO uma_musumes (name, description, image_url, rarity, speed, stamina, power, guts, intelligence) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        name,
        description,
        imageUrl,
        rarity,
        speed,
        stamina,
        power,
        guts,
        intelligence,
      ]
    );

    res.json(newUmaMusume.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const updateUmaMusume = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      rarity,
      speed,
      stamina,
      power,
      guts,
      intelligence,
    } = req.body;

    // Get the existing uma musume to check for an old image
    const existingUmaMusumeResult = await pool.query(
      "SELECT * FROM uma_musumes WHERE id = $1",
      [id]
    );

    if (existingUmaMusumeResult.rows.length === 0) {
      return res.status(404).json({ msg: "Uma Musume not found" });
    }

    const existingUmaMusume = existingUmaMusumeResult.rows[0];
    let imageUrl = existingUmaMusume.image_url;

    // If a new image is uploaded, delete the old one
    if (req.file) {
      if (existingUmaMusume.image_url) {
        fs.unlink(existingUmaMusume.image_url, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          }
        });
      }
      imageUrl = req.file.path;
    }

    const updatedUmaMusume = await pool.query(
      "UPDATE uma_musumes SET name = $1, description = $2, image_url = $3, rarity = $4, speed = $5, stamina = $6, power = $7, guts = $8, intelligence = $9 WHERE id = $10 RETURNING *",
      [
        name,
        description,
        imageUrl,
        rarity,
        speed,
        stamina,
        power,
        guts,
        intelligence,
        id,
      ]
    );

    res.json(updatedUmaMusume.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const deleteUmaMusume = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await pool.query(
      "DELETE FROM uma_musumes WHERE id = $1 RETURNING *",
      [id]
    );

    if (deleteOp.rows.length === 0) {
      return res.status(404).json({ msg: "Uma Musume not found" });
    }

    // Also delete the image file from storage
    if (deleteOp.rows[0].image_url) {
      fs.unlink(deleteOp.rows[0].image_url, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }

    res.json({ msg: "Uma Musume deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllUmaMusumes,
  getUmaMusumeById,
  createUmaMusume,
  updateUmaMusume,
  deleteUmaMusume,
  upload,
};
