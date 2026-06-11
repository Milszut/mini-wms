const express = require('express');
const { pool } = require('../db');
const requireLogin = require('../middleware/requireLogin');
const { serviceSchema } = require('../validators/serviceValidator');

const router = express.Router();

router.get('/', requireLogin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM service ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('Błąd podczas pobierania działów:', err);
    res.status(500).json({error: 'Błąd serwera przy pobieraniu działów'});
  }
});

router.post('/', requireLogin, async (req, res) => {
  try {
    const { error } = serviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({error: error.details[0].message,});
    }
    const { name } = req.body;
    await pool.query(`INSERT INTO service (name) VALUES (?)`, [name]);
    res.status(201).json({message: 'Dział został dodany pomyślnie!',});
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({error: 'Taki dział już istnieje!',});
    }
    console.error('Błąd podczas dodawania działu:', err);
    res.status(500).json({error: 'Błąd serwera przy dodawaniu działu'});
  }
});

router.put('/:id', requireLogin, async (req, res) => {
  try {
    const { error } = serviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({error: error.details[0].message,});
    }
    const { id } = req.params;
    const { name } = req.body;
    const [rows] = await pool.query(`SELECT id FROM service WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Nie znaleziono działu!',
      });
    }
    await pool.query(`UPDATE service SET name = ? WHERE id = ?`, [name, id]);
    res.json({message: 'Dział został zaktualizowany pomyślnie!',});
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({error: 'Taki dział już istnieje!',});
    }
    console.error('Błąd podczas aktualizacji działu:', err);
    res.status(500).json({error: 'Błąd serwera przy aktualizacji działu'});
  }
});

router.delete('/:id', requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const [serviceRows] = await pool.query(`SELECT name FROM service WHERE id = ?`,[id]);
    if (serviceRows.length === 0) {
      return res.status(404).json({error: 'Nie znaleziono działu!',});
    }
    const serviceName = serviceRows[0].name;
    const [rows] = await pool.query(`SELECT COUNT(*) as count FROM items WHERE service_id = ?`,[id]);
    if (rows[0].count > 0) {
      return res.status(400).json({error: `Dział "${serviceName}" posiada przypisane przedmioty i nie może zostać usunięty.`,});
    }
    await pool.query(`DELETE FROM service WHERE id = ?`,[id]);
    res.json({message: 'Dział została usunięta pomyślnie!',});
  } catch (err) {
    console.error('Błąd podczas usuwania działu:', err);
    res.status(500).json({error: 'Błąd serwera przy usuwaniu działu',});
  }
});

module.exports = router;