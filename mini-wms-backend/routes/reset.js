const express = require("express");
const requireLogin = require("../middleware/requireLogin");
const resetDatabase = require("../resetDatabase");

const router = express.Router();

router.post("/", requireLogin, async (req, res) => {
  try {
    await resetDatabase();

    res.status(204).end();

  } catch (err) {
    console.error("Błąd resetowania bazy:", err);

    res.status(500).json({
      error: "Błąd serwera przy resetowaniu danych!"
    });
  }
});

module.exports = router;