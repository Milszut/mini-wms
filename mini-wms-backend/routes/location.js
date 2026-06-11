const express = require('express');
const { pool } = require('../db');
const requireLogin = require('../middleware/requireLogin');
const { locationSchema } = require('../validators/locationValidator');

const router = express.Router();

router.get('/', requireLogin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM location ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('Błąd podczas pobierania lokalizacji:', err);
    res.status(500).json({error: 'Błąd serwera przy pobieraniu lokalizacji'});
  }
});

router.post('/', requireLogin, async (req, res) => {
  try {
    const { error } = locationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({error: error.details[0].message,});
    }
    const { name } = req.body;
    await pool.query(`INSERT INTO location (name) VALUES (?)`, [name]);
    res.status(201).json({message: 'Lokalizacja została dodana pomyślnie!',});
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({error: 'Taka lokalizacja już istnieje!',});
    }
    console.error('Błąd podczas dodawania lokalizacji:', err);
    res.status(500).json({error: 'Błąd serwera przy dodawaniu lokalizacji'});
  }
});

router.put('/:id', requireLogin, async (req, res) => {
  try {
    const { error } = locationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({error: error.details[0].message,});
    }
    const { id } = req.params;
    const { name } = req.body;
    const [rows] = await pool.query(`SELECT id FROM location WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({error: 'Nie znaleziono lokalizacji!',});
    }
    await pool.query(`UPDATE location SET name = ? WHERE id = ?`, [name, id]);
    res.json({message: 'Lokalizacja została zaktualizowana pomyślnie!',});
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({error: 'Taka lokalizacja już istnieje!',});
    }
    console.error('Błąd podczas aktualizacji lokalizacji:', err);
    res.status(500).json({error: 'Błąd serwera przy aktualizacji lokalizacji'});
  }
});

router.delete('/:id', requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const [locationRows] = await pool.query(`SELECT name FROM location WHERE id = ?`,[id]);
    if (locationRows.length === 0) {
      return res.status(404).json({error: 'Nie znaleziono lokalizacji!',});
    }
    const locationName = locationRows[0].name;
    const [rows] = await pool.query(`SELECT COUNT(*) as count FROM items WHERE location_id = ?`,[id]);
    if (rows[0].count > 0) {
      return res.status(400).json({error: `Lokalizacja "${locationName}" posiada przypisane przedmioty i nie może zostać usunięta.`,});
    }
    await pool.query(`DELETE FROM location WHERE id = ?`, [id]);
    res.json({message: 'Lokalizacja została usunięta pomyślnie!',});
  } catch (err) {
    console.error('Błąd podczas usuwania lokalizacji:', err);
    res.status(500).json({error: 'Błąd serwera przy usuwaniu lokalizacji',});
  }
});

module.exports = router;